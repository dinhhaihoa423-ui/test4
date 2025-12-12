// ==================== KẾT NỐI BACKEND ====================
const API_BASE = 'https://test4-7cop.onrender.com'; // Backend Render của bạn
let organizations = [];

// Load tổ chức thật từ backend để điền dropdown
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
                const option = document.createElement('option');
                option.value = org.id;
                option.textContent = org.name;
                select.appendChild(option);
            });
        });
    } catch (err) {
        console.error('Không load được danh sách tổ chức:', err);
        alert('Không kết nối được server để lấy danh sách tổ chức!');
    }
}

// Load tất cả events từ backend và render vào đúng tab
async function loadEvents() {
    try {
        const res = await fetch(`${API_BASE}/api/events`);
        if (!res.ok) throw new Error('Server lỗi');
        const events = await res.json();

        // Xóa hết card cũ
        document.querySelectorAll('.event-card').forEach(wrapper => wrapper.innerHTML = '');

        events.forEach(event => {
            let tabId = '';
            if (event.status === 'created') tabId = 'created-content';
            else if (event.status === 'pending') tabId = 'waitapproved-content';
            else if (event.status === 'approved') tabId = 'approved-content';

            if (tabId) renderEventCard(event, tabId);
        });

        updateTabBadges();
        updateEventStatusBadges();
        checkEmptyTab();
    } catch (err) {
        console.error('Không load được events:', err);
        alert('Không kết nối được server để lấy danh sách sự kiện!');
    }
}

// Render 1 card sự kiện từ data backend
function renderEventCard(event, tabId) {
    const wrapper = document.querySelector(`#${tabId} .event-card`);
    if (!wrapper) return;

    const card = document.createElement('div');
    card.className = 'content-card';
    card.dataset.id = event.id;

    const formatDate = (iso) => {
        if (!iso) return 'Chưa xác định';
        const d = new Date(iso);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const MM = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${hh}:${mm} ${dd}/${MM}/${yyyy}`;
    };

    const orgName = event.Organization ? event.Organization.name : '-----';

    const channelsHtml = event.channels && event.channels.length > 0
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
        buttonsHtml = `<div class="button-container">
                <button class="see-btn" data-id="${event.id}">Xem</button>
            </div>`;
    } else if (event.status === 'approved') {
        buttonsHtml = `<div class="button-container">
                <button class="delete-btn" data-id="${event.id}">Xóa</button>
            </div>`;
    }

    card.innerHTML = `
        <div class="content-image">
            <img src="${event.image || 'https://via.placeholder.com/400x250/f0f0f0/999?text=No+Image'}" alt="${event.name}">
        </div>
        <div class="content-info">
            <div class="date">
                <p>${event.name}</p>
                <div class="status-badge approved">Còn hạn</div>
            </div>
            <div class="event-info">
                <p>${event.description || 'Chưa có mô tả'}</p>
                <p>⏰ Thời gian: ${formatDate(event.startTime)} - ${formatDate(event.endTime)}</p>
                <p>📅 Hạn đăng ký: ${formatDate(event.registrationDeadline)}</p>
                <p>📍 Địa điểm: ${event.location}</p>
                <p>🏢 Tổ chức: ${orgName}</p>
            </div>
            ${channelsHtml}
            <a class="dki" href="${event.registrationLink || '#'}" target="_blank">Link đăng ký →</a>
            ${buttonsHtml}
        </div>
    `;

    wrapper.appendChild(card);
}

// ==================== CÁC HÀM BACKEND ====================
// Tạo sự kiện mới
async function createEvent() {
    const required = ['eventName', 'eventStartTime', 'eventEndTime', 'registrationDeadline', 'eventLocation', 'registrationLink'];
    let valid = true;
    required.forEach(id => {
        if (!document.getElementById(id).value.trim()) valid = false;
    });
    if (!valid) {
        alert('Vui lòng điền đầy đủ các trường bắt buộc!');
        return;
    }

    const formData = new FormData();
    formData.append('name', document.getElementById('eventName').value.trim());
    formData.append('description', document.getElementById('eventDescription').value.trim());
    formData.append('startTime', document.getElementById('eventStartTime').value);
    formData.append('endTime', document.getElementById('eventEndTime').value);
    formData.append('registrationDeadline', document.getElementById('registrationDeadline').value);
    formData.append('location', document.getElementById('eventLocation').value.trim());
    formData.append('registrationLink', document.getElementById('registrationLink').value.trim());
    formData.append('organizationId', document.getElementById('eventOrganization').value);

    const channels = Array.from(document.querySelectorAll('input[name="socialChannels"]:checked')).map(cb => cb.value);
    formData.append('channels', JSON.stringify(channels));

    const fileInput = document.getElementById('eventImage');
    if (fileInput.files[0]) formData.append('image', fileInput.files[0]);

    try {
        const res = await fetch(`${API_BASE}/api/events`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Tạo sự kiện thành công!');
        closeModal(); // bạn đã có hàm này
        document.getElementById('createEventForm').reset();
        document.getElementById('fileName').textContent = 'Chưa có ảnh nào được chọn';
        await loadEvents();
    } catch (err) {
        alert('Lỗi tạo sự kiện: ' + err.message);
    }
}

// Sửa sự kiện
async function updateEvent(id) {
    const formData = new FormData();
    formData.append('name', document.getElementById('editEventName').value.trim());
    formData.append('description', document.getElementById('editEventDescription').value.trim());
    formData.append('startTime', document.getElementById('editEventStartTime').value);
    formData.append('endTime', document.getElementById('editEventEndTime').value);
    formData.append('registrationDeadline', document.getElementById('editRegistrationDeadline').value);
    formData.append('location', document.getElementById('editEventLocation').value.trim());
    formData.append('registrationLink', document.getElementById('editRegistrationLink').value.trim());
    formData.append('organizationId', document.getElementById('editEventOrganization').value);

    const fileInput = document.getElementById('editEventImage');
    if (fileInput.files[0]) formData.append('image', fileInput.files[0]);

    try {
        const res = await fetch(`${API_BASE}/api/events/${id}`, {
            method: 'PUT',
            body: formData
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Cập nhật sự kiện thành công!');
        document.getElementById('editModalOverlay').classList.remove('active');
        document.body.style.overflow = 'auto';
        await loadEvents();
    } catch (err) {
        alert('Lỗi cập nhật: ' + err.message);
    }
}

// Xóa sự kiện
async function deleteEvent(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;

    try {
        const res = await fetch(`${API_BASE}/api/events/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        showDeleteNotification('Đã xóa sự kiện thành công!');
        await loadEvents();
    } catch (err) {
        alert('Lỗi xóa: ' + err.message);
    }
}

