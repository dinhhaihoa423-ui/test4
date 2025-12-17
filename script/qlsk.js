// ==================== KẾT NỐI BACKEND ====================
const API_BASE = 'https://test4-7cop.onrender.com';
let organizations = [];
let allEvents = []; // Cache events để mở modal sửa/xem nhanh

// Load tổ chức thật từ backend
async function loadOrganizations() {
  try {
    const res = await fetch(`${API_BASE}/api/organizations`);
    if (!res.ok) throw new Error('Server lỗi');
    organizations = await res.json();
    const selects = [
      document.getElementById('eventOrganization'),
      document.getElementById('editEventOrganization')
    ];
    selects.forEach(select => {
      if (!select) return;
      select.innerHTML = '<option value="">-----</option>';
      organizations.forEach(org => {
        const opt = document.createElement('option');
        opt.value = org.id;
        opt.textContent = org.name;
        select.appendChild(opt);
      });
    });
  } catch (err) {
    console.error('Không load được tổ chức:', err);
    alert('Không kết nối server để load tổ chức!');
  }
}

// Load events thật từ backend + cache
async function loadEvents() {
  try {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error('Server lỗi');
    allEvents = await res.json();

    // Xóa toàn bộ card cũ và thông báo trống cũ
    ['created', 'waitapproved', 'approved'].forEach(tab => {
      const wrapper = document.querySelector(`#${tab}-content .event-card`);
      if (wrapper) wrapper.innerHTML = '';
      removeEmptyMessage(tab + '-content');
    });

    // Render lại card
    allEvents.forEach(event => {
      let tabId = '';
      if (event.status === 'created') tabId = 'created-content';
      else if (event.status === 'pending') tabId = 'waitapproved-content';
      else if (event.status === 'approved') tabId = 'approved-content';
      if (tabId) renderEventCard(event, tabId);
    });

    // Kiểm tra và hiển thị thông báo trống cho từng tab
    ['created', 'waitapproved', 'approved'].forEach(tab => {
      const wrapper = document.querySelector(`#${tab}-content .event-card`);
      if (wrapper && wrapper.children.length === 0) {
        showEmptyMessage(tab + '-content', 'Chưa có sự kiện nào');
      }
    });

    updateTabBadges();
    updateEventStatusBadges();
  } catch (err) {
    console.error('Không load được events:', err);
    alert('Không kết nối server để load sự kiện!');
  }
}

// Render card từ data thật – FIX: Ưu tiên organizationName
function renderEventCard(event, tabId) {
  const wrapper = document.querySelector(`#${tabId} .event-card`);
  if (!wrapper) return;

  // Xóa thông báo trống nếu có (vì sắp có card)
  removeEmptyMessage(tabId);

  const card = document.createElement('div');
  card.className = 'content-card';
  card.dataset.id = event.id;

  const formatDate = (iso) => {
    if (!iso) return 'Chưa xác định';
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  };

  const orgName = event.organizationName || event.Organization?.name || '-----';
  const channelsHtml = event.channels?.length > 0
    ? `<div class="displaymxh">
        ${event.channels.includes('web') ? '<div class="mxh"><div class="mxh-web">Web</div></div>' : ''}
        ${event.channels.includes('facebook') ? '<div class="fb"><div class="fb-content">Facebook</div></div>' : ''}
        ${event.channels.includes('zalo') ? '<div class="zalo"><div class="zalo-content">Zalo</div></div>' : ''}
       </div>`
    : '<div class="mxh"><div class="mxh-web">Web</div></div>';

  let buttonsHtml = '';
  if (event.status === 'created') {
    buttonsHtml = `
      <div class="button-container">
        <button class="approve-btn edit-event-btn" data-id="${event.id}">Sửa</button>
        <button class="delete-btn" data-id="${event.id}">Xóa</button>
      </div>`;
  } else if (event.status === 'pending') {
    buttonsHtml = `<div class="button-container"><button class="see-btn" data-id="${event.id}">Xem</button></div>`;
  } else if (event.status === 'approved') {
    buttonsHtml = `<div class="button-container"><button class="delete-btn" data-id="${event.id}">Xóa</button></div>`;
  }

  card.innerHTML = `
    <div class="content-image">
      <img src="${event.image || 'https://via.placeholder.com/400x250/f0f0f0/999?text=No+Image'}" alt="${event.name}">
    </div>
    <div class="content-info">
      <div class="date"><p>${event.name}</p><div class="status-badge approved">Còn hạn</div></div>
      <div class="event-info">
        <p>${event.description || 'Chưa có mô tả'}</p>
        <p>⏰ Thời gian: ${formatDate(event.startTime)} - ${formatDate(event.endTime)}</p>
        <p>📅 Hạn đăng ký: ${formatDate(event.registrationDeadline)}</p>
        <p>📍 Địa điểm: ${event.location}</p>
        <p>🏢 Tổ chức: ${orgName}</p>
      </div>
      ${channelsHtml}
      <a class="dki" href="${event.registrationLink}" target="_blank">Link đăng ký →</a>
      ${buttonsHtml}
    </div>
  `;
  wrapper.appendChild(card);
}

