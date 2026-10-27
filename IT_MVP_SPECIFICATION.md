# BẢN ĐẶC TẢ KỸ THUẬT ỨNG DỤNG (IT MVP SPECIFICATION)
## DỰ ÁN: RE-BORN • NƯỚC RỬA TAY VỎ BƯỞI TỰ NHIÊN
> **Đơn vị thực hiện**: Nhóm Công nghệ Thông tin (IT Team)  
> **Căn cứ nghiệp vụ**: Business Model Canvas (BMC) nhóm Kinh doanh  
> **Phương pháp luận**: Lean Startup & Y Combinator MVP Philosophy (*"Cut your spec, focus on early adopters, learn fast"*)

---

## 🎯 1. BỐI CẢNH & MỤC TIÊU CỐT LÕI CỦA WEB MVP

### 1.1. Vấn đề giải quyết (Problem Statement)
- Nhóm cần một kênh số (Digital Touchpoint) để kết nối ngay lập tức với **người dùng cuồng sản phẩm nhất (Early Adopters)**: Sinh viên Gen Z tại campus FPT và Nữ văn phòng thích lối sống xanh.
- Kết nối luồng khách hàng từ **QR Code** đặt tại bàn rửa tay của các quán cà phê / tiệm trà đối tác và gian hàng Pop-up store campus.

### 1.2. Mục tiêu của bản MVP (MVP Objective)
> **"Không xây dựng một trang thương mại điện tử cồng kềnh. Xây dựng một cỗ máy kiểm chứng nhu cầu thị trường (Demand Validation Machine) nhanh nhất và đo lường phản hồi khách hàng."**

- **Thời gian hoàn thiện (Time-boxed)**: 24 - 48 giờ.
- **Tiêu chí thành công (Success Metrics)**:
  - Tỷ lệ chuyển đổi (Conversion Rate): Tối thiểu **10%** lượt truy cập từ QR Code bấm *"Đặt hàng"* hoặc *"Nhập mã giảm giá"*.
  - Thu thập danh sách khách hàng sớm: Ít nhất **50 khách hàng** điền thông tin trải nghiệm sản phẩm mẻ đầu tiên.
  - Phản hồi định tính: Đánh giá cảm nhận về mùi hương và mức giá (35.000đ – 65.000đ).

---

## ✂️ 2. TRIẾT LÝ "CUT YOUR SPEC" (TÍNH NĂNG GIỮ LẠI VS CHỦ ĐỘNG LOẠI BỎ)

Để không sa đà vào việc "yêu sản phẩm quá mức" và tốn thời gian code những thứ chưa cần thiết, đội IT phân loại rõ:

```
┌──────────────────────────────────────────────┐
│  BẢN ĐẶC TẢ MVP CỐT LÕI (IN-SCOPE)           │
│  - Landing Page truyền tải 100% Value Prop   │
│  - 2 Sản phẩm cốt lõi + 1 Combo Quà tặng     │
│  - Giỏ hàng trượt + Form đặt hàng 1 bước     │
│  - Mã ưu đãi Campus / Voucher sinh viên      │
│  - Widget Zalo / Hotline tư vấn trực tiếp    │
└──────────────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│  TÍNH NĂNG CHỦ ĐỘNG CẮT BỎ (CUT / OUT-SCOPE) │
│  ✕ Cổng thanh toán quốc tế Visa/Mastercard   │
│  ✕ Hệ thống định vị theo dõi GPS shipper     │
│  ✕ Hệ thống tài khoản / phân quyền phức tạp  │
│  ✕ Quản lý kho đa chi nhánh (ERP/WMS)        │
└──────────────────────────────────────────────┘
```

### 2.1. Danh mục tính năng CHỦ ĐỘNG CẮT BỎ (Cut Specs) & Lý do:
1. **Cắt bỏ Cổng thanh toán trực tuyến (Payment Gateway - VNPay/Visa)**:
   - *Lý do*: Theo ví dụ của **Airbnb** và **Stripe** thời kỳ đầu, chưa cần tích hợp ngân hàng phức tạp. Dùng hình thức **COD (Nhận hàng trả tiền)** và **Quét mã VietQR/MoMo tĩnh**. Đơn giản, tin cậy, không tốn phí phần trăm giao dịch.
