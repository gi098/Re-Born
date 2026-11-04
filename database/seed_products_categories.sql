-- ============================================================================
-- RE-BORN E-COMMERCE • SEED DATA CHO BẢNG CATEGORIES & PRODUCTS
-- Sử dụng các bảng categories và products đã tồn tại sẵn trong CSDL Supabase
-- ============================================================================

-- 1. Nạp danh mục sản phẩm (Categories)
INSERT INTO public.categories (id, name, slug, description)
VALUES 
    (1, 'Nước Rửa Tay Sinh Học', 'nuoc-rua-tay', 'Dòng nước rửa tay vỏ bưởi ép lạnh làm sạch 99.9% vi khuẩn và dưỡng ẩm tự nhiên.'),
    (2, 'Túi Refill Tiết Kiệm', 'tui-refill', 'Túi nạp lại dung tích lớn tiết kiệm chi phí và giảm 80% rác thải nhựa.'),
    (3, 'Combo & Quà Tặng Eco', 'combo-qua-tang', 'Các gói sản phẩm mua chung Campus và set quà tặng phong cách sống xanh.')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description;

-- 2. Nạp sản phẩm chính thức RE-BORN (Products)
-- Lưu ý: id có thể là số nguyên (SERIAL) hoặc text/varchar tuỳ theo kiểu dữ liệu ban đầu
INSERT INTO public.products (id, name, price, description, category_id, image_url, volume, stock_quantity, is_active, sku)
VALUES 
    (
        1, 
        'Nước rửa tay vỏ bưởi Re-Born 250ml', 
        45000, 
        'Công thức làm sạch dịu lành chiết xuất từ tinh dầu vỏ bưởi ép chậm kết hợp thảo mộc tự nhiên. Nhẹ nhàng gột rửa 99.9% vi khuẩn, giữ trọn độ ẩm cho đôi tay và không gây khô ráp.', 
        1, 
        'assets/images/product_handwash.jpg', 
        '250 ml • Chai rPET vòi nhấn', 
        50, 
        true, 
        'RB-HW-250'
    ),
    (
        2, 
        'Túi Refill Nước rửa tay vỏ bưởi 500ml', 
        75000, 
        'Dung tích nhân đôi 500ml tiện lợi rót đầy lại 2 chai vòi nhấn cũ. Tiết kiệm 15.000₫ chi phí và chung tay cắt giảm 80% rác thải nhựa so với việc mua chai mới.', 
        2, 
        'assets/images/product_refill.jpg', 
        '500 ml • Túi sinh thái tiết kiệm', 
        35, 
        true, 
        'RB-RF-500'
    ),
    (
        3, 
        'Combo Đôi • 2 Nước rửa tay + Túi vải Canvas', 
        89000, 
        'Gói ưu đãi mua chung 2 chai nước rửa tay vỏ bưởi 250ml tặng kèm túi vải dệt thô Canvas Re-Born. Lựa chọn lý tưởng cho bạn bè cùng phòng KTX rủ nhau sống xanh.', 
        3, 
        'assets/images/hero_product.jpg', 
        'Set 3 món (2 chai 250ml + túi vải)', 
        20, 
        true, 
        'RB-CB-DUO'
    ),
    (
        4, 
        'Can Sỉ 3L Nước rửa tay vỏ bưởi (Dành cho quán Cafe & Tiệm Trà)', 
        320000, 
        'Dung tích lớn chuyên dụng cho quầy lavabo quán cà phê, tiệm trà và homestay sinh thái. Tinh dầu bưởi tự nhiên tạo ấn tượng thanh mát khó quên cho khách hàng.', 
        2, 
        'assets/images/reborn_clean_showcase.jpg', 
        '3000 ml • Can nhựa tái sinh', 
        10, 
        true, 
        'RB-CAN-3L'
    ),
    (
        5, 
        'Xịt Khử Khuẩn Vỏ Bưởi Đa Năng 100ml (Mẫu thử nghiệm R&D)', 
        39000, 
        'Xịt kháng khuẩn cá nhân bỏ túi từ cồn thực vật lên men và tinh dầu bưởi. Kháng khuẩn bề mặt điện thoại, bàn phím và vật dụng cá nhân.', 
        1, 
        'assets/images/reborn_minimal_bottle.jpg', 
        '100 ml • Chai xịt phun sương', 
        0, -- Sản phẩm hết hàng (Dùng để kiểm thử tính năng Out-of-Stock)
        true, 
        'RB-SP-100'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    image_url = EXCLUDED.image_url,
    volume = EXCLUDED.volume,
    stock_quantity = EXCLUDED.stock_quantity,
    is_active = EXCLUDED.is_active,
    sku = EXCLUDED.sku;

-- 3. Kích hoạt quyền SELECT công khai cho bảng products và categories (nếu RLS đang bật)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cho phep xem danh muc cong khai" ON public.categories;
CREATE POLICY "Cho phep xem danh muc cong khai" ON public.categories FOR SELECT USING (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cho phep xem san pham cong khai" ON public.products;
CREATE POLICY "Cho phep xem san pham cong khai" ON public.products FOR SELECT USING (is_active = true);