// Hàm hiển thị thông báo trống trong tab
function showEmptyMessage(tabContentId, message) {
  const content = document.getElementById(tabContentId);
  if (!content) return;

  // Tránh tạo nhiều lần
  if (content.querySelector('.empty-message')) return;

  const div = document.createElement('div');
  div.className = 'empty-message';
  div.innerHTML = `<p style="text-align:center; color:#999; padding:40px 20px; font-size:16px;">${message}</p>`;
  // Chèn trước .event-card
  const wrapper = content.querySelector('.event-card');
  if (wrapper) {
    content.insertBefore(div, wrapper);
  } else {
    content.appendChild(div);
  }
}

// Hàm xóa thông báo trống
function removeEmptyMessage(tabContentId) {
  const content = document.getElementById(tabContentId);
  if (!content) return;
  const msg = content.querySelector('.empty-message');
  if (msg) msg.remove();
}

// Hàm kiểm tra và hiển thị thông báo khi search không có kết quả
function checkSearchEmpty() {
  const visibleCards = document.querySelectorAll('.content-card:not(.hidden-search)');
  const activeTabContent = document.querySelector('.tab-content.active');
  if (!activeTabContent) return;

  removeSearchEmptyMessage();

  if (visibleCards.length === 0 && document.getElementById('searchInput').value.trim() !== '') {
    const div = document.createElement('div');
    div.className = 'empty-message search-empty';
    div.innerHTML = `<p style="text-align:center; color:#999; padding:40px 20px; font-size:16px;">Không tìm thấy sự kiện nào phù hợp</p>`;
    activeTabContent.appendChild(div);
  }
}

// Xóa thông báo search trống
function removeSearchEmptyMessage() {
  document.querySelectorAll('.search-empty').forEach(el => el.remove());
}

// ==================== BACKEND FUNCTIONS ====================
// (giữ nguyên các hàm createEvent, updateEvent, deleteEvent, approveEvent, rejectEvent, openEditModal, openViewModal, close modals...)
// Không thay đổi phần này để giữ nguyên logic cũ

// ==================== UI & EVENTS ====================
document.addEventListener('DOMContentLoaded', async () => {
  await loadOrganizations();
  await loadEvents();

  // Tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab + '-content').classList.add('active');

      // Khi chuyển tab, kiểm tra lại search empty (nếu đang search)
      checkSearchEmpty();
    });
  });

  // ... (giữ nguyên tất cả các event listener modal, upload, button delegate, logout ...)

  // Search – đã chỉnh để có thông báo không tìm thấy
  document.getElementById('searchInput').addEventListener('input', e => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      document.querySelectorAll('.content-card').forEach(card => card.classList.remove('hidden-search'));
      removeSearchEmptyMessage();
      return;
    }

    let hasResult = false;
    document.querySelectorAll('.content-card').forEach(card => {
      const name = card.querySelector('.date p')?.textContent.toLowerCase() || '';
      const org = card.querySelector('.event-info p:nth-child(5)')?.textContent.toLowerCase() || '';
      if (name.includes(term) || org.includes(term)) {
        card.classList.remove('hidden-search');
        hasResult = true;
      } else {
        card.classList.add('hidden-search');
      }
    });

    checkSearchEmpty(); // hiển thị thông báo nếu không có kết quả
  });

  updateTabBadges();
  updateEventStatusBadges();
  setInterval(updateEventStatusBadges, 60000);
});

function updateTabBadges() {
  ['created', 'waitapproved', 'approved'].forEach(tab => {
    const count = document.querySelectorAll(`#${tab}-content .content-card`).length;
    const badge = document.querySelector(`.tab-btn[data-tab="${tab}"] .badge`);
    if (badge) badge.textContent = `(${count})`;
  });
}

// Các hàm còn lại giữ nguyên như file gốc (updateEventStatusBadges, searchEvents nếu còn dùng, logout...)
