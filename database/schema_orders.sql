-- ============================================================================
-- RE-BORN E-COMMERCE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Phân hệ Thành viên 1: Quản lý Đơn hàng, Món hàng & Mã Khuyến Mãi
-- ============================================================================

-- 1. Bảng Mã giảm giá (vouchers)
CREATE TABLE IF NOT EXISTS vouchers (
    code VARCHAR(50) PRIMARY KEY,
    description TEXT,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    min_order_value INTEGER DEFAULT 0,
    max_discount_amount INTEGER DEFAULT 100000,
    max_usage INTEGER DEFAULT 1000,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm sẵn các voucher mặc định của dự án
INSERT INTO vouchers (code, description, discount_percent, min_order_value, max_discount_amount, is_active)
VALUES 
    ('FPTU', 'Ưu đãi sinh viên Campus FPT', 15, 0, 50000, true),
    ('REBORN15', 'Mã giảm giá chào bạn mới 15%', 15, 0, 50000, true),
    ('TIETKIEM20', 'Tri ân khách hàng mẻ thu hoạch đầu tiên 20%', 20, 100000, 70000, true)
ON CONFLICT (code) DO NOTHING;

-- 2. Bảng Đơn hàng (orders)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY, -- Ví dụ: #RB-202688
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
    shipping_fee INTEGER DEFAULT 0,
    discount_amount INTEGER DEFAULT 0,
    final_total INTEGER NOT NULL CHECK (final_total >= 0),
    voucher_code VARCHAR(50) REFERENCES vouchers(code),
    payment_method VARCHAR(20) DEFAULT 'COD', -- 'COD' hoặc 'VIETQR'
    payment_status VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'FAILED'
    order_status VARCHAR(30) DEFAULT 'NEW', -- 'NEW', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo chỉ mục (Index) để tìm kiếm nhanh theo SĐT khi khách tra cứu
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);

-- 3. Bảng Chi tiết từng món trong đơn (order_items)
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    volume VARCHAR(50),
    price INTEGER NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    item_total INTEGER GENERATED ALWAYS AS (price * quantity) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

