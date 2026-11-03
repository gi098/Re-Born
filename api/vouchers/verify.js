/**
 * Vercel Serverless API: /api/vouchers/verify
 * Phân hệ Thành viên 1: Kiểm tra tính hợp lệ của mã giảm giá
 */

const VOUCHER_DATABASE = {
  'FPTU': {
    code: 'FPTU',
    description: 'Ưu đãi sinh viên Campus FPT (Giảm 15%)',
    discountPercent: 15,
    minOrderValue: 0,
    maxDiscount: 50000,
    active: true
  },
  'REBORN15': {
    code: 'REBORN15',
    description: 'Mã chào bạn mới sống xanh (Giảm 15%)',
    discountPercent: 15,
    minOrderValue: 0,
    maxDiscount: 50000,
    active: true
  },
  'TIETKIEM20': {
    code: 'TIETKIEM20',
    description: 'Tri ân mẻ bưởi đầu tiên (Giảm 20% đơn từ 100k)',
    discountPercent: 20,
    minOrderValue: 100000,
    maxDiscount: 70000,
    active: true
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { code, subtotal } = body || {};

    if (!code) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập mã giảm giá' });
    }

    const cleanCode = code.trim().toUpperCase();
    const voucher = VOUCHER_DATABASE[cleanCode];

    if (!voucher || !voucher.active) {
      return res.status(404).json({ success: false, message: 'Mã ưu đãi không tồn tại hoặc đã hết hạn' });
    }

    const currentSubtotal = parseInt(subtotal, 10) || 0;
    if (voucher.minOrderValue > 0 && currentSubtotal < voucher.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Mã ${cleanCode} chỉ áp dụng cho đơn hàng từ ${voucher.minOrderValue.toLocaleString('vi-VN')}₫ trở lên`
      });
    }

    const rawDiscount = Math.round((currentSubtotal * voucher.discountPercent) / 100);
    const finalDiscount = Math.min(rawDiscount, voucher.maxDiscount);

    return res.status(200).json({
      success: true,
      message: `Áp dụng thành công mã ${cleanCode}! Giảm ${voucher.discountPercent}%`,
      voucher: {
        code: voucher.code,
        description: voucher.description,
        discountPercent: voucher.discountPercent,
        discountAmount: finalDiscount
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi kiểm tra voucher', error: err.message });
  }
};

