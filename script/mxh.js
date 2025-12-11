// script/mxh.js - ĐÃ THÊM TRẠNG THÁI TRỐNG + ICON ĐẸP
const API_URL = 'https://test4-7cop.onrender.com/api/social-medias';

document.addEventListener('DOMContentLoaded', async function () {
  const openModalBtn = document.getElementById('openModalBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const createOrgForm = document.getElementById('createOrgForm');
  const editModalOverlay = document.getElementById('editModalOverlay');
  const editOrgForm = document.getElementById('editOrgForm');
  const confirmModalOverlay = document.getElementById('confirmModalOverlay');
  const confirmMessage = document.getElementById('confirmMessage');
  const confirmBtn = document.querySelector('.confirm-btn');

  let currentCardToDelete = null;

  // ==================== NOTIFICATION ====================
  const notification = document.createElement('div');
  notification.id = 'notification';
  Object.assign(notification.style, {
    position: 'fixed', top: '20px', right: '20px', padding: '15px 25px',
    backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: '10000',
    opacity: '0', transform: 'translateX(100px)', transition: 'all 0.3s',
    fontFamily: 'Arial, sans-serif', fontSize: '14px', cursor: 'pointer'
  });
  document.body.appendChild(notification);

  function showNotification(msg, type = 'success') {
    const colors = { success: '#4CAF50', error: '#f44336', warning: '#ff9800' };
    notification.textContent = msg;
    notification.style.backgroundColor = colors[type] || colors.success;
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100px)';
    }, 3000);
  }
  notification.onclick = () => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100px)';
  };

  // ==================== TRẠNG THÁI TRỐNG (ĐẸP LUNG LINH) ====================
  function checkEmptyState() {
    const container = document.querySelector('.cards');
    const existing = container.querySelector('.empty-message');
    if (existing) existing.remove();

    if (container.querySelectorAll('.card').length === 0) {
      const msg = document.createElement('div');
      msg.className = 'empty-message';
      msg.style.cssText = 'text-align:center; padding:80px 20px; color:#888; grid-column:1/-1;';
      msg.innerHTML = `
        <div style="font-size:80px; margin-bottom:20px; opacity:0.6;">Link</div>
        <h3 style="color:#333; margin:0 0 12px 0; font-size:24px;">Chưa có mạng xã hội nào</h3>
        <p style="margin:0; font-size:16px;">Nhấn nút "+ Thêm mới" để bắt đầu</p>
      `;
      container.appendChild(msg);
    }
  }

  // ==================== LOAD DỮ LIỆU ====================
  async function loadSocialMedias() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Server error');
      const list = await res.json();

      const container = document.querySelector('.cards');
      container.innerHTML = '';
      list.forEach(item => createCard(item));
      checkEmptyState(); // gọi kiểm tra trạng thái trống
    } catch (err) {
      showNotification('Không tải được dữ liệu! Kiểm tra mạng hoặc liên hệ admin', 'error');
      console.error(err);
    }
  }

  // ==================== TẠO CARD ====================
  function createCard(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${data.name}</h3>
      <a class="web" href="${data.link}" target="_blank" rel="noopener">${data.link}</a>
      <div class="actions">
        <button class="edit"
          data-id="${data.id}"
          data-name="${data.name}"
          data-link="${data.link.replace(/^https?:\/\//, '')}">Sửa</button>
        <button class="delete" data-id="${data.id}">Xóa</button>
      </div>
    `;
    document.querySelector('.cards').appendChild(card);

    card.querySelector('.edit').onclick = () => openEditModal(data);
    card.querySelector('.delete').onclick = () => {
      currentCardToDelete = card;
      confirmMessage.textContent = `Xóa "${data.name}" khỏi danh sách?`;
      confirmModalOverlay.classList.add('active');
    };
  }

  function openEditModal(data) {
    document.getElementById('editOrgId').value = data.id;
    document.getElementById('editOrgName').value = data.name;
    document.getElementById('editOrgLink').value = data.link.replace(/^https?:\/\//, '');
    editModalOverlay.classList.add('active');
  }

  // ==================== THÊM MỚI ====================
  createOrgForm.onsubmit = async e => {
    e.preventDefault();
    const name = document.getElementById('orgName').value.trim();
    const linkInput = document.getElementById('orgLink').value.trim();
    if (!name || !linkInput) return showNotification('Nhập đầy đủ thông tin!', 'error');

    const link = linkInput.startsWith('http') ? linkInput : `https://${linkInput}`;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, link })
      });

      if (res.ok) {
        const newItem = await res.json();
        createCard(newItem);
        checkEmptyState(); // cập nhật lại trạng thái trống
        showNotification(`Đã thêm "${name}"`, 'success');
        modalOverlay.classList.remove('active');
        createOrgForm.reset();
      } else throw new Error();
    } catch {
      showNotification('Lỗi khi thêm!', 'error');
    }
  };

  // ==================== SỬA ====================
  editOrgForm.onsubmit = async e => {
    e.preventDefault();
    const id = document.getElementById('editOrgId').value;
    const name = document.getElementById('editOrgName').value.trim();
    const linkInput = document.getElementById('editOrgLink').value.trim();
    const link = linkInput.startsWith('http') ? linkInput : `https://${linkInput}`;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, link })
      });
      if (res.ok) {
        loadSocialMedias(); // reload để đẹp
        showNotification('Cập nhật thành công!', 'success');
        editModalOverlay.classList.remove('active');
      }
    } catch {
      showNotification('Lỗi khi sửa!', 'error');
    }
  };

  // ==================== XÓA ====================
  confirm.onclick = async () => {
    if (!currentCardToDelete) return;
    const id = currentCardToDelete.querySelector('.delete').dataset.id;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        currentCardToDelete.remove();
        checkEmptyState(); // hiện lại thông báo trống nếu cần
        showNotification('Đã xóa thành công!', 'success');
      }
    } catch {
      showNotification('Lỗi khi xóa!', 'error');
    }
    confirmModalOverlay.classList.remove('active');
    currentCardToDelete = null;
  };

  // ==================== ĐÓNG MODAL ====================
  document.querySelectorAll('.close-btn, .cancel-btn, .cancel-confirm-btn, .close-confirm-btn')
    .forEach(btn => btn.onclick = () => {
      modalOverlay.classList.remove('active');
      editModalOverlay.classList.remove('active');
      confirmModalOverlay.classList.remove('active');
    });

  [modalOverlay, editModalOverlay, confirmModalOverlay].forEach(overlay => {
    overlay.onclick = e => { if (e.target === overlay) overlay.classList.remove('active'); };
  });

  openModalBtn.onclick = () => modalOverlay.classList.add('active');

  // ==================== KHỞI ĐỘNG ====================
  loadSocialMedias();
  checkEmptyState(); // lần đầu cũng kiểm tra luôn
});

// LOGOUT
document.querySelector('.logout-btn')?.addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'index.html';
});
