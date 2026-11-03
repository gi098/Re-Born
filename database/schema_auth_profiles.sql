-- ============================================================================
-- RE-BORN E-COMMERCE • SUPABASE AUTH & PROFILES INTEGRATION SCHEMA
-- Phân hệ: Xác thực người dùng (Auth), Hồ sơ (Profiles) & Phân quyền (RLS)
-- ============================================================================

-- 1. Đảm bảo bảng profiles liên kết chặt chẽ với auth.users
-- Lưu ý: Không xóa bảng cũ nếu đã tồn tại, chỉ bổ sung các cột cần thiết an toàn.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bổ sung cột role nếu bảng profiles đã tồn tại từ trước mà chưa có role
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'role'
    ) THEN 
        ALTER TABLE public.profiles ADD COLUMN role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'profiles' 
          AND column_name = 'updated_at'
    ) THEN 
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. Cập nhật bảng orders: Bổ sung liên kết user_id (Khách hàng)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'orders' 
          AND column_name = 'user_id'
    ) THEN 
        ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
        CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
    END IF;
END $$;

-- 3. Trigger tự động tạo profile khi người dùng đăng ký qua Supabase Auth
-- BẢO MẬT: Luôn gán role = 'customer'. Tuyệt đối không cho phép client tự gửi role = 'admin'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'customer' -- Luôn mặc định là customer, ngăn chặn leo thang quyền hạn
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kích hoạt trigger trên auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Kích hoạt Row Level Security (RLS) bảo vệ dữ liệu

-- Bật RLS cho bảng profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy Profiles: Người dùng chỉ được xem profile của chính mình
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

-- Policy Profiles: Người dùng chỉ được cập nhật thông tin họ tên, SĐT của chính mình (Không được sửa role)
DROP POLICY IF EXISTS "Users can update own profile info" ON public.profiles;
CREATE POLICY "Users can update own profile info" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy Profiles: Admin có toàn quyền xem và quản trị hồ sơ người dùng
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles" 
    ON public.profiles FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Bật RLS cho bảng orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy Orders: Khách hàng chỉ xem được đơn hàng của chính mình
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
    ON public.orders FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy Orders: Khách hàng chỉ tạo đơn hàng với user_id của chính mình
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" 
    ON public.orders FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Policy Orders: Admin có toàn quyền quản lý mọi đơn hàng
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
CREATE POLICY "Admins have full access to orders" 
    ON public.orders FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ============================================================================
-- Hướng dẫn cấp quyền Admin cho tài khoản quản trị (Chạy thủ công trong SQL Editor):
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'UUID_CUA_ADMIN';
-- ============================================================================
