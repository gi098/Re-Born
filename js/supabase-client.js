/**
 * RE-BORN • Supabase Client & Authentication Helper (SDK v2)
 * 
 * BẢO MẬT:
 * - Chỉ sử dụng SUPABASE_URL và anon/public key ở frontend.
 * - Tuyệt đối KHÔNG đưa service_role key vào frontend.
 * - Tự động đồng bộ session và quản lý quyền người dùng (customer / admin).
 */

(function () {
  'use strict';

  // 1. Cấu hình Supabase (Đọc từ window.__ENV__ hoặc localStorage hoặc hằng số)
  const DEFAULT_SUPABASE_URL = 'https://xywuvrstbglomknfhejd.supabase.co';
  const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5d3V2cnN0Ymdsb21rbmZoZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1MDM2MDAsImV4cCI6MjAyNTA4MDAwMH0.placeholder';

  const envConfig = (typeof window !== 'undefined' && window.__ENV__) ? window.__ENV__ : {};
  const SUPABASE_URL = envConfig.SUPABASE_URL || 
                       (typeof localStorage !== 'undefined' && localStorage.getItem('REBORN_SUPABASE_URL')) || 
                       DEFAULT_SUPABASE_URL;
  const SUPABASE_ANON_KEY = envConfig.SUPABASE_ANON_KEY || 
                            (typeof localStorage !== 'undefined' && localStorage.getItem('REBORN_SUPABASE_ANON_KEY')) || 
                            DEFAULT_SUPABASE_ANON_KEY;

  // 2. Khởi tạo Supabase client từ CDN SDK v2 nếu có
  let realClient = null;
  const isRealConfigured = SUPABASE_URL && 
                           !SUPABASE_URL.includes('xywuvrstbglomknfhejd') && 
                           SUPABASE_ANON_KEY && 
                           !SUPABASE_ANON_KEY.includes('placeholder');

  if (typeof window !== 'undefined' && window.supabase && isRealConfigured) {
    try {
      realClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log('🌿 Supabase client kết nối thành công tới máy chủ đám mây.');
    } catch (err) {
      console.warn('Không thể khởi tạo real Supabase client:', err);
    }
  }

  // 3. Cơ chế Mock Auth Storage khi chạy local/offline hoặc chờ nhóm điền API Key
  const LOCAL_STORAGE_KEY_SESSION = 'reborn_auth_session';
  const LOCAL_STORAGE_KEY_USERS = 'reborn_auth_users';
  const authStateListeners = new Set();

  function getLocalUsers() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USERS) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveLocalUsers(users) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }

  function getLocalSession() {
    try {
      const sess = localStorage.getItem(LOCAL_STORAGE_KEY_SESSION);
      return sess ? JSON.parse(sess) : null;
    } catch (e) {
      return null;
    }
  }

  function setLocalSession(session) {
    try {
      if (session) {
        localStorage.setItem(LOCAL_STORAGE_KEY_SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_SESSION);
      }
      notifyAuthListeners(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    } catch (e) {
      console.error(e);
    }
  }

  function notifyAuthListeners(event, session) {
    authStateListeners.forEach(listener => {
      try {
        listener(event, session);
      } catch (err) {
        console.error('Lỗi listener auth:', err);
      }
    });
  }

  // Khởi tạo sẵn một tài khoản Admin mẫu để phục vụ kiểm thử phân quyền
  (function initDefaultAccounts() {
    if (typeof localStorage === 'undefined') return;
    const users = getLocalUsers();
    if (!users.some(u => u.email === 'admin@reborn.vn')) {
      users.push({
        id: 'adm-reborn-001',
        email: 'admin@reborn.vn',
        password: 'AdminPassword123!',
        full_name: 'Quản Trị Viên Re-Born',
        phone: '0988123456',
        role: 'admin',
        created_at: new Date().toISOString()
      });
      saveLocalUsers(users);
    }
  })();

  // 4. API Wrapper cho toàn hệ thống
  const supabaseAuth = {
    /**
     * Kiểm tra cấu hình kết nối
     */
    isLiveConnected: function () {
      return realClient !== null;
    },

    /**
     * Cập nhật thông tin cấu hình Supabase từ giao diện
     */
    configureCredentials: function (url, anonKey) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('REBORN_SUPABASE_URL', url.trim());
        localStorage.setItem('REBORN_SUPABASE_ANON_KEY', anonKey.trim());
        window.location.reload();
      }
    },

    /**
     * Đăng ký tài khoản mới bằng Email và Mật khẩu
     * Quy định: Mọi tài khoản mới đăng ký đều có role = 'customer'
     */
    signUp: async function ({ email, password, fullName, phone }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPhone = (phone || '').trim();
      const cleanName = (fullName || '').trim();

      if (realClient) {
        const { data, error } = await realClient.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone
              // Tuyệt đối không gửi role: 'admin' lên metadata
            }
          }
        });
        if (error) {
          throw new Error(translateAuthError(error.message));
        }

        // Tạo/Cập nhật profile liên kết an toàn
        if (data && data.user) {
          await realClient.from('profiles').upsert({
            id: data.user.id,
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer'
          });
        }
        return { user: data.user, session: data.session };
      }

      // Fallback Local Storage Mode
      const users = getLocalUsers();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('Email này đã được đăng ký. Vui lòng chuyển sang Đăng nhập!');
      }

      const newUser = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        email: cleanEmail,
        password: password,
        full_name: cleanName,
        phone: cleanPhone,
        role: 'customer', // Luôn mặc định là customer
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      saveLocalUsers(users);

      const session = {
        access_token: 'tk_' + Math.random().toString(36).substring(2),
        user: {
          id: newUser.id,
          email: newUser.email,
          user_metadata: {
            full_name: newUser.full_name,
            phone: newUser.phone
          }
        },
        profile: {
          id: newUser.id,
          full_name: newUser.full_name,
          phone: newUser.phone,
          role: 'customer'
        }
      };

      setLocalSession(session);
      return { user: session.user, session };
    },

    /**
     * Đăng nhập bằng Email và Mật khẩu
     */
    signIn: async function ({ email, password }) {
      const cleanEmail = (email || '').trim().toLowerCase();

      if (realClient) {
        const { data, error } = await realClient.auth.signInWithPassword({
          email: cleanEmail,
          password: password
        });
        if (error) {
          throw new Error(translateAuthError(error.message));
        }

        // Lấy profile thực tế từ CSDL Supabase
        let profile = null;
        if (data?.user) {
          const { data: profData } = await realClient
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profile = profData || {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || '',
            phone: data.user.user_metadata?.phone || '',
            role: 'customer'
          };
        }

        return { user: data.user, session: data.session, profile };
      }

      // Fallback Local Storage Mode
      const users = getLocalUsers();
      const matched = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);
      if (!matched) {
        throw new Error('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
      }

      const session = {
        access_token: 'tk_' + Math.random().toString(36).substring(2),
        user: {
          id: matched.id,
          email: matched.email,
          user_metadata: {
            full_name: matched.full_name,
            phone: matched.phone
          }
        },
        profile: {
          id: matched.id,
          full_name: matched.full_name,
          phone: matched.phone,
          role: matched.role || 'customer'
        }
      };

      setLocalSession(session);
      return { user: session.user, session, profile: session.profile };
    },

    /**
     * Đăng xuất người dùng
     */
    signOut: async function () {
      if (realClient) {
        await realClient.auth.signOut();
      }
      setLocalSession(null);
      return { success: true };
    },

    /**
     * Gửi yêu cầu đặt lại mật khẩu (Forgot Password)
     */
    resetPassword: async function (email) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail) {
        throw new Error('Vui lòng nhập địa chỉ email của bạn!');
      }

      if (realClient) {
        const { error } = await realClient.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: window.location.origin + '/auth.html#reset-password'
        });
        if (error) {
          throw new Error(translateAuthError(error.message));
        }
        return { success: true, message: 'Đã gửi hướng dẫn khôi phục mật khẩu vào email của bạn!' };
      }

      // Fallback Local Mode
      const users = getLocalUsers();
      const matched = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!matched) {
        // Bảo mật: Không tiết lộ email có tồn tại hay không trong hệ thống
        return { success: true, message: 'Nếu email tồn tại trong hệ thống Re-Born, chúng tôi đã gửi đường dẫn đặt lại mật khẩu.' };
      }
      return { success: true, message: 'Nếu email tồn tại trong hệ thống Re-Born, chúng tôi đã gửi đường dẫn đặt lại mật khẩu.' };
    },

    /**
     * Lấy phiên đăng nhập hiện tại
     */
    getSession: async function () {
      if (realClient) {
        const { data } = await realClient.auth.getSession();
        return data?.session || null;
      }
      return getLocalSession();
    },

    /**
     * Lấy người dùng hiện tại
     */
    getCurrentUser: async function () {
      if (realClient) {
        const { data } = await realClient.auth.getUser();
        return data?.user || null;
      }
      const session = getLocalSession();
      return session?.user || null;
    },

    /**
     * Lấy thông tin hồ sơ (Profile) của người dùng hiện tại
     */
    getUserProfile: async function (userId) {
      const uid = userId || (await this.getCurrentUser())?.id;
      if (!uid) return null;

      if (realClient) {
        const { data, error } = await realClient
          .from('profiles')
          .select('id, full_name, phone, role, created_at')
          .eq('id', uid)
          .single();
        if (!error && data) return data;
      }

      const session = getLocalSession();
      if (session && session.user && session.user.id === uid) {
        return session.profile || {
          id: session.user.id,
          full_name: session.user.user_metadata?.full_name || '',
          phone: session.user.user_metadata?.phone || '',
          role: 'customer'
        };
      }

      const users = getLocalUsers();
      const found = users.find(u => u.id === uid);
      if (found) {
        return {
          id: found.id,
          full_name: found.full_name,
          phone: found.phone,
          role: found.role || 'customer',
          created_at: found.created_at
        };
      }
      return null;
    },

    /**
     * Kiểm tra xem người dùng hiện tại có quyền Admin hay không
     */
    isAdmin: async function () {
      const profile = await this.getUserProfile();
      return profile && profile.role === 'admin';
    },

    /**
     * Đăng ký lắng nghe thay đổi trạng thái Auth
     */
    onAuthStateChange: function (callback) {
      authStateListeners.add(callback);
      if (realClient) {
        realClient.auth.onAuthStateChange((event, session) => {
          callback(event, session);
        });
      }
      return () => authStateListeners.delete(callback);
    }
  };

  /**
   * Chuyển đổi mã lỗi tiếng Anh của Supabase Auth sang Tiếng Việt thân thiện
   */
  function translateAuthError(errMsg) {
    if (!errMsg) return 'Đã có lỗi xảy ra. Vui lòng thử lại!';
    const lower = errMsg.toLowerCase();
    if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
      return 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!';
    }
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'Tài khoản email này đã được đăng ký. Vui lòng chọn Đăng nhập!';
    }
    if (lower.includes('password should be at least')) {
      return 'Mật khẩu phải có độ dài tối thiểu 6 ký tự!';
    }
    if (lower.includes('email not confirmed')) {
      return 'Vui lòng xác nhận email trước khi đăng nhập!';
    }
    if (lower.includes('rate limit')) {
      return 'Bạn thao tác quá nhanh. Vui lòng chờ giây lát rồi thử lại!';
    }
    return errMsg;
  }

  // Export toàn cục
  window.rebornAuth = supabaseAuth;
  window.supabaseClient = realClient;

})();
