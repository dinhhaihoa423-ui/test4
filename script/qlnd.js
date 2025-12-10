// script/qlnd.js - FIX UPDATE STATUS (DUYỆT/TỪ CHỐI/XÓA)
const API_BASE = 'https://test4-7cop.onrender.com/api/ugc';

// Notification (giữ nguyên)
function createNotificationElement() {
    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2cbe67ff;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(-100px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        max-width: 300px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        cursor: pointer;
    `;
    document.body.appendChild(notification);
    return notification;
}
const notification = createNotificationElement();
function showNotification(message, type = 'success') {
    const colors = { 'success': '#2cbe67ff', 'error': '#f44336', 'warning': '#ff9800' };
    notification.textContent = message;
    notification.style.backgroundColor = colors[type] || colors['success'];
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => hideNotification(), 3000);
}
function hideNotification() {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(-100px)';
}
notification.addEventListener('click', hideNotification);

// Render card (giữ nguyên)
function renderContentCard(content) {
  const card = document.createElement('div');
  card.className = `content-card ${content.status === 'approved' ? 'approved' : ''}`;
  card.dataset.id = content.id;
  card.innerHTML = `
    <div class="content-image">
      <img src="${content.imageUrl}" alt="${content.title}">
      ${content.status === 'approved' ? '<div class="status-badge approved">Đã duyệt</div>' : ''}
    </div>
    <div class="content-info">
      <h3>${content.title}</h3>
      <div class="author">Bởi ${content.author}</div>
      <div class="timestamp">${content.timestamp}</div>
      <div class="actions">
        ${content.status === 'pending' ? `
          <button class="approve-btn">Duyệt</button>
          <button class="reject-btn">Từ chối</button>
        ` : `
          <button class="archive-btn">Xóa</button>
        `}
      </div>
    </div>
  `;
  if (content.status === 'pending') {
    card.querySelector('.approve-btn').addEventListener('click', () => handleAction(content.id, 'approve'));
    card.querySelector('.reject-btn').addEventListener('click', () => handleAction(content.id, 'reject'));
  } else {
    card.querySelector('.archive-btn').addEventListener('click', () => handleAction(content.id, 'archive'));
  }
  return card;
}

// Load tab (giữ nguyên, đã OK)
async function loadTab(tab) {
  try {
    const response = await fetch(`${API_BASE}/${tab}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contents = await response.json();
    const grid = document.querySelector(`#${tab}-content .content-grid`);
    grid.innerHTML = '';
    contents.forEach(content => grid.appendChild(renderContentCard(content)));
    const badge = document.querySelector(`[data-tab="${tab}"] .badge`);
    badge.textContent = `(${contents.length})`;
    badge.style.display = contents.length > 0 ? 'inline' : 'none';
  } catch (err) {
    showNotification(`Lỗi tải ${tab}: ${err.message}`, 'error');
  }
}

// FIX: Handle action - Gọi POST /update/:id
async function handleAction(id, action) {
  let message = '', newStatus = '';
  if (action === 'approve') { message = 'Bạn có chắc chắn muốn duyệt nội dung này?'; newStatus = 'approved'; }
  if (action === 'reject') { message = 'Bạn có chắc chắn muốn từ chối nội dung này?'; newStatus = 'rejected'; }
  if (action === 'archive') { message = 'Bạn có chắc chắn muốn xóa nội dung này?'; newStatus = 'archived'; }
  
  showModal(message, async () => {
    try {
      const response = await fetch(`${API_BASE}/update/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      await Promise.all([loadTab('pending'), loadTab('approved')]);
      showNotification(`Đã ${action === 'reject' ? 'từ chối' : action === 'archive' ? 'xóa' : 'duyệt'} thành công!`, action === 'reject' ? 'warning' : 'success');
    } catch (err) {
      showNotification(`Lỗi ${action}: ${err.message}`, 'error');
    }
  });
}

// Modal (giữ nguyên)
const modalOverlay = document.getElementById('modalOverlay');
let currentCallback = null;
function showModal(message, callback) {
  document.getElementById('modalMessage').textContent = message;
  currentCallback = callback;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function hideModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
  currentCallback = null;
}
if (modalOverlay) {
  document.querySelector('.close-btn')?.addEventListener('click', hideModal);
  document.querySelector('.cancel-btn')?.addEventListener('click', hideModal);
  document.querySelector('.confirm-btn')?.addEventListener('click', () => {
    if (currentCallback) currentCallback();
    hideModal();
  });
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) hideModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideModal(); });
}

// Tab (giữ nguyên)
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
  btn.addEventListener('click', async () => {
    const tabId = btn.getAttribute('data-tab');
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`${tabId}-content`).classList.add('active');
    await loadTab(tabId);
  });
});

// Init
async function init() {
  await Promise.all([loadTab('pending'), loadTab('approved')]);
  tabBtns[0]?.click();
}
init();

// Logout
document.querySelector('.logout-btn')?.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});
