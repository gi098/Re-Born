/**
 * RE-BORN • Authentication Interactive Logic (js/auth.js)
 * Tích hợp Supabase Auth v2, xác thực form và bảo vệ luồng checkout
 */

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // 1. Phân tích URL Parameters & Hash
  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get('redirect') || '';

  // 2. DOM Elements
  const tabSignInBtn = document.getElementById('tabSignInBtn');
  const tabSignUpBtn = document.getElementById('tabSignUpBtn');
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');

  const authAlert = document.getElementById('authAlert');
  const authAlertText = document.getElementById('authAlertText');

  const linkForgotPassword = document.getElementById('linkForgotPassword');
  const linkSwitchToSignUp = document.getElementById('linkSwitchToSignUp');
  const linkSwitchToSignIn = document.getElementById('linkSwitchToSignIn');
  const linkBackToSignInFromForgot = document.getElementById('linkBackToSignInFromForgot');

  // Input Fields
  const signInEmail = document.getElementById('signInEmail');
  const signInPassword = document.getElementById('signInPassword');
  const btnSubmitSignIn = document.getElementById('btnSubmitSignIn');

  const signUpName = document.getElementById('signUpName');
  const signUpPhone = document.getElementById('signUpPhone');
  const signUpEmail = document.getElementById('signUpEmail');
  const signUpPassword = document.getElementById('signUpPassword');
  const signUpConfirmPassword = document.getElementById('signUpConfirmPassword');
  const termsAgree = document.getElementById('termsAgree');
  const btnSubmitSignUp = document.getElementById('btnSubmitSignUp');

  const forgotEmail = document.getElementById('forgotEmail');
  const btnSubmitForgot = document.getElementById('btnSubmitForgot');

  // Validation Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const vnPhoneRegex = /(03|05|07|08|09)+([0-9]{8})\b/;

  // 3. Kiểm tra Session hiện tại (Nếu đã đăng nhập thì tự động chuyển hướng)
  if (window.rebornAuth) {
    try {
      const session = await window.rebornAuth.getSession();
      if (session && session.user) {
        handleRedirectAfterAuth();
        return;
      }
    } catch (e) {
      console.warn('Lỗi kiểm tra session:', e);
    }
  }

  // 4. Quản lý Chuyển đổi Tab (Tabs Switcher)
  function switchTab(tab) {
    hideAlert();
    clearErrors();

    if (tab === 'signin') {
      tabSignInBtn.classList.add('active');
      tabSignUpBtn.classList.remove('active');
      tabSignInBtn.setAttribute('aria-selected', 'true');
      tabSignUpBtn.setAttribute('aria-selected', 'false');

      signInForm.classList.add('active');
      signUpForm.classList.remove('active');
      forgotPasswordForm.classList.remove('active');
      signInEmail?.focus();
    } else if (tab === 'signup') {
      tabSignUpBtn.classList.add('active');
      tabSignInBtn.classList.remove('active');
      tabSignUpBtn.setAttribute('aria-selected', 'true');
      tabSignInBtn.setAttribute('aria-selected', 'false');

      signUpForm.classList.add('active');
      signInForm.classList.remove('active');
      forgotPasswordForm.classList.remove('active');
      signUpName?.focus();
    } else if (tab === 'forgot') {
      tabSignInBtn.classList.remove('active');
      tabSignUpBtn.classList.remove('active');

      forgotPasswordForm.classList.add('active');
      signInForm.classList.remove('active');
      signUpForm.classList.remove('active');
      forgotEmail?.focus();
    }
  }

  tabSignInBtn?.addEventListener('click', () => switchTab('signin'));
  tabSignUpBtn?.addEventListener('click', () => switchTab('signup'));
  linkSwitchToSignUp?.addEventListener('click', (e) => { e.preventDefault(); switchTab('signup'); });
  linkSwitchToSignIn?.addEventListener('click', (e) => { e.preventDefault(); switchTab('signin'); });
  linkForgotPassword?.addEventListener('click', (e) => { e.preventDefault(); switchTab('forgot'); });
  linkBackToSignInFromForgot?.addEventListener('click', (e) => { e.preventDefault(); switchTab('signin'); });

  // Khởi tạo tab từ hash hoặc query param
  if (window.location.hash === '#signup' || urlParams.get('mode') === 'signup') {
    switchTab('signup');
  } else if (window.location.hash === '#forgot') {
    switchTab('forgot');
  } else {
    switchTab('signin');
  }

  // 5. Tính năng Ẩn/Hiện mật khẩu (Eye Toggle)
  document.querySelectorAll('.input-password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');

      // Cập nhật icon SVG
      btn.innerHTML = isPassword
        ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
             <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
             <line x1="1" y1="1" x2="23" y2="23"></line>
           </svg>`
        : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
             <circle cx="12" cy="12" r="3"></circle>
           </svg>`;
    });
  });

  // 6. Hiển thị thông báo Alert (Lỗi / Thành công)
  function showAlert(message, type = 'error') {
    authAlert.className = `auth-alert visible ${type}`;
    authAlertText.textContent = message;
    authAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    authAlert.className = 'auth-alert';
  }

  function clearErrors() {
    document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));
    document.querySelectorAll('.form-input').forEach(inp => inp.classList.remove('is-invalid'));
  }

  function setFieldError(groupId, inputId, errorMsg) {
    const grp = document.getElementById(groupId);
    const inp = document.getElementById(inputId);
    if (grp) grp.classList.add('has-error');
    if (inp) inp.classList.add('is-invalid');
    if (errorMsg) {
      const errSpan = grp?.querySelector('.field-error-text');
      if (errSpan) errSpan.textContent = errorMsg;
    }
  }

  // 7. Xử lý Chuyển hướng sau Đăng nhập thành công
  async function handleRedirectAfterAuth() {
    if (redirectTarget === 'checkout') {
      window.location.href = 'index.html#checkout';
    } else if (redirectTarget === 'admin') {
      const isAdmin = await window.rebornAuth.isAdmin();
      if (isAdmin) {
        window.location.href = 'admin.html';
      } else {
        showAlert('Tài khoản của bạn là Khách hàng, không có quyền truy cập trang Quản trị Admin!', 'error');
      }
    } else {
      window.location.href = 'index.html';
    }
  }

  // 8. XỬ LÝ SUBMIT: FORM ĐĂNG NHẬP
  signInForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    clearErrors();

    const email = signInEmail.value.trim();
    const password = signInPassword.value;

    let hasError = false;

    if (!email || !emailRegex.test(email)) {
      setFieldError('grpSignInEmail', 'signInEmail', 'Vui lòng nhập địa chỉ email hợp lệ!');
      hasError = true;
    }

    if (!password) {
      setFieldError('grpSignInPassword', 'signInPassword', 'Vui lòng nhập mật khẩu của bạn!');
      hasError = true;
    }

    if (hasError) return;

    btnSubmitSignIn.classList.add('is-loading');

    try {
      await window.rebornAuth.signIn({ email, password });
      showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');

      setTimeout(() => {
        handleRedirectAfterAuth();
      }, 700);

    } catch (err) {
      showAlert(err.message || 'Email hoặc mật khẩu không chính xác!', 'error');
    } finally {
      btnSubmitSignIn.classList.remove('is-loading');
    }
  });

  // 9. XỬ LÝ SUBMIT: FORM ĐĂNG KÝ
  signUpForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    clearErrors();

    const fullName = signUpName.value.trim();
    const phone = signUpPhone.value.trim().replace(/\s+/g, '');
    const email = signUpEmail.value.trim();
    const password = signUpPassword.value;
    const confirmPassword = signUpConfirmPassword.value;

    let hasError = false;

    if (!fullName) {
      setFieldError('grpSignUpName', 'signUpName', 'Vui lòng nhập họ và tên của bạn!');
      hasError = true;
    }

    if (!vnPhoneRegex.test(phone)) {
      setFieldError('grpSignUpPhone', 'signUpPhone', 'Số điện thoại không hợp lệ (cần 10 chữ số)!');
      hasError = true;
    }

    if (!email || !emailRegex.test(email)) {
      setFieldError('grpSignUpEmail', 'signUpEmail', 'Vui lòng nhập định dạng email hợp lệ!');
      hasError = true;
    }

    if (!password || password.length < 6) {
      setFieldError('grpSignUpPassword', 'signUpPassword', 'Mật khẩu phải từ 6 ký tự trở lên!');
      hasError = true;
    }

    if (password !== confirmPassword) {
      setFieldError('grpSignUpConfirmPassword', 'signUpConfirmPassword', 'Mật khẩu xác nhận không trùng khớp!');
      hasError = true;
    }

    if (!termsAgree.checked) {
      showAlert('Vui lòng đồng ý với Điều khoản dịch vụ & Chính sách bảo mật!', 'error');
      return;
    }

    if (hasError) return;

    btnSubmitSignUp.classList.add('is-loading');

    try {
      await window.rebornAuth.signUp({
        email,
        password,
        fullName,
        phone
      });

      // Đăng xuất phiên tạm (nếu có) để người dùng chủ động đăng nhập lại
      await window.rebornAuth.signOut();

      // Reset dữ liệu form đăng ký
      signUpForm.reset();

      // Chuyển ngay sang tab Đăng nhập
      switchTab('signin');

      // Điền sẵn email vừa đăng ký và trỏ chuột vào ô mật khẩu
      if (signInEmail) signInEmail.value = email;
      if (signInPassword) {
        signInPassword.value = '';
        signInPassword.focus();
      }

      // Hiển thị thông báo thành công
      showAlert('Đăng ký tài khoản thành công! Vui lòng kiểm tra hộp thư email để bấm xác nhận tài khoản, sau đó đăng nhập tại đây.', 'success');

    } catch (err) {
      showAlert(err.message || 'Đăng ký không thành công. Vui lòng thử lại!', 'error');
    } finally {
      btnSubmitSignUp.classList.remove('is-loading');
    }
  });

  // 10. XỬ LÝ SUBMIT: FORM QUÊN MẬT KHẨU
  forgotPasswordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();
    clearErrors();

    const email = forgotEmail.value.trim();

    if (!email || !emailRegex.test(email)) {
      setFieldError('grpForgotEmail', 'forgotEmail', 'Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }

    btnSubmitForgot.classList.add('is-loading');

    try {
      const res = await window.rebornAuth.resetPassword(email);
      showAlert(res.message || 'Đã gửi hướng dẫn khôi phục mật khẩu vào email của bạn!', 'success');
      forgotEmail.value = '';
    } catch (err) {
      showAlert(err.message || 'Lỗi gửi yêu cầu khôi phục mật khẩu!', 'error');
    } finally {
      btnSubmitForgot.classList.remove('is-loading');
    }
  });

});
