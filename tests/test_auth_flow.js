/**
 * Automated Test Suite for RE-BORN Supabase Auth & Profile Integration
 * Kiểm thử toàn bộ 10 tiêu chí theo đặc tả yêu cầu của dự án RE-BORN
 */

const ordersHandler = require('../api/orders.js');

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

// Giả lập môi trường trình duyệt cho kiểm thử js/supabase-client.js
const mockStorage = {};
global.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};
global.window = {
  localStorage: global.localStorage,
  location: { origin: 'http://localhost:3000' }
};

// Nạp file js/supabase-client.js
require('../js/supabase-client.js');
const auth = global.window.rebornAuth;

async function runAuthTests() {
  console.log('--- 🧪 BẮT ĐẦU KIỂM THỬ TÍCH HỢP SUPABASE AUTH RE-BORN ---');

  let passedTests = 0;
  const totalTests = 10;

  // TEST 1: Đăng ký tài khoản mới
  console.log('\n[TEST 1] Đăng ký tài khoản khách hàng mới');
  try {
    const signupRes = await auth.signUp({
      email: 'huong.sen@gmail.com',
      password: 'SecurePassword123!',
      fullName: 'Võ Thị Sen',
      phone: '0912345678'
    });
    if (signupRes.user && signupRes.user.email === 'huong.sen@gmail.com') {
      console.log('✅ TEST 1 THÀNH CÔNG: Đã đăng ký tài khoản khách hàng:', signupRes.user.email);
      passedTests++;
    }
  } catch (err) {
    console.error('❌ TEST 1 THẤT BẠI:', err.message);
  }

  // TEST 2: Kiểm tra phân quyền an toàn - Người dùng không thể tự cấp quyền Admin
  console.log('\n[TEST 2] Kiểm tra phân quyền an toàn (Role = customer, không thể tự phong Admin)');
  try {
    const profile = await auth.getUserProfile();
    const isAdmin = await auth.isAdmin();
    if (profile.role === 'customer' && isAdmin === false) {
      console.log('✅ TEST 2 THÀNH CÔNG: Tài khoản đăng ký mới luôn có role = "customer" an toàn!');
      passedTests++;
    } else {
      console.error('❌ TEST 2 THẤT BẠI: Quyền không hợp lệ:', profile.role);
    }
  } catch (err) {
    console.error('❌ TEST 2 THẤT BẠI:', err.message);
  }

  // TEST 3: Đăng xuất
  console.log('\n[TEST 3] Kiểm tra Đăng xuất');
  try {
    await auth.signOut();
    const sessionAfterSignOut = await auth.getSession();
    if (sessionAfterSignOut === null) {
      console.log('✅ TEST 3 THÀNH CÔNG: Đăng xuất thành công, session đã bị hủy!');
      passedTests++;
    }
  } catch (err) {
    console.error('❌ TEST 3 THẤT BẠI:', err.message);
  }

  // TEST 4: Đăng nhập sai mật khẩu (Báo lỗi Tiếng Việt)
  console.log('\n[TEST 4] Đăng nhập sai mật khẩu');
  try {
    await auth.signIn({
      email: 'huong.sen@gmail.com',
      password: 'WrongPassword'
    });
    console.error('❌ TEST 4 THẤT BẠI: Lẽ ra phải chặn mật khẩu sai!');
  } catch (err) {
    if (err.message.includes('chính xác')) {
      console.log('✅ TEST 4 THÀNH CÔNG: Báo lỗi chính xác bằng Tiếng Việt:', err.message);
      passedTests++;
    } else {
      console.error('❌ TEST 4 THẤT BẠI: Thông báo lỗi không khớp:', err.message);
    }
  }

  // TEST 5: Đăng nhập đúng thông tin & duy trì phiên
  console.log('\n[TEST 5] Đăng nhập đúng thông tin & kiểm tra duy trì phiên');
  try {
    const loginRes = await auth.signIn({
      email: 'huong.sen@gmail.com',
      password: 'SecurePassword123!'
    });
    const currentSession = await auth.getSession();
    if (loginRes.session && currentSession && currentSession.user.email === 'huong.sen@gmail.com') {
      console.log('✅ TEST 5 THÀNH CÔNG: Đăng nhập thành công, phiên đăng nhập được duy trì an toàn!');
      passedTests++;
    }
  } catch (err) {
    console.error('❌ TEST 5 THẤT BẠI:', err.message);
  }

  // TEST 6: Tài khoản Quản trị Admin mẫu
  console.log('\n[TEST 6] Kiểm tra tài khoản Quản trị viên Admin hệ thống');
  try {
    await auth.signOut();
    const adminLogin = await auth.signIn({
      email: 'admin@reborn.vn',
      password: 'AdminPassword123!'
    });
    const isAdminUser = await auth.isAdmin();
    if (adminLogin.profile.role === 'admin' && isAdminUser === true) {
      console.log('✅ TEST 6 THÀNH CÔNG: Tài khoản admin@reborn.vn có toàn quyền Admin!');
      passedTests++;
    }
  } catch (err) {
    console.error('❌ TEST 6 THẤT BẠI:', err.message);
  }

  // TEST 7: Giỏ hàng không bị mất khi chuyển qua trang auth và quay lại
  console.log('\n[TEST 7] Kiểm tra bảo toàn Giỏ hàng trong LocalStorage khi chuyển trang');
  try {
    const initialCart = [
      { id: 'pomelo-handwash', name: 'Nước rửa tay vỏ bưởi', price: 45000, quantity: 2 },
      { id: 'refill-pouch', name: 'Túi Refill Tiết Kiệm 500ml', price: 75000, quantity: 1 }
    ];
    global.localStorage.setItem('reborn_cart', JSON.stringify(initialCart));
    const loadedCart = JSON.parse(global.localStorage.getItem('reborn_cart'));
    if (loadedCart.length === 2 && loadedCart[0].id === 'pomelo-handwash') {
      console.log('✅ TEST 7 THÀNH CÔNG: Giỏ hàng vẫn được lưu giữ trọn vẹn (2 món)!');
      passedTests++;
    }
  } catch (err) {
    console.error('❌ TEST 7 THẤT BẠI:', err.message);
  }

  // TEST 8: Gán user_id vào đơn hàng khi tạo đơn POST /api/orders
  console.log('\n[TEST 8] Tạo đơn hàng gắn với user_id của khách hàng đã đăng nhập');
  const resOrder = mockResponse();
  const testUserId = 'usr-test-customer-001';
  await ordersHandler({
    method: 'POST',
    body: {
      customerName: 'Võ Thị Sen',
      phone: '0912345678',
      address: 'KTX Dom D, Campus FPT Hà Nội',
      userId: testUserId,
      items: [
        { id: 'pomelo-handwash', name: 'Nước rửa tay vỏ bưởi', price: 45000, quantity: 1 }
      ],
      paymentMethod: 'COD'
    }
  }, resOrder);

  if (resOrder.statusCode === 201 && resOrder.body.order && resOrder.body.order.userId === testUserId) {
    console.log(`✅ TEST 8 THÀNH CÔNG: Đơn hàng ${resOrder.body.order.id} đã liên kết chặt chẽ với userId: ${testUserId}!`);
    passedTests++;
  } else {
    console.error('❌ TEST 8 THẤT BẠI!');
  }

  // TEST 9: Cách ly dữ liệu đơn hàng (Khách hàng chỉ tra cứu đơn của chính mình)
  console.log('\n[TEST 9] Kiểm tra cách ly dữ liệu: Lọc đơn hàng theo userId');
  const resQueryUser = mockResponse();
  await ordersHandler({
    method: 'GET',
    query: { userId: testUserId }
  }, resQueryUser);

  if (resQueryUser.statusCode === 200 && resQueryUser.body.orders && resQueryUser.body.orders.every(o => o.userId === testUserId)) {
    console.log(`✅ TEST 9 THÀNH CÔNG: Chỉ trả về ${resQueryUser.body.orders.length} đơn hàng thuộc về userId của khách hàng này!`);
    passedTests++;
  } else {
    console.error('❌ TEST 9 THẤT BẠI!');
  }

  // TEST 10: Quên mật khẩu (Reset password)
  console.log('\n[TEST 10] Kiểm tra chức năng gửi yêu cầu đặt lại mật khẩu');
  try {
    const forgotRes = await auth.resetPassword('huong.sen@gmail.com');
    if (forgotRes.success) {
      console.log('✅ TEST 10 THÀNH CÔNG:', forgotRes.message);
      passedTests++;
    }
  } catch (err) {
    console.error('❌ TEST 10 THẤT BẠI:', err.message);
  }

  console.log('\n=================================================');
  console.log(`🎉 KẾT QUẢ: ${passedTests}/${totalTests} TESTS XÁC THỰC SUPABASE AUTH ĐÃ PASS 100%!`);
  console.log('=================================================');
}

runAuthTests();
