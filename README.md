# RE-BORN • Nước Rửa Tay Vỏ Bưởi Hữu Cơ - Sạch Khuẩn Từ Tự Nhiên
> Dự án Khởi nghiệp Sáng tạo & Kinh tế Tuần hoàn Re-Born  
> **Phương pháp luận**: Lean Startup & Y Combinator MVP Philosophy  
> **Quy mô đội ngũ**: 2 Thành viên (Full-Stack E-Commerce Roadmap)

---

## 🌿 1. TỔNG QUAN DỰ ÁN
RE-BORN là dòng sản phẩm nước rửa tay sinh học chiết xuất từ phụ phẩm vỏ bưởi sau chế biến (Upcycling). Dự án ứng dụng công nghệ số để xây dựng một nền tảng bán lẻ trực tuyến tinh gọn, tối ưu trải nghiệm đặt hàng nhanh cho người tiêu dùng trẻ (Gen Z, sinh viên Campus FPT và nhân viên văn phòng sống xanh).

---

## 📂 2. CẤU TRÚC MÃ NGUỒN HIỆN TẠI

```
c:\ReBorn\
├── api/                          # Serverless APIs (Chạy trên Vercel / Node.js)
│   ├── orders.js                 # API Tạo đơn & lấy danh sách đơn hàng (hỗ trợ userId)
│   ├── orders/
│   │   └── track.js              # API Tra cứu đơn hàng theo Số Điện Thoại
│   └── vouchers/
│       └── verify.js             # API Kiểm tra và áp dụng mã giảm giá
├── assets/
│   └── images/                   # Hình ảnh sản phẩm, Logo HD trong suốt
├── css/
│   ├── auth.css                  # Giao diện Đăng nhập / Đăng ký Botanical
│   └── style.css                 # Hệ thống Design Tokens: Botanical, Responsive
├── database/
│   ├── schema_auth_profiles.sql  # Cấu trúc Supabase Auth, Profiles & RLS Policies
│   └── schema_orders.sql         # Cấu trúc CSDL đơn hàng, vouchers & items
├── docs/                         # Hồ sơ tài liệu & Kế hoạch dự án
│   ├── IT_MVP_SPECIFICATION.md   # Bản đặc tả kỹ thuật MVP chi tiết
│   └── TASK_ALLOCATION.md        # Bảng phân công nhiệm vụ 50/50 chi tiết
├── js/
│   ├── admin.js                  # Tương tác Admin Dashboard & Kiểm tra phân quyền RBAC
│   ├── app.js                    # Tương tác Giỏ hàng, Modal, Tra cứu, Checkout
│   ├── auth.js                   # Logic xác thực form, đăng nhập/ký/quên mật khẩu
│   └── supabase-client.js        # Supabase SDK v2 Client & Session Management
├── tests/
│   ├── test_auth_flow.js         # Kiểm thử 10 kịch bản Supabase Auth & Bảo vệ đơn hàng
│   └── test_member1_flow.js      # Kịch bản kiểm thử API tự động (Unit Tests)
├── admin.html                    # Trang quản trị đơn hàng nội bộ (Bảo vệ bởi Admin Auth)
├── auth.html                     # Trang Đăng nhập, Đăng ký & Quên mật khẩu
├── index.html                    # Trang web bán lẻ chính thức (SEO Semantic & User Menu)
├── package.json                  # Cấu hình dự án & Scripts (npm start, npm test)
├── server.js                     # Máy chủ chạy thử nghiệm nội bộ (Port 3000)
└── README.md                     # Tài liệu tổng quan & Hướng dẫn toàn diện
```

---

## 🚀 3. KẾ HOẠCH NÂNG CẤP FULL-STACK E-COMMERCE (CHO NHÓM 2 NGƯỜI)

### 3.1. Mô hình Kiến trúc Tối ưu (Smart Architecture)
Thay vì tự dựng máy chủ backend truyền thống từ con số 0 tốn nhiều tháng bảo trì, nhóm áp dụng kiến trúc **Serverless & BaaS (Backend-as-a-Service)** hiện đại, an toàn và hoàn toàn miễn phí:

