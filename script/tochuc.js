// ==================== CẤU HÌNH ====================
const API_BASE = 'https://event-portal-mhgm.onrender.com';   // ← URL backend của bạn
let organizations = [];           // Dữ liệu thật lấy từ server
let selectedAvatarFile = null;    // File ảnh được chọn

// ==================== DOM ELEMENTS ====================
const addOrgBtn = document.getElementById('addOrgBtn');
const orgModal = document.getElementById('orgModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const orgForm = document.getElementById('orgForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
const orgAvatar = document.getElementById('orgAvatar');
const avatarFileName = document.getElementById('avatarFileName');
const avatarPreview = document.getElementById('avatarPreview');
const previewImage = document.getElementById('previewImage');
const orgId = document.getElementById('orgId');
const orgName = document.getElementById('orgName');
const orgDescription = document.getElementById('orgDescription');
const orgEmail = document.getElementById('orgEmail');
const orgFanpage = document.getElementById('orgFanpage');

// ==================== LOAD DỮ LIỆU TỪ BACKEND ====================
async function loadOrganizations() {
    try {
        const res = await fetch(`${API_BASE}/api/organizations`);
        if (!res.ok) throw new Error('Server lỗi');
        organizations = await res.json();

        // XÓA HẾT card mẫu trong HTML để tránh trùng
        document.querySelector('.cards').innerHTML = '';

        organizations.forEach(org => addOrganizationCard(org));
        checkEmptyState();
    } catch (err) {
        console.error(err);
        showNotification('Không kết nối được server!', 'error');
    }
}

// ==================== THÊM / SỬA ====================
async function handleFormSubmit(e) {
    e.preventDefault();

    const id = orgId.value.trim();
    const name = orgName.value.trim();
    const description = orgDescription.value.trim();
    const email = orgEmail.value.trim();
    const fanpage = orgFanpage.value.trim();

    if (!validateForm(name, description, email, fanpage)) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('email', email);
    formData.append('fanpage', fanpage);
    if (selectedAvatarFile) formData.append('avatar', selectedAvatarFile);

    const url = id ? `${API_BASE}/api/organizations/${id}` : `${API_BASE}/api/organizations`;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, { method, body: formData });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Lỗi server');
        }
        const data = await res.json();

        if (id) {
            // Cập nhật mảng + giao diện
            const idx = organizations.findIndex(o => o.id === parseInt(id));
            if (idx !== -1) organizations[idx] = data;
            updateOrganizationCard(id, data);
            showNotification('Cập nhật thành công!', 'success');
        } else {
            organizations.push(data);
            addOrganizationCard(data);
            showNotification('Thêm tổ chức thành công!', 'success');
        }
        closeModal();
        checkEmptyState();
    } catch (err) {
        console.error(err);
        alert(err.message || 'Lỗi kết nối server');
    }
}

