/**
 * Vercel Serverless API: /api/orders/track
 * Phân hệ Thành viên 1: Tra cứu lịch sử & trạng thái đơn hàng theo Số Điện Thoại
 */

const ordersHandler = require('../orders.js');

module.exports = async (req, res) => {
  // Chuyển hướng xử lý sang GET /api/orders?phone=...
  req.method = 'GET';
  return ordersHandler(req, res);
};