2. **Cắt bỏ Hệ thống theo dõi hành trình đơn hàng (Live Tracking / Bản đồ)**:
   - *Lý do*: Tương tự Airbnb không làm bản đồ (no map view) đợt đầu. Đơn hàng sinh viên giao trực tiếp tại campus hoặc quán cafe đối tác qua hẹn giờ.
3. **Cắt bỏ Hệ thống Chatbot AI tự động**:
   - *Lý do*: Cần các thành viên sáng lập (Founders) **trực tiếp nói chuyện với khách hàng** qua Zalo/Hotline để lắng nghe phản hồi chi tiết về mùi hương và độ mềm da tay.

---

## 📱 3. CHI TIẾT CÁC TÍNH NĂNG CỐT LÕI (IN-SCOPE FEATURES)

### 3.1. Phân hệ 1: Truyền tải Tuyên ngôn Giá trị (Value Proposition Display)
*Khớp với Ô 1 BMC: Thuần tự nhiên lành tính • Liệu pháp hương thơm • Sống xanh Upcycling.*

- **Hero Banner**:
  - Tiêu đề ngắn gọn: *"Sự tươi mát nguyên bản, tái định hình"*.
  - Khẳng định 3 KHÔNG: Không cồn công nghiệp • Không Paraben • 100% Vỏ bưởi tái chế.
  - Nút chuyển hướng tức thì đến danh mục sản phẩm dùng thử.
- **Quy trình 3 bước (Handmade & Local Sourcing)**:
  - *01 Thu gom*: Thu vỏ bưởi từ tiệm chè/nước ép đối tác để tránh lãng phí nông sản.
  - *02 Chưng cất lạnh thủ công*: Chiết xuất nhiệt độ thấp bảo toàn hoạt chất d-Limonene.
  - *03 Công thức lành tính*: Bổ sung Glycerin thực vật và chất tạo bọt gốc dừa.
- **Cấu trúc tầng hương (Aroma Experience)**:
  - Hiển thị 3 tầng hương tự nhiên (Hương Đầu: Vỏ bưởi ép lạnh - Hương Giữa: Lá bưởi vò nát - Hương Cuối: Thảo mộc tự nhiên).

### 3.2. Phân hệ 2: Danh mục Sản phẩm MVP (Product Catalog)
*Khớp với Ô 2 & Ô 5 BMC: Mức giá sinh viên & Dòng sản phẩm bán lẻ.*

- **Sản phẩm 1: Nước rửa tay vỏ bưởi Re-Born (250ml)**
  - *Mức giá MVP*: **45.000₫** (bản trải nghiệm sinh viên) / Bản gốm tái nạp: **280.000₫**.
- **Sản phẩm 2: Túi Refill Tiết Kiệm Nước Rửa Tay (500ml)**
  - *Mức giá MVP*: **75.000₫** (tiết kiệm 15.000₫ so với mua 2 chai).
  - *Đặc điểm*: Rót đầy 2 lần chai tiêu chuẩn, giảm 80% rác thải nhựa, vòi rót tiện lợi.
- **Sản phẩm 3: Combo Đôi Bạn Cùng Tiến (2 Nước rửa tay + Túi vải)**
  - Gồm 2 Nước rửa tay vỏ bưởi 250ml + 1 Túi vải dệt thô Canvas Re-Born: **89.000₫**.
- **Chức năng xem nhanh (Quick Ritual)**:
  - Xem bảng thành phần đầy đủ, hướng dẫn rửa tay đúng cách 30 giây để giải phóng tinh dầu.

### 3.3. Phân hệ 3: Luồng Chốt Đơn & Thu thập dữ liệu (Frictionless Lead Capture & Checkout)
*Khớp với Ô 3 & Ô 4 BMC (Nam phụ trách): Bán hàng qua QR Code & Xây dựng quan hệ khách hàng.*

