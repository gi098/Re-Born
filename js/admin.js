/**
 * RE-BORN • Admin Dashboard Interactive Logic
 * Fully synchronized with Storefront orders and BMC touchpoints
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sample Initial Data if localStorage is empty
  const defaultOrders = [
    {
      code: 'RB-202688',
      name: 'Nguyễn Minh Anh',
      phone: '0988 123 456',
      address: 'Sảnh Tòa Beta, Campus FPT Hà Nội',
      payment: 'COD (Tiền mặt)',
      total: '45.000₫',
      status: 'Đã giao'
    },
    {
      code: 'RB-202692',
      name: 'Trần Hoàng Long',
      phone: '0912 345 678',
      address: 'Phòng 402 KTX Dom E, Campus FPT',
      payment: 'Quét VietQR',
      total: '99.000₫',
      status: 'Chờ xác nhận'
    },
    {
      code: 'RB-202715',
      name: 'Lê Thu Trang',
      phone: '0977 888 999',
      address: 'Quán Cafe The Green Leaf, Cầu Giấy',
      payment: 'COD (Tiền mặt)',
      total: '65.000₫',
      status: 'Đang giao'
    }
  ];

  const defaultFeedbacks = [
    { time: 'Hôm nay 08:30', scent: 'Rất thanh mát, tự nhiên', skin: 'Mềm ẩm, không khô ráp', price: 'Rất hợp lý (45k)', fb: 'fb.com/minhanh.fpt', status: 'Đã gửi qua FB' },
    { time: 'Hôm nay 08:15', scent: 'Rất thanh mát, tự nhiên', skin: 'Mềm ẩm, không khô ráp', price: 'Rất hợp lý (45k)', fb: 'Trần Hoàng Nam', status: 'Đã gửi qua FB' },
    { time: 'Hôm qua 16:45', scent: 'Vừa phải', skin: 'Mềm da', price: 'Chấp nhận được', fb: 'fb.com/ngoc.tram.ecolife', status: 'Chờ duyệt FB' }
  ];

  const defaultB2b = [
    { store: 'The Alley Cafe Campus', bizType: 'Quán Cà phê / Tiệm Trà', phone: '0903 111 222', type: 'Can sỉ 5L', date: '21/10/2026', status: 'Báo giá can sỉ', note: 'Đặt can 5L Refill quầy lavabo • Đ/C: Tòa Alpha FPT' },
    { store: 'Góc Trà Xanh Homestay Eco', bizType: 'Homestay / Khách sạn Eco', phone: '0984 555 666', type: 'Dùng thử 500ml', date: '20/10/2026', status: 'Chờ gửi mẫu 500ml', note: 'Chai mẫu 500ml đặt quầy vệ sinh • Đ/C: Thạch Hòa, Thạch Thất' },
    { store: 'Tiệm Trà Mùa Hè & Bánh', bizType: 'Quán Cà phê / Tiệm Trà', phone: '0912 333 444', type: 'Combo Tiết Kiệm', date: '20/10/2026', status: 'Tư vấn giải pháp', note: 'Cần combo chai 250ml + túi refill 500ml • Đ/C: KTX Dom D FPT' }
  ];

  // Get data from localStorage or fallback
  let orders = JSON.parse(localStorage.getItem('reborn_orders') || 'null') || defaultOrders;
  
  // Auto-clean test orders (e.g. RB-425310 or "phan")
  const initialCount = orders.length;
  orders = orders.filter(o => o.code !== 'RB-425310' && !(o.name && o.name.toLowerCase() === 'phan'));
  if (orders.length !== initialCount) {
    localStorage.setItem('reborn_orders', JSON.stringify(orders));
  }

  let feedbacks = JSON.parse(localStorage.getItem('reborn_feedbacks') || 'null') || defaultFeedbacks;
  let b2bLeads = JSON.parse(localStorage.getItem('reborn_b2b_leads') || 'null') || defaultB2b;

  // Render Stats
  function updateStats() {
    const statOrdersCount = document.getElementById('statOrdersCount');
    const statFeedbackCount = document.getElementById('statFeedbackCount');
    const statB2bCount = document.getElementById('statB2bCount');

    if (statOrdersCount) statOrdersCount.textContent = orders.length;
    if (statFeedbackCount) statFeedbackCount.textContent = feedbacks.length;
    if (statB2bCount) statB2bCount.textContent = b2bLeads.length;
  }

  // Render Orders Table
  function renderOrders(list) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach((order, index) => {
      const tr = document.createElement('tr');
      const isConfirmed = order.status === 'Đã giao' || order.status === 'Đang giao';
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--color-primary-dark); font-family: monospace;">#${order.code}</td>
        <td style="font-weight: 600; color: var(--color-text-main);">${order.name}</td>
        <td>${order.phone}</td>
        <td>${order.address}</td>
        <td><span style="font-size: 0.8rem; background: var(--color-bg-sage); padding: 2px 6px; border-radius: 4px;">${order.payment}</span></td>
        <td style="font-weight: 700; color: var(--color-primary);">${order.total}</td>
        <td>
          <span class="badge-status ${isConfirmed ? 'confirmed' : 'pending'}">
            ${isConfirmed ? '✓' : '●'} ${order.status}
          </span>
        </td>
        <td style="white-space: nowrap;">
          <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.78rem;" onclick="toggleOrderStatus(${index})" title="Đổi trạng thái đơn">
            Đổi trạng thái
          </button>
          <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.78rem; color: #dc2626; border-color: #fca5a5; margin-left: 4px;" onclick="deleteOrder(${index})" title="Xóa đơn hàng này">
            ✕ Xóa
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Global toggle order status
  window.toggleOrderStatus = function(idx) {
    if (orders[idx]) {
      orders[idx].status = orders[idx].status === 'Chờ xác nhận' ? 'Đã giao' : 'Chờ xác nhận';
      localStorage.setItem('reborn_orders', JSON.stringify(orders));
      renderOrders(orders);
    }
  };

  // Global delete single order
  window.deleteOrder = function(idx) {
    if (orders[idx]) {
      const order = orders[idx];
      if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${order.code} (${order.name}) không?`)) {
        orders.splice(idx, 1);
        localStorage.setItem('reborn_orders', JSON.stringify(orders));
        renderOrders(orders);
        updateStats();
      }
    }
  };

  // Render Products Table
  function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    const products = [
      { img: 'assets/images/product_handwash.jpg', name: 'Nước rửa tay vỏ bưởi', vol: '250 ml', price: '45.000₫', origin: '55.000₫', stock: 'Còn 45 chai' },
      { img: 'assets/images/product_refill.jpg', name: 'Túi Refill Tiết Kiệm Nước Rửa Tay', vol: '500 ml', price: '75.000₫', origin: '90.000₫', stock: 'Còn 40 túi' },
      { img: 'assets/images/hero_product.jpg', name: 'Combo Đôi (2 Nước rửa tay + Túi vải)', vol: 'Combo 2 chai', price: '89.000₫', origin: '110.000₫', stock: 'Còn 20 set' }
    ];

    tbody.innerHTML = '';
    products.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.img}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid var(--color-border);"></td>
        <td style="font-weight: 600; color: var(--color-text-main);">${p.name}</td>
        <td>${p.vol}</td>
        <td style="font-weight: 700; color: var(--color-primary);">${p.price}</td>
        <td style="text-decoration: line-through; color: var(--color-text-light);">${p.origin}</td>
        <td><span style="color: var(--color-primary); font-weight: 600;">✓ ${p.stock}</span></td>
        <td>
          <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.78rem;" onclick="alert('Tính năng cập nhật giá đang khóa ở bản MVP!')">Sửa</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render Feedback Table
  function renderFeedback() {
    const tbody = document.getElementById('feedbackTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    feedbacks.forEach(f => {
      const fbContact = f.fb || f.fbContact || 'Khách Facebook';
      const isSent = f.status && f.status.includes('Đã gửi');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${f.time}</td>
        <td style="font-weight: 600; color: var(--color-primary);">${f.scent}</td>
        <td>${f.skin}</td>
        <td><span style="background: var(--color-bg-sage); padding: 2px 6px; border-radius: 4px;">${f.price}</span></td>
        <td>
          <div style="display: flex; align-items: center; gap: 6px;">
            <svg width="14" height="14" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span style="font-weight: 600; color: var(--color-text-main); font-size: 0.85rem;">${fbContact}</span>
          </div>
        </td>
        <td>
          <span class="badge" style="background: ${isSent ? 'var(--color-bg-sage)' : '#fff3cd'}; color: ${isSent ? 'var(--color-primary-dark)' : '#856404'}; font-size: 0.78rem; font-weight: 600; padding: 4px 8px; border-radius: 4px;">
            ${f.status || (f.code ? 'Đã gửi qua FB' : 'Chờ gửi qua FB')}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Render B2B Table
  function renderB2B() {
    const tbody = document.getElementById('b2bTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    b2bLeads.forEach(b => {
      const isTrial = (b.type && b.type.includes('500ml')) || (b.status && b.status.includes('500ml'));
      const bizType = b.bizType || 'Cơ sở Doanh nghiệp';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600; color: var(--color-text-main);">${b.store}</td>
        <td>
          <span style="font-size: 0.8rem; font-weight: 600; color: #426831; background: #eef7eb; padding: 2px 8px; border-radius: 4px; display: inline-block;">
            ${bizType}
          </span>
        </td>
        <td style="font-weight: 700; color: var(--color-primary);">${b.phone}</td>
        <td>
          <span class="badge" style="background: ${isTrial ? 'var(--color-pale-green)' : 'var(--color-surface-container-high)'}; color: var(--color-primary); font-size: 11px; padding: 3px 8px;">
            ${b.type || (isTrial ? 'Dùng thử 500ml' : 'Can sỉ B2B')}
          </span>
        </td>
        <td>${b.date}</td>
        <td><span class="badge-status ${isTrial ? 'pending' : 'delivered'}">${b.status}</span></td>
        <td style="font-size: 0.85rem; color: var(--color-text-secondary);">${b.note}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Tab Navigation Handling
  const tabLinks = document.querySelectorAll('.admin-menu-item');
  const panels = {
    orders: document.getElementById('panelOrders'),
    products: document.getElementById('panelProducts'),
    feedback: document.getElementById('panelFeedback'),
    b2b: document.getElementById('panelB2b')
  };
  const tabTitle = document.getElementById('tabTitle');

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      tabLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      Object.keys(panels).forEach(key => {
        if (panels[key]) panels[key].style.display = key === tab ? 'block' : 'none';
      });

      if (tab === 'orders') tabTitle.textContent = 'Quản Lý Đơn Đặt Hàng Trực Tuyến';
      if (tab === 'products') tabTitle.textContent = 'Danh Mục Sản Phẩm & Tồn Kho';
      if (tab === 'feedback') tabTitle.textContent = 'Khảo Sát Ý Kiến Khách Hàng R&D';
      if (tab === 'b2b') tabTitle.textContent = 'Quản Lý Đối Tác Quán Cafe B2B';
    });
  });

  // Search in Orders
  const orderSearchInput = document.getElementById('orderSearchInput');
  orderSearchInput?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderOrders(orders);
      return;
    }
    const filtered = orders.filter(o => 
      o.name.toLowerCase().includes(q) || 
      o.phone.toLowerCase().includes(q) || 
      o.code.toLowerCase().includes(q)
    );
    renderOrders(filtered);
  });

  // Export to CSV simulation
  document.getElementById('btnExportOrders')?.addEventListener('click', () => {
    alert(`Đã xuất danh sách ${orders.length} đơn hàng ra file Excel/CSV thành công!`);
  });

  // Reset to default sample orders
  document.getElementById('btnResetOrders')?.addEventListener('click', () => {
    if (confirm('Khôi phục danh sách đơn hàng về dữ liệu mẫu ban đầu (xóa tất cả đơn test)?')) {
      orders = [...defaultOrders];
      localStorage.setItem('reborn_orders', JSON.stringify(orders));
      renderOrders(orders);
      updateStats();
    }
  });

  // Initial Boot
  updateStats();
  renderOrders(orders);
  renderProducts();
  renderFeedback();
  renderB2B();
});