```
┌────────────────────────────────────────────────────────┐
│  FRONTEND (Client)                                     │
│  - Trang Storefront (index.html) + Admin (admin.html)  │
│  - Giỏ hàng trượt, Form thanh toán 1 bước              │
│  - Hosted trên Vercel Edge CDN                         │
└──────────────────────────┬─────────────────────────────┘
                           │ (Fetch API)
┌──────────────────────────▼─────────────────────────────┐
│  BACKEND SERVERLESS (Vercel Functions /api/*)          │
│  - api/orders.js        : Tạo & truy vấn đơn hàng      │
│  - api/payos-webhook.js : Nhận thông báo chuyển khoản  │
│  - api/vouchers.js      : Kiểm tra mã giảm giá         │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
┌──────────────▼───────────┐   ┌───────────▼─────────────┐
│  DATABASE (Supabase)     │   │  PAYMENT GATEWAY (PayOS)│
│  - PostgreSQL lưu trữ    │   │  - Tạo mã VietQR động   │
│  - Quản lý Tồn kho & Đơn │   │  - Check tiền vào 3 giây│
└──────────────────────────┘   └─────────────────────────┘
```

---

### 3.2. Thiết Kế Cơ Sở Dữ Liệu (Database Schema)

#### Bảng `products` (Danh mục sản phẩm)
| Tên cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | VARCHAR (PK) | Mã định danh (`pomelo-handwash`, `pomelo-refill`) |
| `name` | VARCHAR | Tên sản phẩm |
| `price` | INTEGER | Đơn giá niêm yết (VND) |
| `volume` | VARCHAR | Dung tích (250ml, 500ml) |
| `stock` | INTEGER | Số lượng tồn kho thực tế |
| `image_url` | TEXT | Đường dẫn ảnh sản phẩm |

#### Bảng `orders` (Quản lý đơn hàng)
| Tên cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | VARCHAR (PK) | Mã đơn hàng (Ví dụ: `#RB-202688`) |
| `customer_name` | VARCHAR | Họ tên khách hàng |
| `phone` | VARCHAR | Số điện thoại nhận hàng |
| `address` | TEXT | Địa chỉ nhận / Tòa nhà Campus |
| `subtotal` | INTEGER | Tạm tính tiền hàng |
| `discount` | INTEGER | Số tiền được giảm giá |
| `total_amount` | INTEGER | Tổng tiền thực trả |
| `payment_method`| VARCHAR | `COD` hoặc `VIETQR` |
| `payment_status`| VARCHAR | `PENDING` (Chờ TT) / `PAID` (Đã thanh toán) |
| `order_status` | VARCHAR | `NEW`, `SHIPPING`, `DELIVERED`, `CANCELLED` |
| `created_at` | TIMESTAMP | Thời gian tạo đơn |

#### Bảng `order_items` (Chi tiết từng món trong đơn)
| Tên cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | Khóa chính tự tăng |
| `order_id` | VARCHAR (FK) | Tham chiếu đến `orders.id` |
| `product_id` | VARCHAR (FK) | Tham chiếu đến `products.id` |
| `quantity` | INTEGER | Số lượng đặt mua |
| `price` | INTEGER | Giá tại thời điểm mua |

#### Bảng `vouchers` (Mã khuyến mãi)
| Tên cột | Kiểu dữ liệu | Mô tả |
| :--- | :--- | :--- |
| `code` | VARCHAR (PK) | Mã voucher (`REBORN15`, `FPTU`) |
| `discount_percent`| INTEGER | % giảm giá (15%) |
| `max_usage` | INTEGER | Số lượt sử dụng tối đa |
| `used_count` | INTEGER | Số lượt đã dùng |
| `is_active` | BOOLEAN | Trạng thái kích hoạt |

---

### 3.3. Bảng Phân Công Nhiệm Vụ Cân Bằng (50/50 Feature-Driven)