- **Giỏ hàng trượt (Slide-Over Cart Drawer)**:
  - Xem số lượng sản phẩm, tăng/giảm (+/-) trực tiếp.
  - Thanh tiến độ ưu đãi: *"Mua thêm để nhận quà tặng sinh thái"*.
- **Hệ thống Mã ưu đãi Campus (Voucher Code)**:
  - Khách nhập mã **`REBORN15`** hoặc **`FPTU`**: Tự động chiết khấu 15% cho sinh viên.
- **Form Đặt hàng 1 Bước (Fast Checkout Modal)**:
  - Chỉ yêu cầu 3 trường thông tin tối thiểu: **Họ tên • Số điện thoại • Nơi nhận (Campus / Địa chỉ)**.
  - Phương thức thanh toán: **COD** hoặc **Quét mã VietQR ngân hàng**.
  - Tự động sinh **Mã đơn hàng** (Ví dụ: `#RB-202688`) và gửi thông báo Toast chúc mừng.
- **Trung tâm Tư vấn trực tuyến (Floating Widget)**:
  - Nút ghim góc màn hình kết nối trực tiếp đến **Hotline & Zalo Founders** để tư vấn da nhạy cảm.

### 3.4. Phân hệ 4: Truyền thông Sống xanh & Thu hồi vỏ chai (Circular Refill)
*Khớp với Ô 4 BMC: Chương trình "Gom vỏ chai cũ - Đổi sản phẩm mới".*

- Modal giải thích cơ chế **Refill 3 bước**: Giữ lại chai cũ ➔ Mua túi nạp nhôm tiết kiệm 30% ➔ Trả lại vỏ chai để nhận mã voucher mới.

---

## 📊 4. BẢNG PHÂN CÔNG NHIỆM VỤ ĐỘI IT (IT TASK BREAKDOWN)

| Module Kỹ thuật | Task chi tiết | Thành viên phụ trách | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Frontend UI/UX** | Dựng HTML/CSS giao diện chuẩn Stitch, phong cách Botanical, tối ưu Responsive di động | IT Team (Phát / IT Lead) | ✅ Đã hoàn thành |
| **Logic Giỏ hàng & Modal** | Lập trình JavaScript xử lý Giỏ hàng trượt, Modal Đăng nhập/Đăng ký, Form Đặt hàng nhanh | IT Team | ✅ Đã hoàn thành |
| **Voucher & Checkout** | Tích hợp mã giảm giá `REBORN15`, tính toán chiết khấu và tự động sinh mã vận đơn | IT Team | ✅ Đã hoàn thành |
| **QR Code Integration** | Tạo mã QR Code dẫn trực tiếp về link web để in sticker dán tại bàn rửa tay quán cafe đối tác | IT Team (phối hợp Nam) | ⏳ Triển khai |
| **Hosting & Local Server** | Chạy Server Node.js nội bộ (`localhost:3000`) và sẵn sàng deploy lên Vercel/GitHub Pages | IT Team | ✅ Đã hoàn thành |

---

## 📈 5. KẾ HOẠCH HỌC HỎI TỪ KHÁCH HÀNG (FEEDBACK LOOP)

Theo đúng bài học *"Học được từ khách hàng nhanh chóng"*:
1. **Đo lường định lượng**: Theo dõi số lượng đơn đặt hàng thử nghiệm phát sinh sau 3 ngày đặt QR Code tại campus và quán cà phê.
2. **Đo lường định tính**: Mỗi khách hàng nhận sản phẩm sẽ được gửi 1 link khảo sát ngắn 3 câu hỏi (1: Độ ưng ý mùi hương / 2: Cảm giác sau khi rửa tay / 3: Mức giá 45k - 65k có sẵn sàng mua lại không).
3. **Vòng lặp tiếp theo (Next Iteration)**: Dựa trên phản hồi để đội R&D tinh chỉnh công thức và đội IT bổ sung tính năng theo nhu cầu thực tế của người dùng.
