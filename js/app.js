/**
 * RE-BORN • Nước Rửa Tay Vỏ Bưởi - Sạch Khuẩn Từ Tự Nhiên
 * Standardized Interactive Core Logic & MVP Touchpoints
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Global State
  // ==========================================================================
  const state = {
    lang: localStorage.getItem('reborn_lang') || 'vi',
    cart: [
      {
        id: 'pomelo-handwash',
        name: 'Nước rửa tay vỏ bưởi',
        sub: 'Vỏ bưởi ép lạnh & Thảo mộc',
        price: 45000,
        volume: '250 ml',
        image: 'assets/images/product_handwash.jpg',
        quantity: 1
      }
    ],
    freeShippingThreshold: 150000,
    discountRate: 0,
    appliedPromoCode: ''
  };

  // Product Database Dictionary (Bilingual support)
  const productData = {
    'pomelo-handwash': {
      id: 'pomelo-handwash',
      name: {
        vi: 'Nước rửa tay vỏ bưởi',
        en: 'Pomelo Peel Hand Wash'
      },
      sub: {
        vi: 'VỎ BƯỞI ÉP LẠNH • TUYẾT TÙNG • THẢO MỘC',
        en: 'COLD-PRESSED POMELO • CEDARWOOD • HERBS'
      },
      price: 45000,
      volume: {
        vi: '250 ml • Chai rPET vòi nhấn',
        en: '250 ml • rPET Pump Bottle'
      },
      image: 'assets/images/product_handwash.jpg',
      desc: {
        vi: 'Công thức làm sạch dịu lành kết hợp tinh dầu vỏ bưởi ép chậm và thảo mộc tự nhiên. Đánh bay 99.9% vi khuẩn, nuôi dưỡng màng ẩm da tay và để lại hương cam chanh thanh tĩnh.',
        en: 'Gentle cleansing formula combining cold-distilled pomelo peel essential oil and native botanicals. Eliminates 99.9% of bacteria while nourishing skin moisture.'
      },
      ingredients: {
        vi: 'Chiết xuất tinh dầu vỏ bưởi Citrus Maxima ép lạnh, Glycerin thực vật hữu cơ, Decyl Glucoside (gốc dừa lành tính), Nước khoáng tinh khiết, Tinh dầu tuyết tùng.',
        en: 'Cold-pressed Citrus Maxima pomelo peel essential oil, organic plant glycerin, Decyl Glucoside (coconut derivative), pure mineral water, cedarwood oil.'
      },
      ritual: {
        vi: 'Bơm một lượng vừa đủ (1 lần nhấn), tạo bọt nhẹ nhàng khắp bàn tay trong 30 giây để hương thơm tự nhiên lan tỏa trọn vẹn, sau đó xả sạch với nước.',
        en: 'Press pump once, lather gently over hands for 30 seconds to allow the botanical citrus fragrance to unfold, then rinse thoroughly.'
      }
    },
    'pomelo-refill': {
      id: 'pomelo-refill',
      name: {
        vi: 'Túi Refill Nước rửa tay 500ml',
        en: 'Hand Wash Refill Pouch 500ml'
      },
      sub: {
        vi: 'VỎ BƯỞI ÉP LẠNH • TIẾT KIỆM RÁC NHỰA',
        en: 'COLD-PRESSED POMELO • ECO SAVINGS'
      },
      price: 75000,
      volume: {
        vi: '500 ml • Túi sinh thái tiết kiệm',
        en: '500 ml • Eco Refill Pouch'
      },
      image: 'assets/images/product_refill.jpg',
      desc: {
        vi: 'Dung tích nhân đôi 500ml tiện lợi rót đầy lại 2 chai vòi nhấn cũ. Tiết kiệm 15.000₫ và cắt giảm 80% rác thải nhựa so với việc mua chai mới.',
        en: 'Double 500ml volume easily refills 2 empty pump bottles. Saves 15,000₫ and cuts plastic packaging waste by 80%.'
      },
      ingredients: {
        vi: 'Chiết xuất vỏ bưởi hữu cơ tái sinh, Glycerin thực vật màng ẩm, Decyl Glucoside gốc dừa, Nước khoáng tinh khiết, Tinh dầu thảo mộc dưỡng da.',
        en: 'Upcycled organic pomelo peel extract, moisture-locking plant glycerin, coconut Decyl Glucoside, pure mineral water, nourishing botanical oils.'
      },
      ritual: {
        vi: 'Mở nắp vặn túi refill, rót chậm rãi vào chai nước rửa tay 250ml Re-Born có sẵn. Vặn chặt nắp chai và tái sử dụng vỏ túi cho lần thu gom kế tiếp.',
        en: 'Unscrew the refill cap, pour slowly into your 250ml Re-Born pump bottle. Fasten tightly and save pouch for next bottle return.'
      }
    },
    'eco-giftset': {
      id: 'eco-giftset',
      name: {
        vi: 'Combo Đôi • Nước rửa tay & Túi vải',
        en: 'Duo Combo • 2 Hand Washes & Canvas Tote'
      },
      sub: {
        vi: '2 CHAI RỬA TAY 250ML + TÚI VẢI CANVAS',
        en: '2 X 250ML PUMPS + 1 CANVAS TOTE'
      },
      price: 89000,
      volume: {
        vi: 'Set 3 món (2 Chai rửa tay + 1 Túi vải)',
        en: 'Set of 3 (2 Bottles + 1 Tote Bag)'
      },
      image: 'assets/images/hero_product.jpg',
      desc: {
        vi: 'Combo ưu đãi mua chung 2 chai nước rửa tay vỏ bưởi tặng kèm túi vải dệt thô Canvas Re-Born. Tiết kiệm chi phí ship và cùng bạn bè lan tỏa lối sống xanh.',
        en: 'Special bundle of 2 pomelo hand wash bottles accompanied by a Re-Born eco canvas tote. Saves shipping and promotes green lifestyle among friends.'
      },
      ingredients: {
        vi: 'Bao gồm: 2 Chai Nước rửa tay vỏ bưởi 250ml có vòi nhấn + 1 Túi vải Canvas thời trang.',
        en: 'Includes: 2 x 250ml Pomelo Hand Wash with pump + 1 Canvas Tote Bag.'
      },
      ritual: {
        vi: 'Đặt 1 chai tại bồn rửa tay ký túc xá/văn phòng và chia sẻ chai còn lại cùng bạn bè hoặc người thân.',
        en: 'Keep 1 bottle at your room sink and share the other with your friend or roommate.'
      }
    }
  };

  // ==========================================================================
  // Multilingual Dictionary (i18n)
  // ==========================================================================
  const i18n = {
    vi: {
      // Navigation
      nav_home: 'Trang chủ',
      nav_about: 'Giới thiệu',
      nav_products: 'Sản phẩm',
      nav_benefits: 'Lợi ích',
      nav_contact: 'Liên hệ',
      nav_fast_order: 'Đặt hàng nhanh',
      nav_search_title: 'Tìm kiếm sản phẩm',
      nav_cart_title: 'Giỏ hàng',
      nav_b2b: 'Đối tác Doanh nghiệp & B2B',
      nav_refill: 'Chính sách Refill đổi chai',
      nav_faqs: 'Câu hỏi thường gặp',
      lang_select_lbl: 'Ngôn ngữ:',
      mobile_cta_order: 'Đặt hàng trải nghiệm ngay',
      hotline_founders: 'Hotline Founders',

      // Hero
      hero_badge: '100% Vỏ Bưởi Tái Sinh',
      hero_title: 'Sự tươi mát nguyên bản,<br><span>tái định hình.</span>',
      hero_desc: 'Chăm sóc đôi tay mỗi ngày lấy cảm hứng từ sự thanh khiết phục hồi của vỏ bưởi tái sinh. Chế tác thủ công theo từng mẻ nhỏ với sự trân trọng tuyệt đối dành cho tự nhiên.',
      hero_cta_explore: 'Khám phá sản phẩm',
      hero_cta_ritual: 'Trải nghiệm nghi thức',
      stat_peel: 'Vỏ bưởi Upcycling',
      stat_clean: 'Cồn & Paraben',
      stat_antibac: 'Sạch khuẩn dịu nhẹ',

      // Philosophy
      philo_label: 'TRIẾT LÝ BẢN ĐỊA',
      philo_title: 'Nông sản tuần hoàn. Hồi sinh từ vỏ bưởi.',
      philo_desc: 'Mỗi năm, hàng tấn vỏ bưởi sau khi lấy múi bị vứt bỏ lãng phí. Re-Born thu gom trực tiếp từ các quán chè, tiệm nước ép đối tác, chưng cất lạnh để giữ trọn tinh túy d-Limonene cho đôi tay bạn.',
      philo_step1_title: 'Thu gom vỏ bưởi sạch',
      philo_step1_desc: 'Thu gom vỏ bưởi tươi mỗi ngày từ các đối tác địa phương. Phân loại và rửa sạch bằng nước muối ion kiềm trước khi chế tác.',
      philo_step2_title: 'Chưng cất lạnh thủ công',
      philo_step2_desc: 'Chiết xuất tinh dầu ở nhiệt độ thấp bảo toàn nguyên vẹn hoạt chất d-Limonene kháng khuẩn tự nhiên mà không phá hủy cấu trúc hương.',
      philo_step3_title: 'Công thức lành tính',
      philo_step3_desc: 'Bổ sung Glycerin thực vật và chất tạo bọt hữu cơ gốc dừa, đảm bảo độ ẩm tuyệt đối cho làn da nhạy cảm và trẻ nhỏ.',

      // Products Section
      prod_label: 'BỘ SƯU TẬP THƯỜNG NHẬT',
      prod_title: 'Nghi thức thanh sạch. Khơi nguồn từ tự nhiên.',
      prod_desc: 'Mỗi sản phẩm là một lời cam kết về lối sống xanh, được đóng gói trong chai rPET tái sinh thân thiện với môi trường.',
      btn_add_cart: 'Thêm giỏ hàng',
      btn_view_detail: 'Xem chi tiết →',
      stock_in_stock: 'Còn hàng (Mẻ tươi)',
      stock_save_20k: 'Tiết kiệm 20k',
      stock_campus: 'Ưu đãi Campus',
      badge_antibac: 'SẠCH KHUẨN • DƯỠNG ẨM',
      badge_refill: 'REFILL TIẾT KIỆM',
      badge_combo: 'COMBO MUA CHUNG',

      prod1_title: 'Nước rửa tay vỏ bưởi',
      prod1_vol: 'Dung tích: 250 ml • Chai rPET vòi nhấn',
      prod1_notes: 'VỎ BƯỞI ÉP LẠNH • TUYẾT TÙNG • THẢO MỘC',
      prod1_desc: 'Chứa tinh dầu vỏ bưởi ép chậm kết hợp thảo mộc cấp ẩm dịu nhẹ. Nhẹ nhàng gột rửa 99.9% vi khuẩn, bảo vệ độ ẩm tự nhiên của đôi tay không gây khô ráp.',

      prod2_title: 'Túi Refill Nước rửa tay 500ml',
      prod2_vol: 'Dung tích: 500 ml • Rót đầy 2 chai 250ml',
      prod2_notes: 'VỎ BƯỞI ÉP LẠNH • GỖ HINOKI • TUYẾT TÙNG',
      prod2_desc: 'Dung tích nhân đôi tiện lợi nạp lại bình vòi nhấn cũ. Giải pháp kinh tế thông minh giúp tiết kiệm 15.000₫ chi phí và chung tay giảm 80% rác thải nhựa.',

      prod3_title: 'Combo Đôi • Nước rửa tay & Túi vải',
      prod3_vol: 'Gồm: 2 Chai rửa tay 250ml + 1 Túi vải Canvas',
      prod3_notes: 'TIẾT KIỆM PHÍ SHIP • MUA CHUNG BẠN BÈ',
      prod3_desc: 'Gói ưu đãi mua chung 2 chai nước rửa tay vỏ bưởi tặng kèm túi vải dệt thô Canvas Re-Born. Lựa chọn lý tưởng cho bạn bè cùng phòng KTX rủ nhau sống xanh.',

      // Fragrance
      frag_label: 'LIỆU PHÁP HƯƠNG THƠM',
      frag_title: 'Hương thơm đánh thức các giác quan.',
      frag_desc: 'Không sử dụng hương liệu hóa học nhân tạo. Re-Born phối ngẫu các phân tử tinh dầu bưởi tự nhiên với thảo mộc bản địa, mở ra 3 tầng chuyển hương êm dịu.',
      frag_t1_title: '01 • Tầng Hương Đầu (Top Notes)',
      frag_t1_time: '0 – 15 Phút đầu',
      frag_t1_desc: '<strong>Vỏ bưởi ép lạnh & Cam hương (Bergamot)</strong>: Bùng nổ cảm giác thanh mát, sảng khoái tức thì, đánh tan mệt mỏi.',
      frag_t2_title: '02 • Tầng Hương Giữa (Heart Notes)',
      frag_t2_time: '15 – 60 Phút tiếp theo',
      frag_t2_desc: '<strong>Lá bưởi vò nát & Hoa bưởi non</strong>: Hương xanh tươi dịu ngọt của vườn quê, mang lại sự bình yên, thư giãn sâu cho tâm trí.',
      frag_t3_title: '03 • Tầng Hương Cuối (Base Notes)',
      frag_t3_time: 'Lưu hương 2 – 4 Giờ',
      frag_t3_desc: '<strong>Gỗ Tuyết tùng & Thảo mộc dịu nhẹ</strong>: Nốt hương ấm áp, giữ độ ẩm mượt và lưu luyến êm ái trên đôi bàn tay.',

      // Survey
      survey_label: 'ĐỒNG HÀNH HOÀN THIỆN',
      survey_title: 'Góp ý cảm nhận mùi hương mẻ đầu tiên',
      survey_desc: 'Re-Born trân trọng từng phản hồi từ bạn sau khi trải nghiệm sản phẩm. Ý kiến của bạn giúp chúng mình liên tục hoàn thiện công thức chiết xuất vỏ bưởi tự nhiên đạt độ tinh khiết cao nhất.',
      survey_reward_badge: 'ĐẶC QUYỀN TRẢI NGHIỆM',
      survey_reward_discount: 'Voucher Giảm 20%',
      survey_reward_title: 'Quà tặng tri ân từ đội ngũ R&D',
      survey_reward_desc: 'Gửi phản hồi nhanh để nhận mã ưu đãi giảm 20% áp dụng cho đơn hàng tiếp theo hoặc combo Refill tiết kiệm.',
      survey_perk1: '✓ Nhận mã ngay qua Inbox Facebook',
      survey_perk2: '✓ Áp dụng toàn bộ sản phẩm',
      survey_q1: 'Mùi hương tinh dầu bưởi mẻ mới:',
      survey_q2: 'Cảm giác dưỡng ẩm da tay sau khi rửa:',
      survey_q3: 'Đánh giá mức giá trải nghiệm 45k (250ml):',
      survey_q4: 'Tên hoặc Link Facebook của bạn:',
      survey_btn: 'Gửi phản hồi qua Facebook & Nhận Voucher 20%',

      // B2B
      b2b_badge: 'B2B • ĐỐI TÁC DOANH NGHIỆP "GREEN / ECO"',
      b2b_title: 'Giải Pháp Xanh Cho Doanh Nghiệp, Văn Phòng, F&B & Khách Sạn',
      b2b_desc: 'Trang bị nước rửa tay vỏ bưởi hữu cơ tự nhiên tại <strong>pantry, lavabo & khu vệ sinh</strong>. Re-Born tặng <strong>Chai dùng thử 500ml (0đ)</strong> trải nghiệm thực tế và cung cấp <strong>Can sỉ 3L – 5L</strong> chiết khấu tới 35% cho nhu cầu Refill định kỳ.',
      b2b_sample_title: 'Chai Dùng Thử 500ml',
      b2b_sample_desc: 'Gửi tận nơi 01 chai 500ml để chủ cơ sở, nhân viên và khách trải nghiệm thực tế hương bưởi tự nhiên, độ tạo bọt và dưỡng ẩm da tay.',
      b2b_sample_check: '✓ Miễn phí gửi mẫu tận nơi',
      b2b_bulk_title: 'Can Lớn 3L & 5L (Refill)',
      b2b_bulk_desc: 'Dung tích lớn chuyên dụng cho chiết/refill tại quầy lavabo. Tiết kiệm 25% – 35% chi phí, tặng kèm bình gốm sứ sang trọng và thu gom can rỗng.',
      b2b_bulk_check: '✓ Chiết khấu sỉ 25% – 35%',
      b2b_form_title: 'Đăng ký Đối tác Doanh nghiệp',
      b2b_form_sub: 'Nhận chai mẫu 500ml miễn phí hoặc bảng báo giá can sỉ 3L - 5L:',
      b2b_btn_submit: 'Gửi thông tin hợp tác B2B ngay',

      // Sustainability
      sust_label: 'KINH TẾ TUẦN HOÀN',
      sust_title: 'Chương trình: Gom vỏ chai cũ - Đổi sản phẩm mới',
      sust_desc: 'Đừng vứt bỏ vỏ chai sau khi dùng hết! Re-Born tiếp nhận mọi chai rPET đã qua sử dụng để làm sạch, khử khuẩn bằng tia UV và tái nạp mẻ tinh dầu mới, giảm thiểu tối đa rác thải nhựa ra môi trường.',
      sust_step1_t: '01. Giữ chai cũ',
      sust_step1_d: 'Giữ lại chai Re-Born rPET đã dùng hết.',
      sust_step2_t: '02. Đem đến Pop-up',
      sust_step2_d: 'Gửi lại tại gian hàng Pop-up trên Campus FPT.',
      sust_step3_t: '03. Nhận chiết khấu',
      sust_step3_d: 'Giảm ngay 30% khi mua túi nạp refill dung tích lớn.',

      // FAQs
      faq_label: 'GIẢI ĐÁP THẮC MẮC',
      faq_title: 'Câu hỏi thường gặp',
      faq_q1: 'Sản phẩm có dùng cồn công nghiệp để kháng khuẩn không?',
      faq_a1: 'Hoàn toàn không. Re-Born tận dụng hoạt chất tự nhiên d-Limonene từ vỏ bưởi kết hợp chiết xuất thực vật hữu cơ để diệt khuẩn 99.9% mà không làm khô ráp da hay gây cay nồng mũi.',
      faq_q2: 'Sinh viên tại campus FPT nhận hàng như thế nào?',
      faq_a2: 'Bạn chỉ cần chọn "Nhận hàng tại Campus FPT" khi đặt hàng. Thành viên nhóm sẽ giao trực tiếp đến tận sảnh tòa nhà của bạn hoàn toàn miễn phí vận chuyển trong giờ nghỉ giải lao.',
      faq_q3: 'Hạn sử dụng của sản phẩm thủ công là bao lâu?',
      faq_a3: 'Do được chưng cất tự nhiên và bảo quản bằng chiết xuất tinh dầu nguyên chất, sản phẩm có hạn sử dụng tối ưu trong vòng 6 - 8 tháng kể từ ngày mở nắp.',
      faq_q4: 'Chính sách bảo hành và đổi trả cho da nhạy cảm như thế nào?',
      faq_a4: 'Re-Born áp dụng cam kết <strong>Bảo hành dịu nhẹ 14 ngày (14-day gentle-care guarantee)</strong>: hỗ trợ 1 đổi 1 hoàn toàn miễn phí nếu khách hàng có bất kỳ dấu hiệu kích ứng da nào, kèm tư vấn trực tiếp 1:1 từ đội ngũ sáng lập.',

      // Footer
      footer_about_desc: 'Nước rửa tay từ phụ phẩm vỏ bưởi hữu cơ, sạch khuẩn dịu lành cho làn da và môi trường.',
      footer_products_col: 'Sản Phẩm',
      footer_brand_col: 'Về Thương Hiệu',
      footer_newsletter_title: 'Nhận Ưu Đãi -15%',
      footer_newsletter_desc: 'Nhập email nhận mã <strong>REBORN15</strong> cho đơn hàng đầu:',
      footer_newsletter_btn: 'Đăng ký',
      footer_newsletter_note: 'Cam kết bảo mật • Không gửi thư rác',
      footer_rights: '© 2026 RE-BORN • Sạch Khuẩn Từ Tự Nhiên. All rights reserved.',

      // Cart Drawer
      cart_heading: 'Giỏ hàng của bạn',
      cart_bag_note: '(Túi vải sinh thái kèm theo)',
      cart_apply_btn: 'Áp dụng',
      cart_discount_lbl: 'Ưu đãi áp dụng:',
      cart_subtotal_lbl: 'Tổng thanh toán:',
      cart_checkout_cta: 'Tiến hành đặt hàng ngay →',
      cart_payment_notice: '🔒 Thanh toán khi nhận hàng (COD) hoặc Chuyển khoản VietQR',
      cart_track_prompt: '📦 Bạn đã đặt hàng? Tra cứu tiến độ giao',

      // Checkout modal
      co_label: 'ĐẶT HÀNG NHANH CHÓNG',
      co_title: 'Thông tin nhận hàng',
      co_desc: 'Không cần đăng ký tài khoản. Hoàn tất trong 30 giây để nhận sản phẩm mẻ tươi hôm nay.',
      co_name_lbl: 'Họ và tên của bạn',
      co_name_ph: 'Ví dụ: Nguyễn Minh Anh',
      co_phone_lbl: 'Số điện thoại nhận hàng',
      co_phone_ph: 'Ví dụ: 0988 123 456',
      co_addr_lbl: 'Nơi nhận hàng',
      co_addr_ph: 'Ví dụ: Sảnh Beta Campus FPT / Hoặc địa chỉ nhà riêng',
      co_pay_lbl: 'Phương thức thanh toán tiện lợi',
      co_pay_cod: '💵 Tiền mặt khi nhận hàng (COD)',
      co_pay_qr: '📱 Quét mã VietQR chuyển khoản',
      co_ship_fee_lbl: 'Phí giao hàng:',
      co_ship_fee_val: 'Miễn phí tại Campus / Tiêu chuẩn 15k',
      co_total_lbl: 'Tổng thanh toán:',
      co_btn_submit: 'Xác nhận đặt hàng ngay ➔',

      // VietQR Modal
      qr_badge: '⚡ Thanh toán không tiền mặt • VietQR 24/7',
      qr_title: 'Quét Mã VietQR Chuyển Khoản',
      qr_sub: 'Mở ứng dụng ngân hàng bất kỳ để quét mã thanh toán tự động',
      qr_btn_confirm: '✓ Tôi đã chuyển khoản thành công',
      qr_btn_cancel: 'Để tôi thanh toán sau',

      // Search modal
      search_title: 'Tìm kiếm sản phẩm',
      search_ph: 'Nhập tên sản phẩm (rửa tay 250ml, túi refill 500ml, combo...)',

      // Tracking modal
      track_label: 'HÀNH TRÌNH ĐƠN HÀNG',
      track_title: 'Tra cứu tình trạng đơn',
      track_desc: 'Nhập số điện thoại đặt hàng để xem tình trạng giao hàng và lịch sử mua sắm.',
      track_ph: 'Ví dụ: 0988 123 456',
      track_btn: 'Tra cứu',

      // Consult / Info Modal
      consult_team_badge: 'Đội ngũ Chăm Sóc Khách Hàng Re-Born',
      consult_title: 'Tư Vấn Sản Phẩm',
      consult_desc: 'Bạn đang băn khoăn về độ dịu nhẹ cho da tay, tầng hương vỏ bưởi tự nhiên hay ưu đãi hôm nay? Đội ngũ Re-Born luôn sẵn sàng đồng hành cùng bạn!',
      consult_fb_title: 'Nhắn tin Fanpage Facebook',
      consult_fb_sub: 'Phản hồi trong 5 phút • Tư vấn 1:1',
      consult_zalo_sub: 'Nhắn tin trực tiếp • Hỗ trợ nhanh 24/7',
      consult_trust: 'Tư vấn tận tâm • 100% Thuần thực vật • Hoàn toàn miễn phí',

      // Quick view modal
      qv_ingr_title: '✦ Thành phần thảo mộc hoạt tính:',
      qv_ritual_title: '✦ Nghi thức sử dụng gợi ý:',
      qv_add_btn: 'Thêm vào giỏ hàng',

      // Dynamic strings & Toasts
      toast_lang_switched: 'Đã chuyển đổi sang Tiếng Việt',
      cart_empty_title: 'Giỏ hàng của bạn đang trống',
      cart_empty_desc: 'Khám phá các sản phẩm bưởi tái chế mẻ tươi hôm nay để bắt đầu nghi thức.',
      toast_added_to_cart: 'Đã thêm vào giỏ hàng!',
      toast_removed_item: 'Đã bỏ sản phẩm khỏi giỏ hàng',
      free_ship_congrats: '🎉 <strong>Chúc mừng!</strong> Bạn đã đủ điều kiện <strong>Miễn phí vận chuyển toàn quốc</strong>.',
      free_ship_need_more: 'Mua thêm <strong>{val}₫</strong> để được <strong>Miễn phí giao hàng</strong>'
    },
    en: {
      // Navigation
      nav_home: 'Home',
      nav_about: 'About Us',
      nav_products: 'Products',
      nav_benefits: 'Benefits',
      nav_contact: 'Contact',
      nav_fast_order: 'Quick Order',
      nav_search_title: 'Search products',
      nav_cart_title: 'Shopping Cart',
      nav_b2b: 'Corporate & B2B Solutions',
      nav_refill: 'Refill & Bottle Return',
      nav_faqs: 'FAQs',
      lang_select_lbl: 'Language:',
      mobile_cta_order: 'Experience Re-Born Now',
      hotline_founders: 'Founders Hotline',

      // Hero
      hero_badge: '100% Upcycled Pomelo Peels',
      hero_title: 'Pure original freshness,<br><span>redefined.</span>',
      hero_desc: 'Daily hand care inspired by the restorative purity of upcycled pomelo peels. Handcrafted in small batches with utmost reverence for nature.',
      hero_cta_explore: 'Explore Collection',
      hero_cta_ritual: 'Cleansing Ritual',
      stat_peel: 'Upcycled peels',
      stat_clean: 'Alcohol & Parabens',
      stat_antibac: 'Gentle purity',

      // Philosophy
      philo_label: 'CIRCULAR PHILOSOPHY',
      philo_title: 'Circular Agriculture. Reborn from Pomelo Peels.',
      philo_desc: 'Every year, tons of fragrant pomelo rinds are discarded after juicing. Re-Born collects them directly from local partners and cold-distills them into restorative d-Limonene hand wash.',
      philo_step1_title: 'Clean Peel Collection',
      philo_step1_desc: 'Collecting fresh pomelo rinds daily from certified local partners. Rinsed with alkaline ion salt water before processing.',
      philo_step2_title: 'Cold-press Distillation',
      philo_step2_desc: 'Extracting pure essential oil at low temperature to preserve natural antibacterial d-Limonene without damaging botanical notes.',
      philo_step3_title: 'Gentle Botanical Formula',
      philo_step3_desc: 'Formulated with plant-derived Glycerin and coconut-based gentle cleansers, ensuring safe hydration for sensitive skin.',

      // Products Section
      prod_label: 'THE DAILY COLLECTION',
      prod_title: 'Pure cleansing rituals. Born from nature.',
      prod_desc: 'Every bottle represents our dedication to sustainable living, bottled in 100% recycled rPET containers.',
      btn_add_cart: 'Add to Cart',
      btn_view_detail: 'Quick View →',
      stock_in_stock: 'In Stock (Fresh Batch)',
      stock_save_20k: 'Save 20k',
      stock_campus: 'Campus Deal',
      badge_antibac: 'ANTIBACTERIAL • HYDRATING',
      badge_refill: 'ECO REFILL',
      badge_combo: 'DUO COMBO DEAL',

      prod1_title: 'Pomelo Peel Hand Wash',
      prod1_vol: 'Volume: 250 ml • rPET Pump Bottle',
      prod1_notes: 'COLD-PRESSED POMELO • CEDARWOOD • HERBS',
      prod1_desc: 'Infused with cold-pressed pomelo oil and gentle hydrating botanicals. Eliminates 99.9% of bacteria while maintaining skin moisture.',

      prod2_title: 'Refill Pouch Hand Wash 500ml',
      prod2_vol: 'Volume: 500 ml • Fills two 250ml bottles',
      prod2_notes: 'COLD-PRESSED POMELO • HINOKI • CEDARWOOD',
      prod2_desc: 'Double volume pouch to easily refill your pump bottle. Smart economical choice saving 15,000₫ and cutting plastic waste by 80%.',

      prod3_title: 'Duo Combo • 2 Hand Washes & Tote Bag',
      prod3_vol: 'Set of 3: 2 x 250ml Bottles + 1 Canvas Tote',
      prod3_notes: 'SAVE SHIPPING • GROUP ORDER DEAL',
      prod3_desc: 'Special group package with 2 pomelo hand wash bottles plus an exclusive Re-Born raw canvas tote bag. Perfect for campus roommates.',

      // Fragrance
      frag_label: 'AROMATHERAPY EXPERIENCE',
      frag_title: 'Fragrance that awakens your senses.',
      frag_desc: 'No synthetic artificial fragrances. Re-Born blends authentic pomelo peel molecules with native botanicals, unlocking 3 gentle unfolding scent layers.',
      frag_t1_title: '01 • Top Notes',
      frag_t1_time: 'First 0 – 15 Minutes',
      frag_t1_desc: '<strong>Cold-pressed Pomelo Peel & Bergamot</strong>: An immediate burst of crisp citrus freshness, clearing away fatigue.',
      frag_t2_title: '02 • Heart Notes',
      frag_t2_time: 'Next 15 – 60 Minutes',
      frag_t2_desc: '<strong>Crushed Pomelo Leaves & Blossom</strong>: Soft green rural garden blossoms, bringing deep serenity and mental calm.',
      frag_t3_title: '03 • Base Notes',
      frag_t3_time: 'Lasts 2 – 4 Hours',
      frag_t3_desc: '<strong>Cedarwood & Delicate Botanicals</strong>: Warm grounding wood notes, locking in moisture and leaving an elegant finish.',

      // Survey
      survey_label: 'COMMUNITY FEEDBACK',
      survey_title: 'Share your scent experience on the first batch',
      survey_desc: 'Re-Born cherishes every impression you share. Your feedback helps our R&D team continuously refine our cold-distilled formula to perfection.',
      survey_reward_badge: 'TESTER PRIVILEGE',
      survey_reward_discount: '20% Off Voucher',
      survey_reward_title: 'Appreciation Gift from R&D Team',
      survey_reward_desc: 'Submit your quick feedback to receive an instant 20% discount code for your next order or refill combo.',
      survey_perk1: '✓ Instant voucher via Facebook Inbox',
      survey_perk2: '✓ Applicable to all products',
      survey_q1: 'Fresh pomelo essential oil aroma:',
      survey_q2: 'Skin hydration feeling after wash:',
      survey_q3: 'Evaluation of 45k trial price (250ml):',
      survey_q4: 'Your Name or Facebook Profile:',
      survey_btn: 'Send Feedback via Facebook & Claim 20% Voucher',

      // B2B
      b2b_badge: 'B2B • GREEN CORPORATE PARTNERS',
      b2b_title: 'Eco Solutions for Offices, Cafes, F&B & Boutique Hotels',
      b2b_desc: 'Equip pure pomelo hand wash in your <strong>pantry, restrooms & lavatories</strong>. Re-Born offers a <strong>Free 500ml Trial Bottle (0đ)</strong> and supplies <strong>3L & 5L Wholesale Canisters</strong> with up to 35% discount.',
      b2b_sample_title: 'Free 500ml Sample Bottle',
      b2b_sample_desc: 'Delivered to your venue for managers, staff, and guests to experience the natural pomelo scent and soft lather.',
      b2b_sample_check: '✓ Free sample delivery to door',
      b2b_bulk_title: '3L & 5L Bulk Canisters (Refill)',
      b2b_bulk_desc: 'Large capacity canister for countertop refills. Save 25% – 35% costs, complimentary ceramic dispenser, and empty canister pickup.',
      b2b_bulk_check: '✓ 25% – 35% wholesale discount',
      b2b_form_title: 'Register for Corporate Partnership',
      b2b_form_sub: 'Get a free 500ml sample or wholesale price quotation:',
      b2b_btn_submit: 'Submit B2B Partnership Request',

      // Sustainability
      sust_label: 'CIRCULAR ECONOMY',
      sust_title: 'Program: Return Old Bottles - Redeem New Products',
      sust_desc: 'Don\'t discard empty bottles! Re-Born accepts all used rPET bottles for UV sanitization, cleaning, and refilling, minimizing plastic waste in our environment.',
      sust_step1_t: '01. Keep Empty Bottle',
      sust_step1_d: 'Save your empty Re-Born rPET bottles.',
      sust_step2_t: '02. Bring to Pop-up',
      sust_step2_d: 'Drop them off at our FPT Campus Pop-up booth.',
      sust_step3_t: '03. Get Instant Discount',
      sust_step3_d: 'Receive 30% off when purchasing larger refill pouches.',

      // FAQs
      faq_label: 'CUSTOMER FAQS',
      faq_title: 'Frequently Asked Questions',
      faq_q1: 'Does the product use industrial alcohol for disinfection?',
      faq_a1: 'Not at all. Re-Born utilizes natural d-Limonene active compounds from pomelo peel combined with botanical extracts to eliminate 99.9% of bacteria without drying skin or pungent odors.',
      faq_q2: 'How do students at FPT Campus receive their delivery?',
      faq_a2: 'Simply select "Pick up at FPT Campus" at checkout. Our founding team delivers directly to your building lobby with completely free shipping during break hours.',
      faq_q3: 'What is the shelf life of the artisanal hand wash?',
      faq_a3: 'Being distilled naturally and preserved with pure essential oils, optimal shelf life is 6 to 8 months after opening.',
      faq_q4: 'What is the guarantee and return policy for sensitive skin?',
      faq_a4: 'Re-Born offers a <strong>14-day gentle-care guarantee</strong>: free 1-to-1 replacement if any skin irritation occurs, along with personal 1-on-1 care from our founders.',

      // Footer
      footer_about_desc: 'Hand wash crafted from upcycled organic pomelo peels, gentle antibacterial care for skin and planet.',
      footer_products_col: 'Products',
      footer_brand_col: 'About Re-Born',
      footer_newsletter_title: 'Get -15% Discount',
      footer_newsletter_desc: 'Subscribe to receive code <strong>REBORN15</strong> for your first order:',
      footer_newsletter_btn: 'Subscribe',
      footer_newsletter_note: 'Guaranteed privacy • Zero spam policy',
      footer_rights: '© 2026 RE-BORN • Pure Botanical Purity. All rights reserved.',

      // Cart Drawer
      cart_heading: 'Your Shopping Cart',
      cart_bag_note: '(Eco tote bag included)',
      cart_apply_btn: 'Apply',
      cart_discount_lbl: 'Voucher discount:',
      cart_subtotal_lbl: 'Subtotal:',
      cart_checkout_cta: 'Proceed to Checkout →',
      cart_payment_notice: '🔒 Cash on Delivery (COD) or VietQR Bank Transfer',
      cart_track_prompt: '📦 Already ordered? Track your shipment',

      // Checkout modal
      co_label: 'FAST 1-STEP CHECKOUT',
      co_title: 'Delivery Information',
      co_desc: 'No account required. Complete in 30 seconds to receive today\'s fresh batch.',
      co_name_lbl: 'Your Full Name',
      co_name_ph: 'e.g. John Doe / Nguyen Minh Anh',
      co_phone_lbl: 'Phone Number',
      co_phone_ph: 'e.g. 0988 123 456',
      co_addr_lbl: 'Delivery Address',
      co_addr_ph: 'e.g. Building lobby, room number or street address',
      co_pay_lbl: 'Payment Method',
      co_pay_cod: '💵 Cash on Delivery (COD)',
      co_pay_qr: '📱 VietQR 24/7 Bank Transfer',
      co_ship_fee_lbl: 'Shipping fee:',
      co_ship_fee_val: 'Free on Campus / Standard 15k',
      co_total_lbl: 'Total Payment:',
      co_btn_submit: 'Place Order Now ➔',

      // VietQR Modal
      qr_badge: '⚡ Cashless Payment • VietQR 24/7',
      qr_title: 'Scan VietQR to Pay',
      qr_sub: 'Open any banking app to scan and pay automatically',
      qr_btn_confirm: '✓ I have completed the transfer',
      qr_btn_cancel: 'I will pay later',

      // Search modal
      search_title: 'Search Products',
      search_ph: 'Type product name (hand wash 250ml, refill pouch, combo...)',

      // Tracking modal
      track_label: 'ORDER JOURNEY',
      track_title: 'Track Your Order Status',
      track_desc: 'Enter your phone number to check delivery progress and history.',
      track_ph: 'e.g. 0988 123 456',
      track_btn: 'Track Order',

      // Consult / Info Modal
      consult_team_badge: 'Re-Born Customer Care Team',
      consult_title: 'Product Consultation',
      consult_desc: 'Have questions about gentle formula, natural scent notes, or current campus offers? Our founders are here to help!',
      consult_fb_title: 'Chat via Facebook Fanpage',
      consult_fb_sub: 'Replies in 5 mins • 1:1 Care',
      consult_zalo_sub: 'Direct chat • Fast 24/7 support',
      consult_trust: 'Caring support • 100% Botanical • Completely free',

      // Quick view modal
      qv_ingr_title: '✦ Active Botanical Ingredients:',
      qv_ritual_title: '✦ Recommended Cleansing Ritual:',
      qv_add_btn: 'Add to Cart',

      // Dynamic strings & Toasts
      toast_lang_switched: 'Switched language to English',
      cart_empty_title: 'Your cart is empty',
      cart_empty_desc: 'Discover our fresh upcycled pomelo collection today.',
      toast_added_to_cart: 'Added to cart successfully!',
      toast_removed_item: 'Removed item from cart',
      free_ship_congrats: '🎉 <strong>Congrats!</strong> You have qualified for <strong>Free Nationwide Shipping</strong>.',
      free_ship_need_more: 'Add <strong>{val}₫</strong> more to get <strong>Free Shipping</strong>'
    }
  };

  function t(key) {
    const currentLang = state.lang || 'vi';
    if (i18n[currentLang] && i18n[currentLang][key]) {
      return i18n[currentLang][key];
    }
    if (i18n.vi && i18n.vi[key]) {
      return i18n.vi[key];
    }
    return key;
  }

  function getLocalizedText(prop) {
    if (!prop) return '';
    if (typeof prop === 'object') {
      return prop[state.lang] || prop.vi || '';
    }
    return prop;
  }

  function setLanguage(lang, notify = false) {
    if (lang !== 'vi' && lang !== 'en') lang = 'vi';
    state.lang = lang;
    try {
      localStorage.setItem('reborn_lang', lang);
    } catch (e) {}

    document.documentElement.lang = lang;

    // Toggle switcher active button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update all [data-i18n] elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const text = t(key);
      if (text && text !== key) {
        if (text.includes('<') && text.includes('>')) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update all [data-i18n-ph] elements
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      const ph = t(key);
      if (ph && ph !== key) {
        el.placeholder = ph;
      }
    });

    // Update all [data-i18n-title] elements
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      const title = t(key);
      if (title && title !== key) {
        el.title = title;
        if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', title);
      }
    });

    // Re-render cart with translated names
    renderCart();

    // If Quick View modal is currently open, refresh product details
    const qvModal = document.getElementById('quickViewModal');
    if (qvModal && qvModal.classList.contains('active') && typeof currentQvId !== 'undefined') {
      openQuickView(currentQvId);
    }

    if (notify) {
      showToast(t('toast_lang_switched'), lang === 'en' ? '🇬🇧' : '🇻🇳');
    }
  }

  // ==========================================================================
  // Header Sticky Effect & Mobile Menu
  // ==========================================================================
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavCloseBtn = document.getElementById('mobileNavCloseBtn');

  function openMobileNav() {
    mobileNavDrawer.classList.add('open');
    mobileNavOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNavDrawer.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileMenuToggle?.addEventListener('click', openMobileNav);
  mobileNavCloseBtn?.addEventListener('click', closeMobileNav);
  mobileNavOverlay?.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // ==========================================================================
  // Toast Notification System
  // ==========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = '✦') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // ==========================================================================
  // Modal Controller (Backdrop, Escape, Triggers)
  // ==========================================================================
  const allModals = document.querySelectorAll('.modal-overlay');

  function openModal(modalEl) {
    if (!modalEl) return;
    closeAllModals();
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    allModals.forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }

  allModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
        closeAllModals();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      closeCart();
      closeMobileNav();
    }
  });

  // ==========================================================================
  // Shopping Cart Drawer Management
  // ==========================================================================
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const shippingProgressText = document.getElementById('shippingProgressText');
  const shippingProgressBar = document.getElementById('shippingProgressBar');
  const promoInput = document.getElementById('promoInput');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const cartDiscountRow = document.getElementById('cartDiscountRow');
  const cartDiscountVal = document.getElementById('cartDiscountVal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutTotalVal = document.getElementById('checkoutTotalVal');

  function openCart() {
    cartDrawer.classList.add('open');
    cartDrawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('open');
    cartDrawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartOpenBtn?.addEventListener('click', openCart);
  cartCloseBtn?.addEventListener('click', closeCart);
  cartDrawerOverlay?.addEventListener('click', closeCart);

  function renderCart() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 48px 12px; color: var(--color-text-secondary);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🛒</div>
          <strong style="color: var(--color-text-main); font-size: 1.05rem; display: block; margin-bottom: 4px;">${t('cart_empty_title')}</strong>
          <p style="font-size: 0.88rem;">${t('cart_empty_desc')}</p>
        </div>
      `;
    } else {
      state.cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const pData = productData[item.id];
        const displayName = pData ? getLocalizedText(pData.name) : item.name;
        const displayVol = pData ? getLocalizedText(pData.volume) : item.volume;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.image}" alt="${displayName}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${displayName}</div>
            <div class="cart-item-volume">${displayVol}</div>
            <div class="cart-item-row">
              <div class="qty-control">
                <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Giảm">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Tăng">+</button>
              </div>
              <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('vi-VN')}₫</div>
            </div>
          </div>
        `;
        cartItemsList.appendChild(itemEl);
      });
    }

    if (cartBadge) cartBadge.textContent = totalItems;

    // Apply Discount calculation
    let finalTotal = total;
    if (state.discountRate > 0 && total > 0) {
      const discountAmount = Math.round(total * state.discountRate);
      finalTotal = total - discountAmount;
      if (cartDiscountRow) {
        cartDiscountRow.style.display = 'flex';
        cartDiscountVal.textContent = '-' + discountAmount.toLocaleString('vi-VN') + '₫';
      }
    } else {
      if (cartDiscountRow) cartDiscountRow.style.display = 'none';
    }

    if (cartSubtotal) {
      cartSubtotal.textContent = finalTotal.toLocaleString('vi-VN') + '₫';
    }
    if (checkoutTotalVal) {
      checkoutTotalVal.textContent = finalTotal.toLocaleString('vi-VN') + '₫';
    }

    // Free Shipping threshold
    if (shippingProgressText && shippingProgressBar) {
      if (total >= state.freeShippingThreshold) {
        shippingProgressText.innerHTML = t('free_ship_congrats');
        shippingProgressBar.style.width = '100%';
      } else {
        const remaining = state.freeShippingThreshold - total;
        const percent = Math.min(100, Math.round((total / state.freeShippingThreshold) * 100));
        shippingProgressText.innerHTML = t('free_ship_need_more').replace('{val}', remaining.toLocaleString('vi-VN'));
        shippingProgressBar.style.width = `${percent}%`;
      }
    }
  }

  // Handle Cart Quantity Changes (+ / -)
  cartItemsList?.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const item = state.cart.find(i => i.id === id);
    if (!item) return;

    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease') {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.cart = state.cart.filter(i => i.id !== id);
        showToast(`Đã bỏ ${item.name} khỏi giỏ hàng`, '🗑️');
      }
    }
    renderCart();
  });

  // Add Product to Cart Action
  function addToCart(productId) {
    const data = productData[productId];
    if (!data) return;

    const existing = state.cart.find(i => i.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: data.id,
        name: data.name,
        sub: data.sub,
        price: data.price,
        volume: data.volume,
        image: data.image,
        quantity: 1
      });
    }
    renderCart();
    showToast(`Đã thêm ${data.name} vào giỏ hàng!`, '🌿');
    openCart();
  }

  // Attach Add-to-cart to buttons on cards
  document.querySelectorAll('.btn-add-cart-quick').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      addToCart(id);
    });
  });

  // Promo Code Voucher Handler (FPTU, REBORN15, TIETKIEM20 - Thành viên 1)
  applyPromoBtn?.addEventListener('click', async () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) {
      promoInput.classList.add('input-error');
      showToast('Vui lòng nhập mã ưu đãi (Ví dụ: REBORN15 hoặc FPTU)', '⚠️');
      return;
    }

    const currentSubtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 1. Thử gọi API Serverless /api/vouchers/verify
    try {
      const res = await fetch('/api/vouchers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: currentSubtotal })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        state.discountRate = data.voucher.discountPercent / 100;
        state.appliedPromoCode = code;
        promoInput.classList.remove('input-error');
        showToast(data.message, '🎉');
        renderCart();
        return;
      }
    } catch (e) {
      // Fallback cục bộ nếu chạy offline
    }

    // 2. Fallback logic client
    if (code === 'REBORN15' || code === 'FPTU' || code === 'CAFE15' || code === 'STARTUP') {
      state.discountRate = 0.15;
      state.appliedPromoCode = code;
      promoInput.classList.remove('input-error');
      showToast(`Áp dụng thành công mã ${code}! Giảm 15% đơn hàng.`, '🎉');
      renderCart();
    } else if (code === 'THANKYOU20' || code === 'TIETKIEM20') {
      state.discountRate = 0.20;
      state.appliedPromoCode = code;
      promoInput.classList.remove('input-error');
      showToast(`Áp dụng thành công mã ưu đãi! Giảm 20% đơn hàng.`, '🎁');
      renderCart();
    } else {
      promoInput.classList.add('input-error');
      showToast('Mã giảm giá không tồn tại hoặc đã hết hạn!', '❌');
    }
  });

  // ==========================================================================
  // Fast 1-Step Checkout Flow
  // ==========================================================================
  function openCheckout() {
    if (state.cart.length === 0) {
      showToast('Giỏ hàng chưa có sản phẩm. Hãy chọn 1 sản phẩm trước!', '⚠️');
      return;
    }
    closeCart();
    closeMobileNav();
    openModal(checkoutModal);
  }

  checkoutBtn?.addEventListener('click', openCheckout);
  document.getElementById('headerFastOrderBtn')?.addEventListener('click', openCheckout);
  document.getElementById('mobileFastOrderBtn')?.addEventListener('click', openCheckout);

  const checkoutForm = document.getElementById('checkoutForm');
  const orderName = document.getElementById('orderName');
  const orderPhone = document.getElementById('orderPhone');
  const orderAddress = document.getElementById('orderAddress');
  const groupOrderName = document.getElementById('groupOrderName');
  const groupOrderPhone = document.getElementById('groupOrderPhone');
  const groupOrderAddress = document.getElementById('groupOrderAddress');
  const errOrderPhone = document.getElementById('errOrderPhone');

  // Phone Validation Regex for Vietnam
  const vnPhoneRegex = /(03|05|07|08|09)+([0-9]{8})\b/;

  checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!orderName.value.trim()) {
      groupOrderName.classList.add('has-error');
      isValid = false;
    } else {
      groupOrderName.classList.remove('has-error');
    }

    // Validate Phone
    const cleanPhone = orderPhone.value.replace(/\s+/g, '');
    if (!vnPhoneRegex.test(cleanPhone)) {
      groupOrderPhone.classList.add('has-error');
      isValid = false;
    } else {
      groupOrderPhone.classList.remove('has-error');
    }

    // Validate Address
    if (!orderAddress.value.trim()) {
      groupOrderAddress.classList.add('has-error');
      isValid = false;
    } else {
      groupOrderAddress.classList.remove('has-error');
    }

    if (!isValid) return;

    // Simulate instant order confirmation
    const btnSubmit = document.getElementById('btnSubmitOrder');
    btnSubmit.classList.add('is-loading');

    setTimeout(() => {
      btnSubmit.classList.remove('is-loading');
      const randomCode = 'RB-' + Math.floor(100000 + Math.random() * 900000);
      const paymentRadio = checkoutForm.querySelector('input[name="paymentMethod"]:checked');
      const isQr = paymentRadio?.value === 'qr';
      const orderTotalStr = checkoutTotalVal ? checkoutTotalVal.textContent : '45.000₫';
      const rawAmount = parseInt(orderTotalStr.replace(/\D/g, '')) || 45000;
      const customerName = orderName.value;

      closeAllModals();

      // Save order to localStorage for Admin Dashboard
      try {
        const existingOrders = JSON.parse(localStorage.getItem('reborn_orders') || '[]');
        existingOrders.unshift({
          code: randomCode,
          name: customerName,
          phone: orderPhone.value,
          address: orderAddress.value,
          payment: isQr ? 'Quét VietQR' : 'COD (Tiền mặt)',
          total: orderTotalStr,
          status: isQr ? 'Chờ thanh toán QR' : 'Chờ xác nhận'
        });
        localStorage.setItem('reborn_orders', JSON.stringify(existingOrders));
      } catch (err) {
        console.error('LocalStorage error:', err);
      }

      // Gửi đơn hàng lên Backend Serverless API /api/orders (Thành viên 1)
      const orderPayload = {
        customerName: customerName,
        phone: cleanPhone,
        address: orderAddress.value.trim(),
        items: state.cart,
        voucherCode: state.appliedPromoCode,
        paymentMethod: isQr ? 'VIETQR' : 'COD'
      };

      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.order) {
          console.log('✅ Đơn hàng đã đồng bộ vào CSDL:', data.order.id);
        }
      })
      .catch(err => {
        console.warn('Backend API offline, chạy chế độ offline local:', err);
      });

      // Reset cart
      state.cart = [];
      state.discountRate = 0;
      if (promoInput) promoInput.value = '';
      renderCart();

      if (isQr) {
        // Open VietQR Cashless Modal
        const vietqrModal = document.getElementById('vietqrModal');
        const vietqrImg = document.getElementById('vietqrImg');
        const vietqrAmountVal = document.getElementById('vietqrAmountVal');
        const vietqrContentVal = document.getElementById('vietqrContentVal');
        const transferContent = `REBORN ${randomCode.replace('-', '')}`;

        if (vietqrAmountVal) vietqrAmountVal.textContent = orderTotalStr;
        if (vietqrContentVal) vietqrContentVal.textContent = transferContent;

        // Dynamic VietQR API URL with local fallback
        if (vietqrImg) {
          const dynamicQrUrl = `https://img.vietqr.io/image/mbbank-0988123456-compact2.png?amount=${rawAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=RE%20BORN%20NATURAL`;
          vietqrImg.src = dynamicQrUrl;
          vietqrImg.onerror = () => {
            vietqrImg.src = 'assets/images/vietqr_sample.png';
          };
        }

        // Copy buttons helper
        const copyHandler = (text, btn) => {
          if (!btn) return;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(() => {});
          }
          const orig = btn.textContent;
          btn.textContent = 'Đã chép ✓';
          btn.style.background = 'var(--color-primary)';
          btn.style.color = '#ffffff';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 1500);
        };

        const btnCopyAcc = document.getElementById('vietqrCopyAccBtn');
        if (btnCopyAcc) btnCopyAcc.onclick = function() { copyHandler('0988123456', this); };

        const btnCopyAmount = document.getElementById('vietqrCopyAmountBtn');
        if (btnCopyAmount) btnCopyAmount.onclick = function() { copyHandler(rawAmount.toString(), this); };

        const btnCopyContent = document.getElementById('vietqrCopyContentBtn');
        if (btnCopyContent) btnCopyContent.onclick = function() { copyHandler(transferContent, this); };

        // Confirm Paid Action
        const btnConfirmPaid = document.getElementById('btnConfirmVietqrPaid');
        if (btnConfirmPaid) {
          btnConfirmPaid.onclick = () => {
            try {
              const orders = JSON.parse(localStorage.getItem('reborn_orders') || '[]');
              const target = orders.find(o => o.code === randomCode);
              if (target) {
                target.status = 'Đã thanh toán (VietQR)';
                localStorage.setItem('reborn_orders', JSON.stringify(orders));
              }
            } catch (e) {}

            closeAllModals();
            showToast(`🎉 Xác nhận chuyển khoản thành công đơn #${randomCode}!`, '💚');
            setTimeout(() => {
              showToast(`Cảm ơn ${customerName}! Đội ngũ Re-Born đang chuẩn bị đơn mẻ tươi.`, '📦');
            }, 1200);
          };
        }

        // Cancel / Pay later
        const btnCancel = document.getElementById('btnCancelVietqr');
        if (btnCancel) {
          btnCancel.onclick = () => {
            closeAllModals();
            showToast(`Đơn hàng #${randomCode} đã lưu. Re-Born sẽ liên hệ giao hàng tận nơi.`, 'ℹ️');
          };
        }

        // 15-Minute Countdown Timer
        let secondsLeft = 15 * 60;
        const timerEl = document.getElementById('vietqrTimer');
        if (timerEl) timerEl.textContent = '15:00';
        if (window.vietqrInterval) clearInterval(window.vietqrInterval);
        window.vietqrInterval = setInterval(() => {
          secondsLeft--;
          if (secondsLeft <= 0) {
            clearInterval(window.vietqrInterval);
            if (timerEl) timerEl.textContent = '00:00 (Hết hạn)';
          } else {
            const m = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
            const s = (secondsLeft % 60).toString().padStart(2, '0');
            if (timerEl) timerEl.textContent = `${m}:${s}`;
          }
        }, 1000);

        openModal(vietqrModal);
        showToast(`Mã đơn #${randomCode}: Mời quét mã VietQR để hoàn tất.`, '📱');

      } else {
        // Standard COD flow
        showToast(`🎉 Đặt hàng thành công! Mã đơn: ${randomCode}`, '📦');
        setTimeout(() => {
          showToast(`Cảm ơn ${customerName}! Đội ngũ Re-Born sẽ liên hệ giao hàng sớm nhất.`, '💚');
        }, 1200);
      }
    }, 600);
  });

  // ==========================================================================
  // Tra Cứu Đơn Hàng (Order Tracking - Thành viên 1)
  // ==========================================================================
  const orderTrackingModal = document.getElementById('orderTrackingModal');
  const trackPhoneInput = document.getElementById('trackPhoneInput');
  const btnTrackOrder = document.getElementById('btnTrackOrder');
  const trackOrderResults = document.getElementById('trackOrderResults');

  document.querySelectorAll('.open-tracking-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      openModal(orderTrackingModal);
      setTimeout(() => trackPhoneInput?.focus(), 150);
    });
  });

  btnTrackOrder?.addEventListener('click', async () => {
    const rawPhone = trackPhoneInput ? trackPhoneInput.value : '';
    const cleanPhone = rawPhone.replace(/\s+/g, '');
    if (!cleanPhone) {
      showToast('Vui lòng nhập số điện thoại cần tra cứu!', '⚠️');
      return;
    }

    if (trackOrderResults) {
      trackOrderResults.innerHTML = '<p style="text-align:center; color: var(--color-text-secondary); padding: 15px;">Đang tra cứu dữ liệu...</p>';
    }

    try {
      let orders = [];
      // 1. Thử gọi API Serverless
      try {
        const res = await fetch(`/api/orders/track?phone=${cleanPhone}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.orders && data.orders.length > 0) {
            orders = data.orders;
          }
        }
      } catch (e) {
        // Fallback local
      }

      // 2. Fallback sang localStorage nếu API rỗng
      if (orders.length === 0) {
        const local = JSON.parse(localStorage.getItem('reborn_orders') || '[]');
        orders = local.filter(o => (o.phone || '').replace(/\s+/g, '') === cleanPhone);
      }

      if (orders.length === 0) {
        trackOrderResults.innerHTML = `
          <div style="text-align: center; padding: 24px 12px; background: var(--color-surface-container-low); border-radius: var(--radius-lg);">
            <p style="font-weight: 700; color: var(--color-text-main); margin-bottom: 4px;">Chưa tìm thấy đơn hàng</p>
            <p style="font-size: 0.84rem; color: var(--color-text-secondary);">Số điện thoại ${cleanPhone} chưa có đơn hàng nào tại Re-Born.</p>
          </div>
        `;
        return;
      }

      // 3. Render kết quả
      trackOrderResults.innerHTML = orders.map(ord => {
        const totalDisplay = typeof ord.finalTotal === 'number'
          ? ord.finalTotal.toLocaleString('vi-VN') + '₫'
          : (ord.total || '45.000₫');
        const statusDisplay = ord.orderStatus === 'NEW'
          ? 'Đang đóng gói mẻ tươi'
          : (ord.status || 'Chờ xác nhận');
        return `
          <div style="border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 10px; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 700; color: var(--color-primary-dark); font-size: 0.95rem;">${ord.id || ord.code}</span>
              <span style="font-size: 0.75rem; padding: 3px 10px; border-radius: 50px; background: #e8f5e9; color: #2e7d32; font-weight: 600;">
                ${statusDisplay}
              </span>
            </div>
            <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 4px;">
              📍 Nơi nhận: <strong>${ord.address}</strong>
            </p>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-top: 1px dashed var(--color-border); padding-top: 6px; margin-top: 6px;">
              <span>Thanh toán: ${ord.paymentMethod || ord.payment}</span>
              <strong style="color: var(--color-primary);">${totalDisplay}</strong>
            </div>
          </div>
        `;
      }).join('');

    } catch (err) {
      console.error(err);
      if (trackOrderResults) {
        trackOrderResults.innerHTML = '<p style="color: red; text-align: center; padding: 10px;">Lỗi kết nối tra cứu.</p>';
      }
    }
  });

  // ==========================================================================
  // Quick View / Ritual Details Modal
  // ==========================================================================
  const quickViewModal = document.getElementById('quickViewModal');
  const qvImage = document.getElementById('qvImage');
  const qvNotes = document.getElementById('qvNotes');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');
  const qvDesc = document.getElementById('qvDesc');
  const qvIngredients = document.getElementById('qvIngredients');
  const qvRitual = document.getElementById('qvRitual');
  const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');
  let currentQvId = 'pomelo-handwash';

  function openQuickView(id) {
    const data = productData[id];
    if (!data) return;
    currentQvId = id;
    qvImage.src = data.image;
    qvNotes.textContent = getLocalizedText(data.sub);
    qvTitle.textContent = getLocalizedText(data.name);
    qvPrice.textContent = data.price.toLocaleString('vi-VN') + '₫';
    qvDesc.textContent = getLocalizedText(data.desc);
    qvIngredients.textContent = getLocalizedText(data.ingredients);
    qvRitual.textContent = getLocalizedText(data.ritual);
    openModal(quickViewModal);
  }

  document.querySelectorAll('.link-explore-ritual').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openQuickView(id);
    });
  });

  document.getElementById('heroQuickRitualBtn')?.addEventListener('click', () => {
    openQuickView('pomelo-handwash');
  });

  qvAddToCartBtn?.addEventListener('click', () => {
    addToCart(currentQvId);
    closeAllModals();
  });

  // ==========================================================================
  // Search Modal
  // ==========================================================================
  const searchBtn = document.getElementById('searchBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  searchBtn?.addEventListener('click', () => {
    openModal(searchModal);
    setTimeout(() => searchInput?.focus(), 150);
  });

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!searchResults) return;
    searchResults.innerHTML = '';
    if (!query) return;

    const matches = Object.values(productData).filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.sub.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `<p style="font-size: 0.88rem; color: var(--color-text-secondary); padding: 8px 0;">Không tìm thấy sản phẩm phù hợp.</p>`;
    } else {
      matches.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; background: var(--color-bg-sage-light); border-radius: var(--radius-sm); border: 1px solid var(--color-border); cursor: pointer;';
        itemRow.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${item.image}" style="width: 36px; height: 36px; border-radius: 4px; object-fit: cover;">
            <div>
              <strong style="font-size: 0.9rem; color: var(--color-text-main); display: block;">${item.name}</strong>
              <span style="font-size: 0.78rem; color: var(--color-primary); font-weight: 600;">${item.price.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
          <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.8rem;">Xem</button>
        `;
        itemRow.addEventListener('click', () => {
          closeAllModals();
          openQuickView(item.id);
        });
        searchResults.appendChild(itemRow);
      });
    }
  });

  // ==========================================================================
  // Feedback Loop Form (BMC Touchpoint R&D)
  // ==========================================================================
  const feedbackForm = document.getElementById('feedbackForm');
  feedbackForm?.addEventListener('click', (e) => {
    const btn = e.target.closest('.survey-pill-btn');
    if (!btn) return;
    const group = btn.closest('.survey-pill-group');
    group.querySelectorAll('.survey-pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  feedbackForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const activePills = feedbackForm.querySelectorAll('.survey-pill-btn.active');
    const scentVal = activePills[0]?.dataset.val || 'Rất thanh mát, tự nhiên';
    const skinVal = activePills[1]?.dataset.val || 'Mềm ẩm, không khô ráp';
    const priceVal = activePills[2]?.dataset.val || 'Rất hợp lý (45k)';
    const fbContact = document.getElementById('fbContactInput')?.value.trim() || 'Khách chưa để lại link';

    try {
      const existingFeedbacks = JSON.parse(localStorage.getItem('reborn_feedbacks') || '[]');
      existingFeedbacks.unshift({
        time: 'Vừa xong',
        scent: scentVal,
        skin: skinVal,
        price: priceVal,
        fb: fbContact,
        status: 'Chờ gửi qua FB (THANKYOU20)'
      });
      localStorage.setItem('reborn_feedbacks', JSON.stringify(existingFeedbacks));
    } catch (err) {
      console.error(err);
    }

    // Build synthesized feedback content to paste into Facebook chat
    const feedbackSummary = `[GÓP Ý CẢM NHẬN RE-BORN]\n• Mùi hương: ${scentVal}\n• Cảm giác da: ${skinVal}\n• Mức giá sinh viên: ${priceVal}\n• Facebook khách: ${fbContact}\n👉 Gửi nhóm R&D Re-Born để nhận Voucher giảm 20%!`;

    // Copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(feedbackSummary).catch(() => {});
    }

    // Show on-page notice box
    const noticeBox = document.getElementById('feedbackFbNoticeBox');
    if (noticeBox) {
      noticeBox.style.display = 'block';
    }

    // Open Facebook Fanpage
    window.open('https://www.facebook.com', '_blank');

    showToast('Đã sao chép phản hồi! Vui lòng gửi tin nhắn trên Facebook để nhận Voucher 20% nhé!', '💬');
  });

  // ==========================================================================
  // B2B Lead Form (BMC Partners: Cafe, Tea shop, Homestay, Eco Hotel, Write-in)
  // ==========================================================================
  const b2bLeadForm = document.getElementById('b2bLeadForm');
  const b2bBizTypeSelect = document.getElementById('b2bBizType');
  const b2bBizTypeOtherWrap = document.getElementById('b2bBizTypeOtherWrap');
  const b2bBizTypeOtherInput = document.getElementById('b2bBizTypeOther');

  b2bBizTypeSelect?.addEventListener('change', () => {
    if (b2bBizTypeSelect.value === 'Khác') {
      if (b2bBizTypeOtherWrap) b2bBizTypeOtherWrap.style.display = 'block';
      if (b2bBizTypeOtherInput) {
        b2bBizTypeOtherInput.required = true;
        b2bBizTypeOtherInput.focus();
      }
    } else {
      if (b2bBizTypeOtherWrap) b2bBizTypeOtherWrap.style.display = 'none';
      if (b2bBizTypeOtherInput) {
        b2bBizTypeOtherInput.required = false;
        b2bBizTypeOtherInput.value = '';
      }
    }
  });

  b2bLeadForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const store = document.getElementById('b2bStoreName').value;
    const phone = document.getElementById('b2bPhone').value;
    let bizType = b2bBizTypeSelect?.value || 'Quán Cà phê';
    if (bizType === 'Khác') {
      const customType = b2bBizTypeOtherInput?.value.trim();
      bizType = customType ? customType : 'Cơ sở Doanh nghiệp';
    }
    const needType = document.getElementById('b2bNeedType')?.value || 'Dùng thử chai 500ml (Miễn phí)';
    const address = document.getElementById('b2bAddress')?.value || '';

    const isTrial = needType.includes('500ml');

    try {
      const existingB2b = JSON.parse(localStorage.getItem('reborn_b2b_leads') || '[]');
      existingB2b.unshift({
        store: store,
        bizType: bizType,
        phone: phone,
        type: isTrial ? 'Dùng thử 500ml' : (needType.includes('3L') ? 'Can sỉ 3L' : (needType.includes('5L') ? 'Can sỉ 5L' : (needType.includes('Combo') ? 'Combo Lavabo' : 'Tư vấn Refill'))),
        date: 'Hôm nay',
        status: isTrial ? 'Chờ gửi mẫu 500ml' : 'Báo giá can sỉ',
        note: `[${bizType}] ${needType}` + (address ? ` • Đ/C: ${address}` : '')
      });
      localStorage.setItem('reborn_b2b_leads', JSON.stringify(existingB2b));
    } catch (err) {
      console.error(err);
    }

    if (isTrial) {
      showToast(`Đã nhận đăng ký từ ${store} (${bizType})! Re-Born sẽ liên hệ qua SĐT ${phone} để gửi Chai mẫu 500ml (0đ) tận nơi trong 24h.`, '🎁');
    } else {
      showToast(`Đã nhận thông tin từ ${store} (${bizType})! Đội ngũ B2B Re-Born sẽ liên hệ qua SĐT ${phone} để gửi báo giá chiết khấu Can sỉ 3L - 5L & bình sứ để bàn.`, '🤝');
    }
    b2bLeadForm.reset();
    if (b2bBizTypeOtherWrap) b2bBizTypeOtherWrap.style.display = 'none';
    if (b2bBizTypeOtherInput) b2bBizTypeOtherInput.required = false;
  });

  // ==========================================================================
  // Newsletter Form
  // ==========================================================================
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (input.value) {
      showToast('Đăng ký nhận bản tin mùa vụ thành công!', '💌');
      input.value = '';
    }
  });

  // ==========================================================================
  // Floating Contact Widget
  // ==========================================================================
  const infoModal = document.getElementById('infoModal');
  document.getElementById('floatingContactBtn')?.addEventListener('click', () => {
    openModal(infoModal);
  });

  // ==========================================================================
  // Scent Pyramid Interaction
  // ==========================================================================
  document.querySelectorAll('.scent-tier').forEach(tier => {
    tier.addEventListener('click', () => {
      document.querySelectorAll('.scent-tier').forEach(t => t.classList.remove('active'));
      tier.classList.add('active');
    });
  });

  // ==========================================================================
  // FAQ Accordion
  // ==========================================================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
      });
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ==========================================================================
  // Language Switcher Event Listeners & Initialization
  // ==========================================================================
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const chosenLang = btn.dataset.lang;
      if (chosenLang && chosenLang !== state.lang) {
        setLanguage(chosenLang, true);
      }
    });
  });

  // Initialize Language (Load saved preference or default to Vietnamese)
  setLanguage(state.lang, false);
});