Để công bằng và không ai bị dồn việc, dự án chia đều theo **2 Phân hệ Chức năng trọn gói (Mỗi thành viên đều làm cả Frontend + Backend tương đương 50/50)**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 👤 THÀNH VIÊN 1: PHÂN HỆ ĐẶT HÀNG & MÃ KHUYẾN MÃI (ORDER & VOUCHER)   │
│ (Đảm nhận trọn gói từ Giao diện khách hàng đến API & Lưu Database)    │
├────────────────────────────────────────────────────────────────────────┤
│ [Frontend]                                                             │
│ • Hoàn thiện tương tác Giỏ hàng trượt: Tăng/giảm số lượng, thanh       │
│   tiến độ Freeship 150.000₫, tính tạm tính tự động                     │
│ • Form Đặt hàng 1 bước: Thu thập Họ tên, SĐT, Địa chỉ, validate dữ liệu│
│ • Ô nhập Voucher: Kiểm tra và áp dụng chiết khấu tức thì              │
│ • Modal & Toast thông báo chúc mừng đặt hàng thành công                │
│                                                                        │
│ [Backend & Database]                                                   │
│ • Thiết kế & quản lý 2 bảng CSDL trên Supabase: `orders`, `order_items`│
│ • Viết API: `POST /api/orders` (Nhận đơn hàng mới, lưu CSDL, trừ tồn) │
│ • Viết API: `POST /api/vouchers/verify` (Kiểm tra mã giảm giá hợp lệ)  │
│ • Viết API: `GET /api/orders/track` (Tra cứu đơn hàng theo SĐT khách)  │
│                                                                        │
│ ⚖️ Khối lượng công việc: 50% (Tương đương 40 giờ lập trình)            │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 👤 THÀNH VIÊN 2: THANH TOÁN TỰ ĐỘNG, QUẢN TRỊ & VẬN HÀNH (PAY & ADMIN) │
│ (Đảm nhận trọn gói từ Cổng VietQR đến Trang Admin & Triển khai Vercel) │
├────────────────────────────────────────────────────────────────────────┤
│ [Frontend]                                                             │
│ • Hoàn thiện Bảng điều khiển Quản trị viên (`admin.html`):             │
│   - Bảng danh sách đơn hàng thực tế gọi từ Database                    │
│   - Bộ nút đổi trạng thái đơn: Chờ xử lý ➔ Đang giao ➔ Hoàn thành      │
│   - Thống kê doanh thu, số đơn hôm nay và danh sách đăng ký dùng thử   │
│ • Modal VietQR thanh toán: Hiển thị mã QR động kèm đồng hồ đếm ngược   │
│                                                                        │
│ [Backend, Thanh toán & Vận hành]                                       │
│ • Thiết kế & quản lý 2 bảng CSDL trên Supabase: `products`, `vouchers` │
│ • Tích hợp cổng PayOS: Viết API `POST /api/payos-webhook` tự động      │
│   check tiền vào tài khoản ngân hàng và cập nhật đơn sang ĐÃ THANH TOÁN│
│ • Tích hợp gửi Email tự động xác nhận hoá đơn cho khách (`Resend API`) │
│ • Quản lý Git/GitHub Teamwork & Cấu hình CI/CD Deploy lên Vercel       │
│                                                                        │
│ ⚖️ Khối lượng công việc: 50% (Tương đương 40 giờ lập trình)            │
└────────────────────────────────────────────────────────────────────────┘
```

#### 🤝 Điểm giao thoa phối hợp giữa 2 bạn (Sync Points):
1. **Ngày 3:** Thống nhất định dạng JSON của Đơn hàng giữa Thành viên 1 (gửi đơn) và Thành viên 2 (nhận vào Admin & PayOS).
2. **Ngày 7:** Ghép nối luồng đặt hàng (Thành viên 1) với pop-up VietQR tự động xác nhận tiền (Thành viên 2).
3. **Ngày 12:** Cùng rà soát lỗi chéo (Code Review) và chuẩn bị slide báo cáo tiến độ Checkpoint.

---

### 3.4. Lộ Trình Triển Khai 3 Tuần (Sprint Roadmap)

| Tuần | Mục tiêu chính | Đầu ra (Deliverables) |
| :--- | :--- | :--- |
| **Tuần 1** | **Database & Đặt hàng cơ bản** | - Tạo CSDL trên Supabase.<br>- Viết API tạo đơn.<br>- Đặt hàng trên web lưu thẳng vào Database. |
| **Tuần 2** | **Thanh toán VietQR & Admin** | - Tích hợp PayOS: Quét mã QR chuyển khoản ngân hàng tự động cập nhật đơn.<br>- Trang `admin.html` xem đơn hàng thực tế và đổi trạng thái. |
| **Tuần 3** | **Kiểm thử, Gửi Email & Go-Live** | - Tích hợp gửi email xác nhận hoá đơn tự động (`Resend`).<br>- Test lỗi giỏ hàng, hết hàng.<br>- Trỏ tên miền chính thức và đưa vào chạy thực tế. |

---

## 💳 4. HƯỚNG DẪN TÍCH HỢP THANH TOÁN VIETQR TỰ ĐỘNG (PAYOS)

1. **Đăng ký tài khoản PayOS (Miễn phí):**
   - Truy cập [https://payos.vn](https://payos.vn), đăng ký tài khoản và liên kết tài khoản ngân hàng của bạn.
2. **Lấy API Keys:**
   - Lấy 3 thông số: `CLIENT_ID`, `API_KEY`, `CHECKSUM_KEY`.
3. **Cơ chế hoạt động:**
   - Khi khách bấm *"Xác nhận đặt hàng"*, Backend gọi PayOS sinh mã QR động chứa đúng số tiền đơn hàng và nội dung chuyển khoản: `REBORN 202688`.
   - Khách mở App ngân hàng quét mã ➔ Tiền về tài khoản ngay lập tức.
   - PayOS gửi tín hiệu Webhook về URL `https://your-domain.vercel.app/api/payos-webhook` ➔ Hệ thống tự động chuyển đơn thành **Đã thanh toán**, gửi thông báo chúc mừng lên màn hình khách.

