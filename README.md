# RE-BORN • Nước Rửa Tay Vỏ Bưởi Hữu Cơ - Sạch Khuẩn Từ Tự Nhiên
> Dự án Khởi nghiệp Sáng tạo & Kinh tế Tuần hoàn Re-Born

Trang web giao diện tĩnh (Static Website) cao cấp được chuyển thể chính xác theo bản thiết kế mẫu trên **Google Stitch** kết hợp trọn vẹn nhận diện thương hiệu **Re-Born**.

---

## 🌿 Cấu trúc dự án

```
c:\Re-Born\
├── index.html                # Trang web chính (HTML5 ngữ nghĩa, SEO tối ưu)
├── css\
│   └── style.css             # Hệ thống thiết kế chuẩn Botanical, Glassmorphism, Responsive
├── js\
│   └── app.js                # Xử lý tương tác Modals, Giỏ hàng trượt, Tầng hương, Toasts
├── assets\
│   └── images\
│       ├── logo.png          # Logo chính thức RE-BORN (Vỏ bưởi & Sạch khuẩn)
│       ├── hero_product.jpg  # Hình ảnh Mẻ thu hoạch số 04
│       ├── product_handwash.jpg   # Nước rửa tay vỏ bưởi chai 250ml
│       ├── product_refill.jpg     # Túi Refill tiết kiệm 500ml
│       └── sink_ritual.jpg   # Trải nghiệm rửa tay đa giác quan
├── server.js                 # Máy chủ phát triển Node.js nội bộ (Port 3000)
└── README.md
```

---

## ✨ Các tính năng nổi bật được xây dựng

1. **Giao diện chuẩn xác theo Stitch**:
   - **Hero Section**: Câu thông điệp *"Sự tươi mát nguyên bản, tái định hình"* kèm thẻ ảnh mẻ thu hoạch nổi.
   - **Triết lý bản địa**: 3 bước tái sinh vỏ bưởi (*01 Vườn bưởi tự nhiên, 02 Chưng cất lạnh, 03 Công thức tinh khiết*).
   - **Danh mục sản phẩm**: Dòng nước rửa tay vỏ bưởi (*Chai vòi nhấn 250ml, Túi Refill 500ml, Combo đôi bạn cùng tiến*) với nút Thêm giỏ hàng nhanh và Khám phá nghi thức.
   - **Cấu trúc tầng hương**: Phân tầng Hương Đầu, Hương Giữa, Hương Cuối và 3 chỉ số chứng nhận (0% Hương liệu nhân tạo, 100% Chiết xuất tự nhiên, Tuần hoàn).
   - **Giá trị bền vững**: Banner hệ thống nạp lại Refill giảm thiểu rác thải.
   - **Footer cao cấp**: Đăng ký bản tin mùa thu hoạch, danh mục nghiên cứu & quản trị.

2. **Tương tác Modals chuẩn ảnh thiết kế Stitch**:
   - **Modal Đăng nhập (`Chào mừng trở lại`)**: Cột trái thương hiệu mẻ thu hoạch, cột phải form đăng nhập, mắt ẩn/hiện mật khẩu, nút tiếp tục với Google.
   - **Modal Tạo tài khoản (`Gia nhập Bưởi Reborn`)**: Form đăng ký với thanh đo độ mạnh mật khẩu trực quan (*Password Strength Meter*).
   - **Giỏ hàng trượt Slide-Over Drawer**: Xem sản phẩm, tăng/giảm số lượng, thanh tiến độ Miễn phí giao hàng, tính tạm tính và nút thanh toán.
   - **Modal Chi tiết nghi thức**: Khám phá thành phần hoạt tính (d-Limonene, Aloe vera,...) và hướng dẫn trải nghiệm.

---

## 🚀 Hướng dẫn mở và xem trang web

### Cách 1: Mở trực tiếp bằng trình duyệt
Nhấp đúp chuột vào file:
`c:\Re-Born\index.html`

### Cách 2: Chạy qua máy chủ Node.js cục bộ
Mở PowerShell tại thư mục dự án và chạy:
```powershell
node server.js
```
Sau đó truy cập: [http://localhost:3000](http://localhost:3000)
