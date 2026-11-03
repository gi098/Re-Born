# 📋 BẢNG PHÂN CÔNG NHIỆM VỤ DỰ ÁN RE-BORN (TASK ALLOCATION)
> **Dự án**: RE-BORN • Nước Rửa Tay Vỏ Bưởi Hữu Cơ  
> **Quy mô**: 2 Thành viên (Full-Stack E-Commerce & Vercel Deployment)  
> **Phương pháp làm việc**: Agile/Scrum Sprint (Tỷ lệ phân chia 50/50 cân bằng tuyệt đối)  
> **Cập nhật ngày**: 03/11/2026

---

## 📊 1. TỔNG QUAN TỶ TRỌNG CÔNG VIỆC (WORKLOAD SUMMARY)

| Chỉ số đánh giá | Thành viên 1 (Order & Voucher) | Thành viên 2 (Pay & Admin) |
| :--- | :---: | :---: |
| **Vai trò chính** | Module Đặt Hàng & Khuyến Mãi | Module Thanh Toán, Quản Trị & Vận Hành |
| **Phạm vi kỹ thuật** | 50% Frontend + 50% Backend | 50% Frontend + 50% Backend & Ops |
| **Tổng số Task chi tiết** | 10 Tasks | 10 Tasks |
| **Tổng thời gian dự kiến** | **40 Giờ** (50%) | **40 Giờ** (50%) |
| **Mức độ phụ thuộc** | Tạo đơn hàng ➔ Gửi sang PayOS | Nhận đơn ➔ Xử lý thanh toán & Admin |

---

## 👤 2. PHÂN HỆ 1: THÀNH VIÊN 1 (ORDER & VOUCHER SPECIALIST)
> **Trách nhiệm**: Đảm bảo toàn bộ luồng mua sắm từ Giỏ hàng đến Form đặt hàng và API lưu đơn hoạt động trơn tru.

| Mã Task | Hạng mục | Chi tiết công việc | Thời gian | Mức ưu tiên | Tiêu chí nghiệm thu (Acceptance Criteria) | Trạng thái |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| **T1.1** | Frontend | Hoàn thiện Slide-over Cart Drawer | 4h | 🔴 Cao | Bấm +/- cập nhật số lượng, xoá món, thanh freeship 150k nhảy đúng. | `[x] Hoàn thành` |
| **T1.2** | Frontend | Form Fast Checkout 1 Bước | 4h | 🔴 Cao | Validate đúng định dạng SĐT (10 số), bắt buộc nhập Tên và Địa chỉ. | `[x] Hoàn thành` |
| **T1.3** | Frontend | Xử lý Ô nhập Mã ưu đãi (Voucher) | 3h | 🟡 Vừa | Nhập `FPTU` hoặc `REBORN15` chiết khấu ngay 15% vào tổng tiền. | `[x] Hoàn thành` |
| **T1.4** | Frontend | Modal & Toast thông báo đặt hàng | 2h | 🟢 Thấp | Hiển thị mã đơn hàng `#RB-XXXXXX` và lời cảm ơn sau khi bấm đặt. | `[x] Hoàn thành` |
| **T1.5** | Database | Tạo 2 bảng CSDL: `orders` và `order_items` | 3h | 🔴 Cao | File `database/schema_orders.sql` chuẩn Postgres/Supabase. | `[x] Hoàn thành` |
| **T1.6** | Backend | Viết API `POST /api/orders` | 6h | 🔴 Cao | File `api/orders.js` nhận đơn, tính tiền, sinh mã, lưu DB an toàn. | `[x] Hoàn thành` |
| **T1.7** | Backend | Viết API `POST /api/vouchers/verify` | 4h | 🟡 Vừa | File `api/vouchers/verify.js` check hạn dùng và tính tiền giảm. | `[x] Hoàn thành` |
| **T1.8** | Backend | Viết API `GET /api/orders/track` | 4h | 🟡 Vừa | File `api/orders/track.js` + Modal tra cứu đơn theo SĐT khách. | `[x] Hoàn thành` |
| **T1.9** | Testing | Kiểm thử luồng Đặt hàng & Voucher | 5h | 🔴 Cao | File `test_member1_flow.js` test 3/3 kịch bản pass 100%. | `[x] Hoàn thành` |
| **T1.10**| Docs | Viết tài liệu API Đơn hàng & Hướng dẫn test | 5h | 🟢 Thấp | Cập nhật đầy đủ vào README.md và TASK_ALLOCATION.md. | `[x] Hoàn thành` |

---

## 👤 3. PHÂN HỆ 2: THÀNH VIÊN 2 (PAYMENT, ADMIN & DEPLOYMENT SPECIALIST)
> **Trách nhiệm**: Đảm bảo cổng VietQR tự động check tiền, trang Quản trị duyệt đơn và cấu hình hệ thống Vercel.