// Duyệt sự kiện (pending → approved)
async function approveEvent(id) {
    try {
        const res = await fetch(`${API_BASE}/api/events/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Duyệt sự kiện thành công!');
        document.getElementById('viewModalOverlay').classList.remove('active');
        document.body.style.overflow = 'auto';
        await loadEvents();
    } catch (err) {
        alert('Lỗi duyệt: ' + err.message);
    }
}

// Từ chối = xóa
async function rejectEvent(id) {
    if (!confirm('Từ chối và xóa sự kiện này khỏi danh sách?')) return;
    await deleteEvent(id);
    document.getElementById('viewModalOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Mở modal sửa – load data thật
async function openEditModal(id) {
    try {
        const res = await fetch(`${API_BASE}/api/events`);
        const events = await res.json();
        const event = events.find(e => e.id == id);
        if (!event) throw new Error('Không tìm thấy sự kiện');

        document.getElementById('editEventId').value = event.id;
        document.getElementById('editEventName').value = event.name;
        document.getElementById('editEventDescription').value = event.description || '';
        document.getElementById('editEventStartTime').value = event.startTime.slice(0, 16);
        document.getElementById('editEventEndTime').value = event.endTime.slice(0, 16);
        document.getElementById('editRegistrationDeadline').value = event.registrationDeadline.slice(0, 16);
        document.getElementById('editEventLocation').value = event.location;
        document.getElementById('editRegistrationLink').value = event.registrationLink;
        document.getElementById('editEventOrganization').value = event.organizationId || '';

        document.getElementById('editFileName').textContent = event.image ? 'Ảnh hiện tại đã có' : 'Chưa có ảnh nào được chọn';

        document.getElementById('editModalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (err) {
        alert('Lỗi load dữ liệu sửa: ' + err.message);
    }
}

// Mở modal xem chi tiết (pending)
async function openViewModal(id) {
    try {
        const res = await fetch(`${API_BASE}/api/events`);
        const events = await res.json();
        const event = events.find(e => e.id == id);
        if (!event) throw new Error('Không tìm thấy');

        document.getElementById('viewEventImage').src = event.image || 'https://via.placeholder.com/400x250';
        document.getElementById('viewEventName').textContent = event.name;
        document.getElementById('viewEventDescription').textContent = event.description || 'Chưa có mô tả';
        document.getElementById('viewEventStartTime').textContent = new Date(event.startTime).toLocaleString('vi-VN');
        document.getElementById('viewEventEndTime').textContent = new Date(event.endTime).toLocaleString('vi-VN');
        document.getElementById('viewRegistrationDeadline').textContent = new Date(event.registrationDeadline).toLocaleString('vi-VN');
        document.getElementById('viewEventLocation').textContent = event.location;
        document.getElementById('viewEventOrganization').textContent = event.Organization?.name || '-----';
        document.getElementById('viewRegistrationLink').href = event.registrationLink;
        document.getElementById('viewRegistrationLink').textContent = event.registrationLink;

        const channelsContainer = document.getElementById('viewSocialChannels');
        channelsContainer.innerHTML = '';
        (event.channels || []).forEach(ch => {
            const tag = document.createElement('span');
            tag.className = 'channel-tag';
            tag.textContent = ch.charAt(0).toUpperCase() + ch.slice(1);
            channelsContainer.appendChild(tag);
        });

        // Gắn sự kiện cho nút duyệt/từ chối
        document.getElementById('approveEventBtn').onclick = () => approveEvent(event.id);
        document.getElementById('rejectEventBtn').onclick = () => rejectEvent(event.id);

        document.getElementById('viewModalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    } catch (err) {
        alert('Lỗi load chi tiết: ' + err.message);
    }
}

// ==================== TOÀN BỘ CODE UI CŨ CỦA BẠN (GIỮ NGUYÊN) ====================
document.addEventListener('DOMContentLoaded', async function () {
    await loadOrganizations();
    await loadEvents();

    // === TAB SWITCHING ===
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.getAttribute('data-tab')}-content`).classList.add('active');
        });
    });

    // === MODAL TẠO SỰ KIỆN ===
    const openModalBtn = document.getElementById('openModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('eventImage');
    const fileName = document.getElementById('fileName');
    const nextToSocial = document.getElementById('nextToSocial');
    const backToStep1 = document.getElementById('backToStep1');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        step1.classList.add('active');
        step2.classList.remove('active');
    });

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        fileName.textContent = fileInput.files[0] ? fileInput.files[0].name : 'Chưa có ảnh nào được chọn';
    });

    nextToSocial.addEventListener('click', () => {
        if (!document.getElementById('eventName').value.trim()) {
            alert('Vui lòng nhập tên sự kiện');
            return;
        }
        step1.classList.remove('active');
        step2.classList.add('active');
    });

    backToStep1.addEventListener('click', () => {
        step2.classList.remove('active');
        step1.classList.add('active');
    });

    document.getElementById('createEvent').addEventListener('click', createEvent);

    // === MODAL SỬA ===
    const editModalOverlay = document.getElementById('editModalOverlay');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editUploadBtn = document.getElementById('editUploadBtn');
    const editFileInput = document.getElementById('editEventImage');
    const editFileName = document.getElementById('editFileName');

    function closeEditModal() {
        editModalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editModalOverlay.addEventListener('click', (e) => { if (e.target === editModalOverlay) closeEditModal(); });

    editUploadBtn.addEventListener('click', () => editFileInput.click());
    editFileInput.addEventListener('change', () => {
        editFileName.textContent = editFileInput.files[0] ? editFileInput.files[0].name : 'Chưa có ảnh nào được chọn';
    });

    document.getElementById('editEventForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('editEventId').value;
        updateEvent(id);
    });

    // === MODAL XEM ===
    const viewModalOverlay = document.getElementById('viewModalOverlay');
    const closeViewModalBtn = document.getElementById('closeViewModalBtn');
    const closeViewBtn = document.getElementById('closeViewBtn');

    function closeViewModal() {
        viewModalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    closeViewModalBtn.addEventListener('click', closeViewModal);
    closeViewBtn.addEventListener('click', closeViewModal);
    viewModalOverlay.addEventListener('click', (e) => { if (e.target === viewModalOverlay) closeViewModal(); });

    // === DELEGATE CLICK CHO CÁC NÚT ĐỘNG ===
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('.edit-event-btn') || e.target.closest('.edit-event-btn')) {
            const btn = e.target.matches('.edit-event-btn') ? e.target : e.target.closest('.edit-event-btn');
            openEditModal(btn.dataset.id);
        }
        if (e.target.matches('.delete-btn') || e.target.closest('.delete-btn')) {
            const btn = e.target.matches('.delete-btn') ? e.target : e.target.closest('.delete-btn');
            deleteEvent(btn.dataset.id);
        }
        if (e.target.matches('.see-btn') || e.target.closest('.see-btn')) {
            const btn = e.target.matches('.see-btn') ? e.target : e.target.closest('.see-btn');
            openViewModal(btn.dataset.id);
        }
    });

    // === SEARCH SIÊU MƯỢT ===
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => searchEvents(searchInput.value.trim().toLowerCase()));

    function searchEvents(searchTerm) {
        // Code search cũ của bạn (giữ nguyên 100%)
        const containers = document.querySelectorAll('#created-content > .event-card, #waitapproved-content > .event-card, #approved-content > .event-card');
        let foundAny = false;
        containers.forEach(container => {
            const cards = Array.from(container.querySelectorAll('.content-card'));
            cards.forEach(card => {
                card.classList.remove('hidden-search');
                card.style.order = '';
            });
            if (searchTerm === '') return;
            const matched = [];
            const unmatched = [];
            cards.forEach(card => {
                const name = (card.querySelector('.date p')?.textContent || '').toLowerCase();
                const org = (card.querySelector('.event-info p:nth-child(5)')?.textContent || '').toLowerCase().replace(/🏢\s*tổ chức:\s*/g, '').trim();
                if (name.includes(searchTerm) || org.includes(searchTerm)) {
                    matched.push(card);
                    foundAny = true;
                } else {
                    unmatched.push(card);
                }
            });
            matched.forEach((card, i) => card.style.order = i);
            unmatched.forEach((card, i) => card.style.order = matched.length + i);
            unmatched.forEach(card => card.classList.add('hidden-search'));
        });

        document.querySelectorAll('.no-results-message').forEach(el => el.remove());
        if (searchTerm && !foundAny) {
            const activeTab = document.querySelector('.tab-content.active');
            if (!activeTab) return;
            const overlay = document.createElement('div');
            overlay.className = 'no-results-message';
            overlay.style.cssText = `position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;pointer-events:none;text-align:center;color:#555;`;
            overlay.innerHTML = `
                <div style="font-size:28px;font-weight:600;margin-bottom:10px;">Không tìm thấy sự kiện nào</div>
                <div style="font-size:18px;">có chứa từ khóa: <strong>"${searchTerm}"</strong></div>
                <div style="margin-top:18px;font-size:15px;color:#888;">Thử tìm từ khóa khác xem sao nhé</div>
            `;
            if (getComputedStyle(activeTab).position === 'static') activeTab.style.position = 'relative';
            activeTab.appendChild(overlay);
        }
    }

    // === CẬP NHẬT BADGE SỐ LƯỢNG ===
    function updateTabBadges() {
        const createdCount = document.querySelectorAll('#created-content .content-card').length;
        const waitingCount = document.querySelectorAll('#waitapproved-content .content-card').length;
        const approvedCount = document.querySelectorAll('#approved-content .content-card').length;
        document.querySelector('.tab-btn[data-tab="created"] .badge')?.then(b => b.textContent = `(${createdCount})`);
        document.querySelector('.tab-btn[data-tab="waitapproved"] .badge')?.then(b => b.textContent = `(${waitingCount})`);
        document.querySelector('.tab-btn[data-tab="approved"] .badge')?.then(b => b.textContent = `(${approvedCount})`);
    }

    // === STATUS CÒN HẠN / HẾT HẠN ===
    function updateEventStatusBadges() {
        const now = new Date();
        document.querySelectorAll('.content-card').forEach(card => {
            const deadlineText = Array.from(card.querySelectorAll('.event-info p')).find(p => p.textContent.includes('📅 Hạn đăng ký:'));
            if (!deadlineText) return;
            const text = deadlineText.textContent.replace('📅 Hạn đăng ký:', '').trim();
            const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            if (!match) return;
            const [_, dd, mm, yyyy] = match;
            const deadline = new Date(`${yyyy}-${mm}-${dd}T23:59:59`);
            const badge = card.querySelector('.status-badge');
            if (deadline >= now) {
                badge.textContent = 'Còn hạn';
                badge.className = 'status-badge approved';
            } else {
                badge.textContent = 'Hết hạn';
                badge.className = 'status-badge disapproved';
            }
        });
    }
    setInterval(updateEventStatusBadges, 60000);

    // === THÔNG BÁO XÓA ===
    function showDeleteNotification(message) {
        const old = document.querySelector('.delete-notification');
        if (old) old.remove();
        const noti = document.createElement('div');
        noti.className = 'delete-notification';
        noti.style.cssText = `position:fixed;top:20px;right:20px;background:#2cbe67;color:white;padding:16px 24px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:10000;animation:slideInRight 0.3s ease,fadeOut 0.3s ease 2.7s forwards;font-size:14px;`;
        noti.textContent = message;
        document.body.appendChild(noti);
        setTimeout(() => noti.remove(), 3000);
    }

    // === TAB TRỐNG ===
    function checkEmptyTab() {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;
        const visible = activeTab.querySelectorAll('.content-card:not(.hidden-search)').length;
        // Code thông báo trống nếu cần (bạn có thể thêm lại)
    }

    // Cập nhật ban đầu
    updateTabBadges();
    updateEventStatusBadges();
});
