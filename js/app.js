/**
 * RE-BORN • Nước Rửa Tay Vỏ Bưởi - Sạch Khuẩn Từ Tự Nhiên
 * Standardized Interactive Core Logic & MVP Touchpoints
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // Global State
  // ==========================================================================
  const state = {
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

  // Product Database Dictionary
  const productData = {
    'pomelo-handwash': {
      id: 'pomelo-handwash',
      name: 'Nước rửa tay vỏ bưởi',
      sub: 'VỎ BƯỞI ÉP LẠNH • TUYẾT TÙNG • THẢO MỘC',
      price: 45000,
      volume: '250 ml • Chai rPET vòi nhấn',
      image: 'assets/images/product_handwash.jpg',
      desc: 'Công thức làm sạch dịu lành kết hợp tinh dầu vỏ bưởi ép chậm và thảo mộc tự nhiên. Đánh bay 99.9% vi khuẩn, nuôi dưỡng màng ẩm da tay và để lại hương cam chanh thanh tĩnh.',
      ingredients: 'Chiết xuất tinh dầu vỏ bưởi Citrus Maxima ép lạnh, Glycerin thực vật hữu cơ, Decyl Glucoside (gốc dừa lành tính), Nước khoáng tinh khiết, Tinh dầu tuyết tùng.',
      ritual: 'Bơm một lượng vừa đủ (1 lần nhấn), tạo bọt nhẹ nhàng khắp bàn tay trong 30 giây để hương thơm tự nhiên lan tỏa trọn vẹn, sau đó xả sạch với nước.'
    },
    'pomelo-refill': {
      id: 'pomelo-refill',
      name: 'Túi Refill Nước rửa tay 500ml',
      sub: 'VỎ BƯỞI ÉP LẠNH • TIẾT KIỆM RÁC NHỰA',
      price: 75000,
      volume: '500 ml • Túi sinh thái tiết kiệm',
      image: 'assets/images/product_refill.jpg',
      desc: 'Dung tích nhân đôi 500ml tiện lợi rót đầy lại 2 chai vòi nhấn cũ. Tiết kiệm 15.000₫ và cắt giảm 80% rác thải nhựa so với việc mua chai mới.',
      ingredients: 'Chiết xuất vỏ bưởi hữu cơ tái sinh, Glycerin thực vật màng ẩm, Decyl Glucoside gốc dừa, Nước khoáng tinh khiết, Tinh dầu thảo mộc dưỡng da.',
      ritual: 'Mở nắp vặn túi refill, rót chậm rãi vào chai nước rửa tay 250ml Re-Born có sẵn. Vặn chặt nắp chai và tái sử dụng vỏ túi cho lần thu gom kế tiếp.'
    },
    'eco-giftset': {
      id: 'eco-giftset',
      name: 'Combo Đôi • Nước rửa tay & Túi vải',
      sub: '2 CHAI RỬA TAY 250ML + TÚI VẢI CANVAS',
      price: 89000,
      volume: 'Set 3 món (2 Chai rửa tay + 1 Túi vải)',
      image: 'assets/images/hero_product.jpg',
      desc: 'Combo ưu đãi mua chung 2 chai nước rửa tay vỏ bưởi tặng kèm túi vải dệt thô Canvas Re-Born. Tiết kiệm chi phí ship và cùng bạn bè lan tỏa lối sống xanh.',
      ingredients: 'Bao gồm: 2 Chai Nước rửa tay vỏ bưởi 250ml có vòi nhấn + 1 Túi vải Canvas thời trang.',
      ritual: 'Đặt 1 chai tại bồn rửa tay ký túc xá/văn phòng và chia sẻ chai còn lại cùng bạn bè hoặc người thân.'
    }
  };

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
          <strong style="color: var(--color-text-main); font-size: 1.05rem; display: block; margin-bottom: 4px;">Giỏ hàng của bạn đang trống</strong>
          <p style="font-size: 0.88rem;">Khám phá các sản phẩm bưởi tái chế mẻ tươi hôm nay để bắt đầu nghi thức.</p>
        </div>
      `;
    } else {
      state.cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-volume">${item.volume}</div>
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
        shippingProgressText.innerHTML = `🎉 <strong>Chúc mừng!</strong> Bạn đã đủ điều kiện <strong>Miễn phí vận chuyển toàn quốc</strong>.`;
        shippingProgressBar.style.width = '100%';
      } else {
        const remaining = state.freeShippingThreshold - total;
        const percent = Math.min(100, Math.round((total / state.freeShippingThreshold) * 100));
        shippingProgressText.innerHTML = `Mua thêm <strong>${remaining.toLocaleString('vi-VN')}₫</strong> để được <strong>Miễn phí giao hàng</strong>`;
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

  // Promo Code Voucher Handler (FPTU, REBORN15, CAFE15, THANKYOU20)
  applyPromoBtn?.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) {
      promoInput.classList.add('input-error');
      showToast('Vui lòng nhập mã ưu đãi (Ví dụ: REBORN15 hoặc FPTU)', '⚠️');
      return;
    }

    if (code === 'REBORN15' || code === 'FPTU' || code === 'CAFE15' || code === 'STARTUP') {
      state.discountRate = 0.15;
      state.appliedPromoCode = code;
      promoInput.classList.remove('input-error');
      showToast(`Áp dụng thành công mã ${code}! Giảm 15% đơn hàng.`, '🎉');
      renderCart();
    } else if (code === 'THANKYOU20') {
      state.discountRate = 0.20;
      state.appliedPromoCode = code;
      promoInput.classList.remove('input-error');
      showToast(`Áp dụng thành công mã cảm ơn! Giảm 20% đơn hàng.`, '🎁');
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
    qvNotes.textContent = data.sub;
    qvTitle.textContent = data.name;
    qvPrice.textContent = data.price.toLocaleString('vi-VN') + '₫';
    qvDesc.textContent = data.desc;
    qvIngredients.textContent = data.ingredients;
    qvRitual.textContent = data.ritual;
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

  // Initial cart render
  renderCart();
});
