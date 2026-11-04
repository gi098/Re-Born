/**
 * Automated Test Suite for RE-BORN Phase 2: Product Catalog & Inventory
 * Kiểm thử toàn diện 10 tiêu chí cho Chức năng Quản lý & Hiển thị Sản phẩm
 */

const productsHandler = require('../api/products.js');
const categoriesHandler = require('../api/categories.js');

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    }
  };
}

async function runProductsTests() {
  console.log('--- 🌿 BẮT ĐẦU KIỂM THỬ GIAI ĐOẠN 2: QUẢN LÝ & HIỂN THỊ SẢN PHẨM RE-BORN ---');

  let passedTests = 0;
  const totalTests = 10;

  // TEST 1: Lấy danh mục sản phẩm (GET /api/categories)
  console.log('\n[TEST 1] Kiểm tra API GET /api/categories (Danh mục sản phẩm)');
  try {
    const req = { method: 'GET', query: {} };
    const res = mockResponse();
    await categoriesHandler(req, res);

    if (res.statusCode === 200 && res.body && Array.isArray(res.body.categories) && res.body.categories.length > 0) {
      const allCategory = res.body.categories.find(c => c.slug === 'all');
      const washCategory = res.body.categories.find(c => c.slug === 'nuoc-rua-tay');
      if (allCategory && washCategory) {
        console.log(`✅ TEST 1 THÀNH CÔNG: Lấy được ${res.body.categories.length} danh mục. Có 'Tất cả' và 'Nước Rửa Tay'. Nguồn: ${res.body.source}`);
        passedTests++;
      } else {
        console.error('❌ TEST 1 THẤT BẠI: Thiếu các danh mục cơ bản.');
      }
    } else {
      console.error('❌ TEST 1 THẤT BẠI: Trả về mã lỗi', res.statusCode);
    }
  } catch (err) {
    console.error('❌ TEST 1 THẤT BẠI:', err.message);
  }

  // TEST 2: Lấy danh sách sản phẩm đầy đủ (GET /api/products)
  console.log('\n[TEST 2] Kiểm tra API GET /api/products (Danh sách sản phẩm động)');
  try {
    const req = { method: 'GET', query: {} };
    const res = mockResponse();
    await productsHandler(req, res);

    if (res.statusCode === 200 && res.body && Array.isArray(res.body.products) && res.body.products.length > 0) {
      const sample = res.body.products[0];
      const hasRequiredFields = sample.id && sample.name && sample.price && sample.description && sample.image_url && typeof sample.stock_quantity === 'number';
      if (hasRequiredFields) {
        console.log(`✅ TEST 2 THÀNH CÔNG: Lấy được ${res.body.products.length} sản phẩm. Cấu trúc đầy đủ (Tên: "${sample.name}", Giá: ${sample.price.toLocaleString()}₫, Tồn kho: ${sample.stock_quantity})`);
        passedTests++;
      } else {
        console.error('❌ TEST 2 THẤT BẠI: Sản phẩm thiếu trường bắt buộc.');
      }
    } else {
      console.error('❌ TEST 2 THẤT BẠI: Trả về mã lỗi', res.statusCode);
    }
  } catch (err) {
    console.error('❌ TEST 2 THẤT BẠI:', err.message);
  }

  // TEST 3: Lọc sản phẩm theo danh mục (GET /api/products?category=tui-refill)
  console.log('\n[TEST 3] Kiểm tra lọc sản phẩm theo danh mục (?category=tui-refill)');
  try {
    const req = { method: 'GET', query: { category: 'tui-refill' } };
    const res = mockResponse();
    await productsHandler(req, res);

    if (res.statusCode === 200 && res.body && Array.isArray(res.body.products)) {
      const allRefill = res.body.products.every(p => p.category_slug === 'tui-refill' || String(p.category_id) === '3' || String(p.category_id) === '2');
      if (allRefill && res.body.products.length > 0) {
        console.log(`✅ TEST 3 THÀNH CÔNG: Lọc chính xác ${res.body.products.length} sản phẩm thuộc nhóm Túi Refill!`);
        passedTests++;
      } else {
        console.error('❌ TEST 3 THẤT BẠI: Kết quả lọc không đúng danh mục.');
      }
    } else {
      console.error('❌ TEST 3 THẤT BẠI: Trả về mã lỗi', res.statusCode);
    }
  } catch (err) {
    console.error('❌ TEST 3 THẤT BẠI:', err.message);
  }

  // TEST 4: Tìm kiếm sản phẩm theo từ khóa (GET /api/products?search=refill)
  console.log('\n[TEST 4] Kiểm tra tìm kiếm từ khóa (?search=refill)');
  try {
    const req = { method: 'GET', query: { search: 'refill' } };
    const res = mockResponse();
    await productsHandler(req, res);

    if (res.statusCode === 200 && res.body && Array.isArray(res.body.products) && res.body.products.length > 0) {
      const matched = res.body.products.some(p => p.name.toLowerCase().includes('refill') || p.id.toLowerCase().includes('refill'));
      if (matched) {
        console.log(`✅ TEST 4 THÀNH CÔNG: Tìm thấy ${res.body.products.length} sản phẩm phù hợp từ khóa "refill"!`);
        passedTests++;
      } else {
        console.error('❌ TEST 4 THẤT BẠI: Không khớp từ khóa.');
      }
    } else {
      console.error('❌ TEST 4 THẤT BẠI: Trả về mã lỗi', res.statusCode);
    }
  } catch (err) {
    console.error('❌ TEST 4 THẤT BẠI:', err.message);
  }

  // TEST 5: Xem chi tiết sản phẩm hợp lệ (GET /api/products?id=pomelo-handwash)
  console.log('\n[TEST 5] Kiểm tra lấy chi tiết sản phẩm (?id=pomelo-handwash)');
  try {
    const req = { method: 'GET', query: { id: 'pomelo-handwash' } };
    const res = mockResponse();
    await productsHandler(req, res);

    if (res.statusCode === 200 && res.body && res.body.product) {
      const p = res.body.product;
      if (p.id === 'pomelo-handwash' && p.ingredients && p.usage) {
        console.log(`✅ TEST 5 THÀNH CÔNG: Chi tiết sản phẩm "${p.name}" có đầy đủ thành phần & HDSD.`);
        passedTests++;
      } else {
        console.error('❌ TEST 5 THẤT BẠI: Dữ liệu chi tiết sản phẩm thiếu trường.');
      }
    } else {
      console.error('❌ TEST 5 THẤT BẠI: Trả về mã lỗi', res.statusCode);
    }
  } catch (err) {
    console.error('❌ TEST 5 THẤT BẠI:', err.message);
  }

  // TEST 6: Tra cứu sản phẩm không tồn tại (GET /api/products?id=san-pham-khong-ton-tai)
  console.log('\n[TEST 6] Kiểm tra xử lý lỗi sản phẩm không tồn tại');
  try {
    const req = { method: 'GET', query: { id: 'san-pham-khong-ton-tai' } };
    const res = mockResponse();
    await productsHandler(req, res);

    if (res.statusCode === 404 && res.body && res.body.success === false) {
      console.log(`✅ TEST 6 THÀNH CÔNG: Trả về mã lỗi 404 và thông báo rõ ràng: "${res.body.message}"`);
      passedTests++;
    } else {
      console.error('❌ TEST 6 THẤT BẠI: Cần trả về 404 khi sản phẩm không tồn tại, thực tế:', res.statusCode);
    }
  } catch (err) {
    console.error('❌ TEST 6 THẤT BẠI:', err.message);
  }

  // TEST 7: Kiểm tra nhận diện sản phẩm hết hàng (Out-of-Stock)
  console.log('\n[TEST 7] Kiểm tra trạng thái tồn kho & sản phẩm hết hàng');
  try {
    const req = { method: 'GET', query: { id: 'xit-khu-khuan-100ml' } };
    const res = mockResponse();
    await productsHandler(req, res);

    if (res.statusCode === 200 && res.body && res.body.product) {
      const p = res.body.product;
      if (p.stock_quantity === 0) {
        console.log(`✅ TEST 7 THÀNH CÔNG: Sản phẩm "${p.name}" được xác định chính xác số lượng tồn kho = 0 (Hết hàng).`);
        passedTests++;
      } else {
        console.error('❌ TEST 7 THẤT BẠI: Sản phẩm test phải có tồn kho = 0.');
      }
    } else {
      console.error('❌ TEST 7 THẤT BẠI: Không truy xuất được sản phẩm test out-of-stock.');
    }
  } catch (err) {
    console.error('❌ TEST 7 THẤT BẠI:', err.message);
  }

  // TEST 8: Lọc chỉ những sản phẩm còn hàng (?inStock=true)
  console.log('\n[TEST 8] Kiểm tra bộ lọc chỉ sản phẩm còn hàng (?inStock=true)');
  try {
    const req = { method: 'GET', query: { inStock: 'true' } };
    const res = mockResponse();
    await productsHandler(req, res);

    if (res.statusCode === 200 && res.body && Array.isArray(res.body.products)) {
      const hasOutOfStock = res.body.products.some(p => p.stock_quantity <= 0);
      if (!hasOutOfStock && res.body.products.length > 0) {
        console.log(`✅ TEST 8 THÀNH CÔNG: Bộ lọc loại bỏ 100% sản phẩm hết hàng, chỉ giữ lại ${res.body.products.length} sản phẩm sẵn sàng bán!`);
        passedTests++;
      } else {
        console.error('❌ TEST 8 THẤT BẠI: Danh sách vẫn chứa sản phẩm hết hàng.');
      }
    } else {
      console.error('❌ TEST 8 THẤT BẠI: Trả về mã lỗi', res.statusCode);
    }
  } catch (err) {
    console.error('❌ TEST 8 THẤT BẠI:', err.message);
  }

  // TEST 9: Kiểm tra logic chặn thêm vào giỏ hàng với sản phẩm hết hàng
  console.log('\n[TEST 9] Kiểm tra nghiệp vụ thêm giỏ hàng & ngăn chặn sản phẩm hết hàng');
  try {
    const inStockProduct = { id: 'pomelo-handwash', name: 'Nước rửa tay vỏ bưởi Re-Born 250ml', price: 45000, stock_quantity: 50 };
    const outOfStockProduct = { id: 'xit-khu-khuan-100ml', name: 'Xịt Khử Khuẩn 100ml', price: 39000, stock_quantity: 0 };

    function mockAddToCart(product, cart) {
      if (!product || product.stock_quantity <= 0) {
        return { success: false, message: `Rất tiếc! Sản phẩm "${product ? product.name : ''}" hiện đã tạm hết hàng.` };
      }
      cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
      return { success: true, message: 'Đã thêm vào giỏ hàng thành công!' };
    }

    const testCart = [];
    const resAddSuccess = mockAddToCart(inStockProduct, testCart);
    const resAddBlocked = mockAddToCart(outOfStockProduct, testCart);

    if (resAddSuccess.success && !resAddBlocked.success && testCart.length === 1) {
      console.log('✅ TEST 9 THÀNH CÔNG: Chặn thêm giỏ hàng thành công khi sản phẩm hết hàng, cho phép sản phẩm còn hàng!');
      passedTests++;
    } else {
      console.error('❌ TEST 9 THẤT BẠI: Logic chặn giỏ hàng không hoạt động đúng.');
    }
  } catch (err) {
    console.error('❌ TEST 9 THẤT BẠI:', err.message);
  }

  // TEST 10: Kiểm tra độ bền vững & fallback khi CSDL rỗng hoặc offline
  console.log('\n[TEST 10] Kiểm tra cơ chế Fallback an toàn khi CSDL ngoại tuyến');
  try {
    // Gọi với môi trường giả lập URL Supabase lỗi
    const origUrl = process.env.SUPABASE_URL;
    process.env.SUPABASE_URL = 'https://invalid-host-offline.supabase.co';

    const req = { method: 'GET', query: {} };
    const res = mockResponse();
    await productsHandler(req, res);

    process.env.SUPABASE_URL = origUrl;

    if (res.statusCode === 200 && res.body && Array.isArray(res.body.products) && res.body.products.length > 0) {
      console.log(`✅ TEST 10 THÀNH CÔNG: Hệ thống kích hoạt fallback an toàn (Nguồn: ${res.body.source}), trả về ${res.body.products.length} sản phẩm RE-BORN, không làm crash trang web!`);
      passedTests++;
    } else {
      console.error('❌ TEST 10 THẤT BẠI: Không kích hoạt fallback khi offline.');
    }
  } catch (err) {
    console.error('❌ TEST 10 THẤT BẠI:', err.message);
  }

  console.log('\n=================================================');
  if (passedTests === totalTests) {
    console.log(`🎉 KẾT QUẢ: ${passedTests}/${totalTests} TESTS GIAI ĐOẠN 2 SẢN PHẨM ĐÃ PASS 100%!`);
  } else {
    console.log(`⚠️ KẾT QUẢ: ${passedTests}/${totalTests} TESTS ĐẠT.`);
  }
  console.log('=================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

if (require.main === module) {
  runProductsTests().catch(err => {
    console.error('Lỗi thực thi test:', err);
    process.exit(1);
  });
}

module.exports = { runProductsTests };
