/**
 * Vercel Serverless API: /api/products
 * Giai đoạn 2: Quản lý và cung cấp dữ liệu sản phẩm RE-BORN
 */

const https = require('https');

// Danh mục sản phẩm chuẩn RE-BORN (Dùng khi CSDL chưa có dữ liệu hoặc offline)
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Tất cả', slug: 'all', description: 'Tất cả sản phẩm trong bộ sưu tập' },
  { id: 2, name: 'Nước Rửa Tay', slug: 'nuoc-rua-tay', description: 'Nước rửa tay vỏ bưởi hữu cơ' },
  { id: 3, name: 'Túi Refill', slug: 'tui-refill', description: 'Túi nạp lại tiết kiệm rác nhựa' },
  { id: 4, name: 'Combo Tiết Kiệm', slug: 'combo-qua-tang', description: 'Gói ưu đãi mua chung sinh viên' }
];

const FALLBACK_PRODUCTS = [
  {
    id: 'pomelo-handwash',
    name: 'Nước rửa tay vỏ bưởi Re-Born 250ml',
    sub: 'VỎ BƯỞI ÉP LẠNH • TUYẾT TÙNG • THẢO MỘC',
    price: 45000,
    original_price: 55000,
    volume: '250 ml • Chai rPET vòi nhấn',
    image_url: 'assets/images/product_handwash.jpg',
    category_id: 2,
    category_name: 'Nước Rửa Tay',
    category_slug: 'nuoc-rua-tay',
    stock_quantity: 50,
    is_active: true,
    sku: 'RB-HW-250',
    description: 'Công thức làm sạch dịu lành kết hợp tinh dầu vỏ bưởi ép chậm và thảo mộc tự nhiên. Đánh bay 99.9% vi khuẩn, nuôi dưỡng màng ẩm da tay và để lại hương cam chanh thanh tĩnh.',
    ingredients: 'Chiết xuất tinh dầu vỏ bưởi Citrus Maxima ép lạnh, Glycerin thực vật hữu cơ, Decyl Glucoside (gốc dừa lành tính), Nước khoáng tinh khiết, Tinh dầu tuyết tùng.',
    usage: 'Bơm một lượng vừa đủ (1 lần nhấn), tạo bọt nhẹ nhàng khắp bàn tay trong 30 giây để hương thơm tự nhiên lan tỏa trọn vẹn, sau đó xả sạch với nước.'
  },
  {
    id: 'pomelo-refill',
    name: 'Túi Refill Nước rửa tay vỏ bưởi 500ml',
    sub: 'VỎ BƯỞI ÉP LẠNH • TIẾT KIỆM RÁC NHỰA',
    price: 75000,
    original_price: 90000,
    volume: '500 ml • Túi sinh thái tiết kiệm',
    image_url: 'assets/images/product_refill.jpg',
    category_id: 3,
    category_name: 'Túi Refill',
    category_slug: 'tui-refill',
    stock_quantity: 35,
    is_active: true,
    sku: 'RB-RF-500',
    description: 'Dung tích nhân đôi 500ml tiện lợi rót đầy lại 2 chai vòi nhấn cũ. Tiết kiệm 15.000₫ chi phí và chung tay cắt giảm 80% rác thải nhựa so với việc mua chai mới.',
    ingredients: 'Chiết xuất vỏ bưởi hữu cơ tái sinh, Glycerin thực vật màng ẩm, Decyl Glucoside gốc dừa, Nước khoáng tinh khiết, Tinh dầu thảo mộc dưỡng da.',
    usage: 'Mở nắp vặn túi refill, rót chậm rãi vào chai nước rửa tay 250ml Re-Born có sẵn. Vặn chặt nắp chai và tái sử dụng vỏ túi cho lần thu gom kế tiếp.'
  },
  {
    id: 'eco-giftset',
    name: 'Combo Đôi • 2 Nước rửa tay + Túi vải Canvas',
    sub: '2 CHAI RỬA TAY 250ML + TÚI VẢI CANVAS',
    price: 89000,
    original_price: 110000,
    volume: 'Set 3 món (2 chai 250ml + túi vải)',
    image_url: 'assets/images/hero_product.jpg',
    category_id: 4,
    category_name: 'Combo Tiết Kiệm',
    category_slug: 'combo-qua-tang',
    stock_quantity: 20,
    is_active: true,
    sku: 'RB-CB-DUO',
    description: 'Gói ưu đãi mua chung 2 chai nước rửa tay vỏ bưởi 250ml tặng kèm túi vải dệt thô Canvas Re-Born. Lựa chọn lý tưởng cho bạn bè cùng phòng KTX rủ nhau sống xanh.',
    ingredients: 'Bao gồm: 2 Chai Nước rửa tay vỏ bưởi 250ml có vòi nhấn + 1 Túi vải Canvas thời trang Re-Born.',
    usage: 'Sử dụng hàng ngày tại lavabo phòng khách, nhà bếp hoặc làm quà tặng ý nghĩa cho bạn bè và người thân yêu.'
  },
  {
    id: 'can-si-3l',
    name: 'Can Sỉ 3L Nước rửa tay vỏ bưởi (Cafe & Homestay)',
    sub: 'DUNG TÍCH LỚN • B2B & KHÁCH SẠN ECO',
    price: 320000,
    original_price: 380000,
    volume: '3000 ml • Can nhựa tái sinh',
    image_url: 'assets/images/reborn_clean_showcase.jpg',
    category_id: 3,
    category_name: 'Túi Refill',
    category_slug: 'tui-refill',
    stock_quantity: 8,
    is_active: true,
    sku: 'RB-CAN-3L',
    description: 'Dung tích lớn chuyên dụng cho quầy lavabo quán cà phê, tiệm trà và homestay sinh thái. Tinh dầu bưởi tự nhiên tạo ấn tượng thanh mát khó quên cho khách hàng.',
    ingredients: 'Tinh dầu vỏ bưởi chưng cất tự nhiên, màng ẩm Glycerin, Decyl Glucoside gốc dừa hữu cơ, Nước tinh khiết.',
    usage: 'Dùng phễu chiết sang các bình vòi nhấn tại quầy vệ sinh quán hoặc khu vực rửa tay phục vụ khách.'
  },
  {
    id: 'xit-khu-khuan-100ml',
    name: 'Xịt Khử Khuẩn Vỏ Bưởi Đa Năng 100ml',
    sub: 'MẪU R&D • BỎ TÚI TIỆN LỢI',
    price: 39000,
    original_price: 49000,
    volume: '100 ml • Chai xịt phun sương',
    image_url: 'assets/images/reborn_minimal_bottle.jpg',
    category_id: 2,
    category_name: 'Nước Rửa Tay',
    category_slug: 'nuoc-rua-tay',
    stock_quantity: 0, // Hết hàng (Kiểm thử chức năng Out-of-Stock)
    is_active: true,
    sku: 'RB-SP-100',
    description: 'Xịt kháng khuẩn cá nhân từ cồn thực vật lên men và tinh dầu bưởi tự nhiên. Làm sạch nhanh chóng bàn phím, điện thoại, tay nắm cửa khi ra ngoài.',
    ingredients: 'Cồn mía lên men tự nhiên 70 độ, Tinh dầu vỏ bưởi nguyên chất, Vitamin E dưỡng ẩm, Nước khoáng.',
    usage: 'Xịt trực tiếp lên tay hoặc bề mặt cần khử khuẩn từ khoảng cách 15cm. Để khô tự nhiên sau 15 giây.'
  }
];

