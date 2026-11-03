/**
 * Vercel Serverless API: /api/orders
 * Phân hệ Thành viên 1: Quản lý Đơn hàng RE-BORN
 */

const fs = require('fs');
const path = require('path');

// Đảm bảo thư mục lưu trữ cục bộ khi chạy offline/test
const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function getStoredOrders() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

function saveStoredOrders(orders) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving orders file:', err);
  }
}

module.exports = async (req, res) => {
  // Cấu hình CORS cho mọi yêu cầu từ Web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Lấy danh sách đơn hàng (hỗ trợ lọc theo SĐT, user_id hoặc mã đơn)
  if (req.method === 'GET') {
    const { phone, code, userId } = req.query || {};
    const orders = getStoredOrders();

    if (code) {
      const match = orders.find(o => o.id.toLowerCase() === code.toLowerCase());
      if (!match) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
      }
      return res.status(200).json({ success: true, order: match });
    }

    if (userId) {
      const matches = orders.filter(o => o.userId === userId);
      return res.status(200).json({ success: true, count: matches.length, orders: matches });
    }

    if (phone) {
      const cleanPhone = phone.replace(/\s+/g, '');
      const matches = orders.filter(o => o.phone.replace(/\s+/g, '') === cleanPhone);
      return res.status(200).json({ success: true, orders: matches });
    }

    return res.status(200).json({ success: true, count: orders.length, orders });
  }

  // POST: Tạo đơn hàng mới
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { customerName, phone, address, items, voucherCode, paymentMethod, notes, userId } = body || {};

      // 1. Validate dữ liệu đầu vào (Validation Checks)
      if (!customerName || !customerName.trim()) {
        return res.status(400).json({ success: false, message: 'Họ tên khách hàng không được để trống' });
      }

      const vnPhoneRegex = /(03|05|07|08|09)+([0-9]{8})\b/;
      const cleanPhone = (phone || '').replace(/\s+/g, '');
      if (!vnPhoneRegex.test(cleanPhone)) {
        return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ (cần 10 chữ số)' });
      }

      if (!address || !address.trim()) {
        return res.status(400).json({ success: false, message: 'Nơi nhận hàng không được để trống' });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Giỏ hàng chưa có sản phẩm nào' });
      }

      // 2. Tính toán tiền hàng trên máy chủ (Server-side calculation)
      let subtotal = 0;
      const processedItems = items.map(item => {
        const qty = Math.max(1, parseInt(item.quantity || item.qty || 1, 10));
        const price = parseInt(item.price, 10) || 45000;
        subtotal += price * qty;
        return {
          productId: item.id || item.productId || 'pomelo-handwash',
          name: item.name || 'Nước rửa tay vỏ bưởi',
          volume: item.volume || '250 ml',
          price,
          quantity: qty,
          itemTotal: price * qty
        };
      });

      // 3. Xử lý Voucher chiết khấu
      let discountAmount = 0;
      let appliedVoucher = null;
      if (voucherCode) {
        const cleanCode = voucherCode.trim().toUpperCase();
        if (cleanCode === 'FPTU' || cleanCode === 'REBORN15') {
          discountAmount = Math.round(subtotal * 0.15);
          appliedVoucher = cleanCode;
        } else if (cleanCode === 'TIETKIEM20' && subtotal >= 100000) {
          discountAmount = Math.round(subtotal * 0.20);
          appliedVoucher = cleanCode;
        }
      }

      // 4. Phí vận chuyển (Freeship từ 150.000đ)
      const shippingFee = subtotal >= 150000 ? 0 : 20000;
      const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

      // 5. Sinh mã đơn hàng chuẩn định dạng Y Combinator: #RB-XXXXXX
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      const orderId = `#RB-${randomDigits}`;

      const newOrder = {
        id: orderId,
        customerName: customerName.trim(),
        phone: cleanPhone,
        address: address.trim(),
        userId: userId || null,
        subtotal,
        shippingFee,
        discountAmount,
        finalTotal,
        voucherCode: appliedVoucher,
        paymentMethod: paymentMethod === 'VIETQR' || paymentMethod === 'qr' ? 'VIETQR' : 'COD',
        paymentStatus: paymentMethod === 'VIETQR' || paymentMethod === 'qr' ? 'PENDING' : 'PENDING',
        orderStatus: 'NEW',
        items: processedItems,
        notes: notes || '',
        createdAt: new Date().toISOString()
      };

      // 6. Lưu vào bộ nhớ/Database
      const orders = getStoredOrders();
      orders.unshift(newOrder);
      saveStoredOrders(orders);

      return res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công!',
        order: newOrder
      });

    } catch (err) {
      console.error('Server order processing error:', err);
      return res.status(500).json({ success: false, message: 'Lỗi xử lý đơn hàng trên máy chủ', error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
};