// ==================== XÓA ====================
async function deleteOrganization(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa tổ chức này?')) return;

    try {
        const res = await fetch(`${API_BASE}/api/organizations/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Xóa thất bại');

        // Xóa khỏi mảng + DOM
        organizations = organizations.filter(o => o.id !== id);
        const card = document.querySelector(`.card[data-id="${id}"]`);
        if (card) {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateX(-100px)';
            setTimeout(() => {
                card.remove();
                showNotification('Đã xóa thành công!', 'success');
                checkEmptyState();
            }, 300);
        }
    } catch (err) {
        alert('Không thể xóa: ' + err.message);
    }
}

// ==================== MODAL & CARD ====================
function openAddModal() {
    modalTitle.textContent = "Thêm tổ chức";
    submitBtn.textContent = "Tạo";
    resetForm();
    orgModal.classList.add('active');
}

function openEditModal(id) {
    const org = organizations.find(o => o.id === parseInt(id));
    if (!org) return;

    modalTitle.textContent = "Chỉnh sửa tổ chức";
    submitBtn.textContent = "Cập nhật";

    orgId.value = org.id;
    orgName.value = org.name;
    orgDescription.value = org.description;
    orgEmail.value = org.email;
    orgFanpage.value = org.fanpage;
    previewImage.src = org.avatar;
    avatarPreview.style.display = 'block';
    avatarFileName.textContent = 'Ảnh hiện tại';
    selectedAvatarFile = null;

    orgModal.classList.add('active');
}

function closeModal() { orgModal.classList.remove('active'); }

function resetForm() {
    orgForm.reset();
    orgId.value = "";
    avatarFileName.textContent = "Chưa có ảnh nào được chọn";
    avatarPreview.style.display = 'none';
    selectedAvatarFile = null;
}

function handleAvatarSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) return alert('Chỉ chọn file ảnh!');
    selectedAvatarFile = file;
    avatarFileName.textContent = file.name;
    const reader = new FileReader();
    reader.onload = ev => {
        previewImage.src = ev.target.result;
        avatarPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// ==================== CARD HELPER ====================
function addOrganizationCard(org) {
    const container = document.querySelector('.cards');
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = org.id;
    card.innerHTML = `
        <div class="tieude">
            <div class="avatar"><img src="${org.avatar}" alt="${org.name}"></div>
            <div><h3>${org.name}</h3></div>
        </div>
        <p>${org.description}</p>
        <a href="mailto:${org.email}" class="email">${org.email}</a>
        <a href="${org.fanpage}" class="fanpage" target="_blank">${org.fanpage}</a>
        <div class="actions">
            <button class="edit" data-id="${org.id}">Sửa</button>
            <button class="delete" data-id="${org.id}">Xóa</button>
        </div>
    `;
    container.appendChild(card);
    card.querySelector('.edit').onclick = () => openEditModal(org.id);
    card.querySelector('.delete').onclick = () => deleteOrganization(org.id);
}

function updateOrganizationCard(id, org) {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (!card) return;
    card.querySelector('h3').textContent = org.name;
    card.querySelector('p').textContent = org.description;
    card.querySelector('.email').textContent = org.email;
    card.querySelector('.email').href = `mailto:${org.email}`;
    card.querySelector('.fanpage').textContent = org.fanpage;
    card.querySelector('.fanpage').href = org.fanpage;
    card.querySelector('.avatar img').src = org.avatar;
    card.querySelector('.avatar img').alt = org.name;
}

// ==================== VALIDATE + NOTIFY + EMPTY ====================
function validateForm(name, desc, email, fanpage) {
    if (!name) { alert('Nhập tên tổ chức!'); orgName.focus(); return false; }
    if (!desc) { alert('Nhập mô tả!'); orgDescription.focus(); return false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Email không hợp lệ!'); orgEmail.focus(); return false; }
    if (!fanpage) { alert('Nhập link fanpage!'); orgFanpage.focus(); return false; }
    try { new URL(fanpage); } catch { alert('URL fanpage không hợp lệ!'); orgFanpage.focus(); return false; }
    return true;
}

function showNotification(msg, type = 'success') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = msg;
    n.style.cssText = `position:fixed;top:20px;right:20px;background:${type==='success'?'#28a745':'#dc3545'};color:white;padding:16px 24px;border-radius:8px;z-index:10000;animation:slideInRight .3s ease,fadeOut .3s ease 2.7s forwards;`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function checkEmptyState() {
    const container = document.querySelector('.cards');
    const existing = container.querySelector('.empty-message');
    if (existing) existing.remove();
    if (container.querySelectorAll('.card').length === 0) {
        const msg = document.createElement('div');
        msg.className = 'empty-message';
        msg.style.cssText = 'text-align:center;padding:60px 20px;color:#666;grid-column:1/-1;';
        msg.innerHTML = `<div style="font-size:64px;margin-bottom:16px;">Chưa có tổ chức nào</div>
                         <h3 style="color:#333;margin-bottom:8px;">Chưa có tổ chức nào</h3>
                         <p>Nhấn nút "+ Thêm tổ chức" để bắt đầu</p>`;
        container.appendChild(msg);
    }
}

// ==================== EVENT LISTENERS ====================
addOrgBtn.onclick = openAddModal;
closeModalBtn.onclick = closeModal;
cancelBtn.onclick = closeModal;
orgForm.onsubmit = handleFormSubmit;
uploadAvatarBtn.onclick = () => orgAvatar.click();
orgAvatar.onchange = handleAvatarSelect;
orgModal.onclick = e => { if (e.target === orgModal) closeModal(); };
document.onkeydown = e => { if (e.key === 'Escape' && orgModal.classList.contains('active')) closeModal(); };

// CSS animation (giữ nguyên của bạn)
const style = document.createElement('style');
style.textContent = `@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
                     @keyframes fadeOut{to{opacity:0}}`;
document.head.appendChild(style);

// ==================== KHỞI ĐỘNG ====================
document.addEventListener('DOMContentLoaded', () => {
    loadOrganizations();   // ← QUAN TRỌNG NHẤT: tải dữ liệu thật ngay khi mở trang
});

document.querySelector('.logout-btn').onclick = () => {
    localStorage.clear();
    location.href = 'index.html';
};