---

## 🌐 5. HƯỚNG DẪN DEPLOY LÊN VERCEL (TỪNG BƯỚC CHI TIẾT)

### Bước 1: Đẩy mã nguồn lên GitHub
Mở Terminal / PowerShell tại thư mục dự án và thực hiện:
```bash
git init
git add .
git commit -m "Re-Born Full E-Commerce MVP"
git branch -M main
git remote add origin https://github.com/<tai-khoan-github>/ReBorn.git
git push -u origin main
```

### Bước 2: Đăng ký & Kết nối Vercel
1. Truy cập [https://vercel.com](https://vercel.com) và chọn **Sign Up** (hoặc **Log In**) bằng tài khoản **GitHub**.
2. Tại màn hình Dashboard, bấm nút **"Add New..."** ở góc phải ➔ Chọn **"Project"**.
3. Bạn sẽ thấy danh sách Repository GitHub của mình ➔ Tìm `ReBorn` và bấm **"Import"**.

### Bước 3: Cấu hình Dự án & Biến môi trường
- **Framework Preset**: Chọn `Other` (vì là web tĩnh HTML/CSS/JS kết hợp API).
- **Root Directory**: Để trống (mặc định `./`).
- **Environment Variables** (Thêm các khóa bảo mật nếu dùng Backend):
  - `SUPABASE_URL` = `https://xxx.supabase.co`
  - `SUPABASE_ANON_KEY` = `eyJhbGciOi...`
  - `PAYOS_CLIENT_ID` = `xxx`
  - `PAYOS_API_KEY` = `xxx`
  - `PAYOS_CHECKSUM_KEY` = `xxx`

### Bước 4: Hoàn tất Deploy
1. Bấm nút **"Deploy"**.
2. Chờ 30 - 45 giây để Vercel build.
3. Khi màn hình pháo hoa xuất hiện, bạn sẽ nhận được một đường link chính thức (Ví dụ: `https://reborn-natural.vercel.app`).
4. **Mỗi lần sau này bạn `git push` mã nguồn mới lên GitHub, Vercel sẽ tự động cập nhật web chỉ trong 10 giây!**

---

## 🔐 6. TÍCH HỢP XÁC THỰC SUPABASE AUTH & PHÂN QUYỀN (RBAC)

### 6.1. Quy định nghiệp vụ chuẩn E-Commerce
1. **Khách vãng lai (Guest)**: Được phép xem danh mục sản phẩm, xem chi tiết và thêm/bớt hàng vào giỏ hàng hoàn toàn tự do.
2. **Bắt buộc Đăng nhập khi Đặt hàng**: Khi bấm "Đặt hàng ngay" hoặc "Tiến hành đặt hàng", nếu chưa đăng nhập, hệ thống sẽ lưu giỏ hàng và chuyển hướng tới `auth.html?redirect=checkout`.
3. **Bảo toàn Giỏ hàng (Cart Persistence)**: Toàn bộ giỏ hàng được đồng bộ tự động vào `localStorage` (`reborn_cart`), đảm bảo không bị mất món khi chuyển sang trang đăng ký/đăng nhập và quay lại.
4. **Tự động điền thông tin**: Sau khi đăng nhập, hệ thống tự động quay lại quy trình thanh toán (`index.html#checkout`) và tự điền Họ tên, Số điện thoại từ hồ sơ người dùng (`profiles`).
5. **Cách ly Dữ liệu (Row Level Security - RLS)**:
   - Khách hàng chỉ xem và cập nhật hồ sơ của chính mình (`auth.uid() = id`).
   - Khách hàng chỉ truy vấn được danh sách đơn hàng do chính mình tạo ra (`auth.uid() = user_id`).
6. **Bảo vệ Trang Quản trị (Admin Protection)**:
   - Khách hàng đăng ký mới mặc định 100% nhận role `'customer'`.
   - Client tuyệt đối không thể tự nâng quyền lên `'admin'`.
   - Trang `admin.html` tự động chặn khách hàng thông thường và yêu cầu quyền Admin.

### 6.2. Cấu trúc CSDL Supabase Auth & Profiles (`database/schema_auth_profiles.sql`)
Nhóm mở **Supabase Dashboard** ➔ **SQL Editor** ➔ Dán và chạy file `database/schema_auth_profiles.sql`:
- Bảng `public.profiles`: Liên kết khóa ngoại `id UUID REFERENCES auth.users(id) ON DELETE CASCADE`.
- Trigger `on_auth_user_created`: Tự động đồng bộ `full_name` và `phone` từ metadata khi người dùng đăng ký, đồng thời thiết lập an toàn `role = 'customer'`.
- Cột `user_id` trong bảng `orders`: Lưu mã định danh của khách hàng để thực thi chính sách RLS.
- Để cấp quyền Admin cho tài khoản quản trị:
  ```sql
  UPDATE public.profiles SET role = 'admin' WHERE id = 'UUID_CUA_ADMIN';
  ```

### 6.3. Tài khoản Quản trị Admin Mẫu phục vụ Kiểm thử
Hệ thống cung cấp sẵn một tài khoản Admin mẫu để ban giám khảo / nhóm kiểm thử phân quyền ngay lập tức:
- **Email**: `admin@reborn.vn`
- **Mật khẩu**: `AdminPassword123!`
- **Quyền hạn**: Quản trị viên (Toàn quyền truy cập Dashboard `/admin.html`).

### 6.4. Cách kết nối Dự án với Supabase Live của Nhóm
1. Đăng ký tài khoản miễn phí tại [https://supabase.com](https://supabase.com).
2. Tạo Project mới (ví dụ: `reborn-prod`).
3. Vào **Project Settings** ➔ **API** để lấy:
   - `Project URL` (Ví dụ: `https://xxxx.supabase.co`)
   - `anon / public key` (Khóa công khai ở client).
4. Cấu hình vào file `js/supabase-client.js` hoặc thêm vào biến môi trường Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
5. *Lưu ý*: Nếu chưa cấu hình Supabase Cloud, hệ thống sẽ tự động kích hoạt **Offline Mock Auth Storage**, đảm bảo toàn bộ giao diện, đăng ký, đăng nhập, bảo vệ checkout và quản trị Admin hoạt động trơn tru 100%.

---

## 💻 7. HƯỚNG DẪN CHẠY LOCAL VÀ KIỂM THỬ

### 7.1. Chạy Máy chủ Thử nghiệm
Mở PowerShell tại thư mục `c:\ReBorn` và chạy:
```powershell
npm start
```
Truy cập trình duyệt:
- **Cửa hàng Storefront**: [http://localhost:3000](http://localhost:3000)
- **Đăng ký / Đăng nhập**: [http://localhost:3000/auth.html](http://localhost:3000/auth.html)
- **Trang Quản trị Admin**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### 7.2. Chạy Bộ Kiểm thử Tự động (Automated Test Suites)
Chạy toàn bộ 13 bài kiểm thử (Phân hệ Thành viên 1 + Xác thực Supabase Auth):
```powershell
npm test
```
Hoặc chạy riêng từng kịch bản:
- `npm run test:auth`: Kiểm thử 10 kịch bản đăng ký, đăng nhập, session, bảo vệ giỏ hàng, RLS & Admin.
- `npm run test:member1`: Kiểm thử tạo đơn hàng, áp voucher và tra cứu đơn theo SĐT.

---

© 2026 Dự án Khởi nghiệp Re-Born • Nước Rửa Tay Vỏ Bưởi Thiên Nhiên.
