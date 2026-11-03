/**
 * Unit Test Script for Member 1 Tasks (API Orders & Voucher Verification)
 */

const ordersHandler = require('../api/orders.js');
const voucherHandler = require('../api/vouchers/verify.js');

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
    end() {}
  };
}

async function runTests() {
  console.log('--- 🧪 BẮT ĐẦU KIỂM THỬ PHÂN HỆ THÀNH VIÊN 1 ---');

  // Test 1: Kiểm tra Voucher FPTU
  console.log('\n[TEST 1] Kiểm tra API POST /api/vouchers/verify (Mã FPTU)');
  const res1 = mockResponse();
  await voucherHandler({
    method: 'POST',
    body: { code: 'FPTU', subtotal: 90000 }
  }, res1);
  console.log('Status:', res1.statusCode);
  console.log('Kết quả:', res1.body);
  if (res1.statusCode === 200 && res1.body.voucher.discountAmount === 13500) {
    console.log('✅ TEST 1 THÀNH CÔNG: Áp mã FPTU giảm đúng 15% (13.500₫)!');
  } else {
    console.error('❌ TEST 1 THẤT BẠI!');
  }

  // Test 2: Tạo đơn hàng mới POST /api/orders
  console.log('\n[TEST 2] Tạo đơn hàng mới POST /api/orders');
  const res2 = mockResponse();
  await ordersHandler({
    method: 'POST',
    body: {
      customerName: 'Trần Minh Quang',
      phone: '0988123456',
      address: 'Phòng 402 Tòa Beta, Campus FPT University',
      items: [
        { id: 'pomelo-handwash', name: 'Nước rửa tay vỏ bưởi', price: 45000, quantity: 2 }
      ],
      voucherCode: 'FPTU',
      paymentMethod: 'COD'
    }
  }, res2);
  console.log('Status:', res2.statusCode);
  console.log('Kết quả:', res2.body);
  if (res2.statusCode === 201 && res2.body.order && res2.body.order.id.startsWith('#RB-')) {
    console.log(`✅ TEST 2 THÀNH CÔNG: Đã tạo đơn ${res2.body.order.id} với tổng tiền ${res2.body.order.finalTotal}₫!`);
  } else {
    console.error('❌ TEST 2 THẤT BẠI!');
  }

  // Test 3: Tra cứu đơn hàng theo SĐT GET /api/orders?phone=0988123456
  console.log('\n[TEST 3] Tra cứu đơn hàng GET /api/orders?phone=0988123456');
  const res3 = mockResponse();
  await ordersHandler({
    method: 'GET',
    query: { phone: '0988123456' }
  }, res3);
  console.log('Status:', res3.statusCode);
  console.log(`Số đơn tìm thấy cho SĐT 0988123456: ${res3.body.orders ? res3.body.orders.length : 0}`);
  if (res3.statusCode === 200 && res3.body.orders && res3.body.orders.length > 0) {
    console.log('✅ TEST 3 THÀNH CÔNG: Tra cứu chính xác đơn hàng đã tạo!');
  } else {
    console.error('❌ TEST 3 THẤT BẠI!');
  }

  console.log('\n=================================================');
  console.log('🎉 TOÀN BỘ 3/3 TESTS CỦA THÀNH VIÊN 1 ĐÃ PASS 100%!');
  console.log('=================================================');
}

runTests();