// Helper gọi Supabase REST API
function fetchFromSupabase(endpoint) {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://uovqydazhplufaezjsxd.supabase.co';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jKJ8BoQ1Cdk-9VCedVtvEg_jaLJulOY';

  return new Promise((resolve, reject) => {
    try {
      const url = `${supabaseUrl}/rest/v1/${endpoint}`;
      const parsedUrl = new URL(url);

      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Accept': 'application/json'
        },
        timeout: 4000
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(body || '[]');
              resolve(data);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`Supabase returned status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Supabase request timeout'));
      });
      req.end();

    } catch (err) {
      reject(err);
    }
  });
}

module.exports = async (req, res) => {
  // Cấu hình CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const query = req.query || {};
  const { id, category, search, inStock } = query;

  let products = [];
  let categories = FALLBACK_CATEGORIES;
  let dataSource = 'database';

  try {
    // 1. Lấy danh sách sản phẩm từ Supabase CSDL thật
    const dbProducts = await fetchFromSupabase('products?select=*&is_active=eq.true');
    
    // Thử lấy danh mục từ Supabase nếu có
    try {
      const dbCategories = await fetchFromSupabase('categories?select=*');
      if (Array.isArray(dbCategories) && dbCategories.length > 0) {
        categories = [
          { id: 'all', name: 'Tất cả', slug: 'all', description: 'Tất cả sản phẩm' },
          ...dbCategories
        ];
      }
    } catch (e) {
      // Giữ fallback categories
    }

    if (Array.isArray(dbProducts) && dbProducts.length > 0) {
      products = dbProducts.map(p => {
        // Map category nếu có
        const matchedCat = categories.find(c => c.id === p.category_id || c.slug === p.category_id);
        return {
          id: p.id,
          name: p.name,
          sub: p.sub || p.subtitle || (matchedCat ? matchedCat.name.toUpperCase() : 'CHIẾT XUẤT VỎ BƯỞI ÉP LẠNH'),
          price: parseInt(p.price, 10) || 45000,
          original_price: p.original_price ? parseInt(p.original_price, 10) : Math.round((parseInt(p.price, 10) || 45000) * 1.2),
          volume: p.volume || '250 ml',
          image_url: p.image_url || 'assets/images/product_handwash.jpg',
          category_id: p.category_id,
          category_name: matchedCat ? matchedCat.name : 'Nước Rửa Tay',
          category_slug: matchedCat ? matchedCat.slug : 'nuoc-rua-tay',
          stock_quantity: typeof p.stock_quantity === 'number' ? p.stock_quantity : 20,
          is_active: p.is_active !== false,
          sku: p.sku || `RB-${p.id}`,
          description: p.description || 'Sản phẩm nước rửa tay vỏ bưởi thiên nhiên Re-Born.',
          ingredients: p.ingredients || 'Tinh dầu vỏ bưởi tự nhiên, Glycerin thực vật, Nước khoáng tinh khiết.',
          usage: p.usage || 'Nhấn vòi 1-2 lần, rửa tay nhẹ nhàng với nước trong 30 giây rồi xả sạch.'
        };
      });
    } else {
      // CSDL Supabase rỗng (chưa chạy seed SQL): Dùng fallback catalog an toàn
      products = FALLBACK_PRODUCTS;
      dataSource = 'fallback_empty_db';
    }

  } catch (err) {
    // Supabase offline hoặc lỗi kết nối: Fallback sang catalog tiêu chuẩn
    console.warn('API /api/products kết nối CSDL Supabase thất bại, kích hoạt fallback:', err.message);
    products = FALLBACK_PRODUCTS;
    dataSource = 'fallback_offline';
  }

  // 2. Lọc theo ID sản phẩm (Chi tiết sản phẩm)
  if (id) {
    const singleProduct = products.find(p => String(p.id).toLowerCase() === String(id).toLowerCase() || (p.sku && p.sku.toLowerCase() === String(id).toLowerCase()));
    if (!singleProduct) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy sản phẩm có mã ID "${id}"`
      });
    }
    return res.status(200).json({
      success: true,
      product: singleProduct,
      source: dataSource
    });
  }

  // 3. Lọc theo Danh mục (Category Filter)
  if (category && category !== 'all') {
    products = products.filter(p => 
      String(p.category_id).toLowerCase() === String(category).toLowerCase() ||
      (p.category_slug && p.category_slug.toLowerCase() === String(category).toLowerCase())
    );
  }

  // 4. Tìm kiếm từ khóa (Search Keyword Filter)
  if (search) {
    const cleanSearch = String(search).trim().toLowerCase();
    products = products.filter(p => 
      (p.name && p.name.toLowerCase().includes(cleanSearch)) ||
      (p.description && p.description.toLowerCase().includes(cleanSearch)) ||
      (p.sub && p.sub.toLowerCase().includes(cleanSearch)) ||
      (p.sku && p.sku.toLowerCase().includes(cleanSearch))
    );
  }

  // 5. Lọc theo trạng thái còn hàng (In Stock Filter)
  if (inStock === 'true') {
    products = products.filter(p => p.stock_quantity > 0);
  }

  return res.status(200).json({
    success: true,
    count: products.length,
    products,
    categories,
    source: dataSource
  });
};