| Mã Task | Hạng mục | Chi tiết công việc | Thời gian | Mức ưu tiên | Tiêu chí nghiệm thu (Acceptance Criteria) | Trạng thái |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: |
| **T2.1** | Frontend | Hoàn thiện Giao diện `admin.html` | 4h | 🔴 Cao | Bảng danh sách đơn hàng có đủ: Mã đơn, Khách, Tổng tiền, Trạng thái. | `[ ] To Do` |
| **T2.2** | Frontend | Bộ lọc & Đổi trạng thái trên Admin | 4h | 🟡 Vừa | Bấm đổi: *Chờ xác nhận ➔ Đang giao ➔ Đã giao*, CSDL cập nhật ngay. | `[ ] To Do` |
| **T2.3** | Frontend | Modal Thanh toán VietQR động | 3h | 🔴 Cao | Hiển thị mã QR ngân hàng + số tiền chuẩn + đếm ngược 15 phút. | `[ ] To Do` |
| **T2.4** | Frontend | Thống kê doanh thu trên Admin | 2h | 🟢 Thấp | Hiển thị tổng tiền bán được trong ngày/tuần, số đơn thành công. | `[ ] To Do` |
| **T2.5** | Database | Tạo 2 bảng CSDL: `products` và `vouchers` | 3h | 🔴 Cao | Tạo bảng sản phẩm có cột `stock` (tồn kho) và quản lý danh mục giá. | `[ ] To Do` |
| **T2.6** | Backend | Đăng ký & Tích hợp SDK PayOS | 5h | 🔴 Cao | Sinh mã thanh toán động chuẩn VietQR liên kết tài khoản ngân hàng. | `[ ] To Do` |
| **T2.7** | Backend | Viết Webhook `POST /api/payos-webhook` | 6h | 🔴 Cao | Nhận tín hiệu ngân hàng, đổi trạng thái đơn sang `PAID` trong 3 giây. | `[ ] To Do` |
| **T2.8** | Backend | Tích hợp gửi Email tự động (`Resend`) | 4h | 🟡 Vừa | Gửi email hoá đơn điện tử có logo Re-Born về hòm thư của khách. | `[ ] To Do` |
| **T2.9** | Ops | Quản trị GitHub & Deploy Vercel | 4h | 🔴 Cao | Setup CI/CD: Mỗi khi `git push` là web trên Vercel tự build mới. | `[ ] To Do` |
| **T2.10**| Testing | Test nạp tiền ngân hàng thực tế & Admin | 5h | 🔴 Cao | Chuyển khoản thật 10.000đ test hệ thống có tự khớp lệnh không. | `[ ] To Do` |

---

## 📅 4. TIẾN ĐỘ THỰC HIỆN THEO TUẦN (SPRINT TIMELINE)

```
TUẦN 1: DỰNG CƠ SỞ DỮ LIỆU & LUỒNG ĐẶT HÀNG
┌──────────────────────────────────────────────────────────────┐
│ Thành viên 1: Làm xong T1.1, T1.2, T1.5, T1.6                │
│ Thành viên 2: Làm xong T2.5, T2.9 (Setup Git & Vercel)       │
│ 👉 Mục tiêu: Khách bấm đặt hàng ➔ Đơn lưu thành công vào DB  │
└──────────────────────────────────────────────────────────────┘
                               ▼
TUẦN 2: THANH TOÁN VIETQR PAYOS TỰ ĐỘNG & TRANG ADMIN
┌──────────────────────────────────────────────────────────────┐
│ Thành viên 1: Làm xong T1.3, T1.4, T1.7 (Voucher giảm giá)   │
│ Thành viên 2: Làm xong T2.1, T2.2, T2.3, T2.6, T2.7 (PayOS)  │
│ 👉 Mục tiêu: Quét QR chuyển khoản tự khớp lệnh ➔ Admin thấy  │
└──────────────────────────────────────────────────────────────┘
                               ▼
TUẦN 3: GỬI MAIL, KIỂM THỬ CHÉO & GO-LIVE
┌──────────────────────────────────────────────────────────────┐
│ Thành viên 1: Làm T1.8, T1.9, T1.10 (Tra cứu đơn & Test)     │
│ Thành viên 2: Làm T2.4, T2.8, T2.10 (Gửi Mail & Chạy thực tế)│
│ 👉 Mục tiêu: Chạy thử đơn thật, trỏ tên miền chính thức      │
└──────────────────────────────────────────────────────────────┘
```

---

## 🤝 5. BIÊN BẢN GIAO THOA & PHỐI HỢP (SYNC RULES)

1. **Chuẩn dữ liệu Đơn hàng (Data Contract):**
   Hai bạn thống nhất đối tượng đơn hàng trao đổi giữa Frontend và Backend có cấu trúc:
   ```json
   {
     "orderId": "#RB-202688",
     "customer": {
       "name": "Nguyễn Văn A",
       "phone": "0988123456",
       "address": "Campus FPT, Q.9, TP.HCM"
     },
     "items": [
       { "id": "pomelo-handwash", "qty": 2, "price": 45000 }
     ],
     "voucherCode": "REBORN15",
     "discountAmount": 13500,
     "finalTotal": 76500,
     "paymentMethod": "VIETQR"
   }
   ```
2. **Quy tắc làm việc trên Git (Branching Policy):**
   - Không commit đè lên nhánh `main`.
   - Thành viên 1 tạo nhánh: `feature/order-checkout`
   - Thành viên 2 tạo nhánh: `feature/payos-admin`
   - Kiểm tra không bị xung đột (conflict) rồi mới Merge vào `main` để Vercel tự deploy.
3. **Quy định Check-in hàng ngày:**
   - Mỗi tối dành 10 phút nhắn tin trao đổi: *Hôm nay làm được task nào? Có bị kẹt (block) ở đâu không? Ngày mai làm gì?*

---

© 2026 RE-BORN E-Commerce Core Team • Bảng phân công nhiệm vụ nội bộ.

