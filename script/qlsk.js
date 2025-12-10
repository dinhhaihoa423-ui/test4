// ==================== KẾT NỐI BACKEND ====================
const API_BASE = 'https://test4-7cop.onrender.com'; // Backend Render của bạn
let organizations = []; // Lưu danh sách tổ chức từ server

// Load tổ chức thật từ backend để điền vào dropdown
async function loadOrganizations() {
    try {
        const res = await fetch(`${API_BASE}/api/organizations`);
        if (!res.ok) throw new Error('Server lỗi');
        organizations = await res.json();

        // Điền vào cả 2 dropdown: tạo và sửa sự kiện
        const selects = [
            document.getElementById('eventOrganization'),
            document.getElementById('editEventOrganization')
        ];

        selects.forEach(select => {
            if (!select) return;
            // Xóa hết option cũ (trừ dòng đầu)
            select.innerHTML = '<option value="-----">-----</option>';
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

// ==================== CODE CŨ CỦA BẠN GIỮ NGUYÊN 100% TỪ ĐÂY TRỞ XUỐNG ====================
document.addEventListener('DOMContentLoaded', function() {

    // GỌI HÀM LOAD TỔ CHỨC THẬT NGAY KHI MỞ TRANG
    loadOrganizations();

    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
           
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
           
            btn.classList.add('active');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });

    // Tạo sự kiện
    const openModalBtn = document.getElementById('openModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const createForm = document.getElementById('createEventForm');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('eventImage');
    const fileName = document.getElementById('fileName');
    const nextToSocial = document.getElementById('nextToSocial');
    const backToStep1 = document.getElementById('backToStep1');
    const createEventBtn = document.getElementById('createEvent');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Sửa sự kiện
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editModalOverlay = document.getElementById('editModalOverlay');
    const editEventForm = document.getElementById('editEventForm');
    const editUploadBtn = document.getElementById('editUploadBtn');
    const editFileInput = document.getElementById('editEventImage');
    const editFileName = document.getElementById('editFileName');

    // Mở modal tạo sự kiện
    openModalBtn.addEventListener('click', function() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (step1 && step2) {
            step1.classList.add('active');
            step2.classList.remove('active');
        }
    });

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(event) {
        if (event.target === modalOverlay) closeModal();
    });

    // Upload file
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', function() {
        fileName.textContent = this.files[0] ? this.files[0].name : 'Chưa có ảnh nào được chọn';
    });

    // Step navigation
    if (nextToSocial) {
        nextToSocial.addEventListener('click', function() {
            const eventName = document.getElementById('eventName').value;
            if (!eventName) return alert('Vui lòng nhập tên sự kiện');
            step1.classList.remove('active');
            step2.classList.add('active');
        });
    }
    if (backToStep1) {
        backToStep1.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
        });
    }

    // TẠO SỰ KIỆN (giữ nguyên logic cũ của bạn)
    if (createEventBtn) {
        createEventBtn.addEventListener('click', function() {
            const required = ['eventName','eventStartTime','eventEndTime','registrationDeadline','eventLocation','registrationLink'];
            let valid = true;
            required.forEach(id => {
                if (!document.getElementById(id).value.trim()) valid = false;
            });
            if (!valid) return alert('Vui lòng điền đầy đủ các trường bắt buộc!');

            const newId = 'created-' + Date.now();
            const data = {
                name: document.getElementById('eventName').value.trim(),
                description: document.getElementById('eventDescription').value.trim() || 'Chưa có mô tả',
                startTime: document.getElementById('eventStartTime').value,
                endTime: document.getElementById('eventEndTime').value,
                deadline: document.getElementById('registrationDeadline').value,
                organization: document.getElementById('eventOrganization').value || '-----',
                location: document.getElementById('eventLocation').value.trim(),
                link: document.getElementById('registrationLink').value.trim(),
                image: fileInput.files[0] || null,
                channels: []
            };
            document.querySelectorAll('input[name="socialChannels"]:checked').forEach(cb => {
                data.channels.push(cb.value);
            });

            addEventCardToTab(data, newId);
            alert('Tạo sự kiện thành công!');
            closeModal();
            createForm.reset();
            fileName.textContent = 'Chưa có ảnh nào được chọn';
        });
    }

    // === TẤT CẢ CODE CŨ CỦA BẠN VỀ SỬA, XÓA, DUYỆT, TÌM KIẾM... GIỮ NGUYÊN 100% TỪ ĐÂY TRỞ XUỐNG ===
    // (Mình không sửa gì nữa để giữ nguyên giao diện + chức năng bạn đã làm đẹp rồi)

    // ... TOÀN BỘ CODE CŨ CỦA BẠN (mở modal sửa, duyệt/từ chối, tìm kiếm, xóa, v.v.) ...

    document.querySelector('.logout-btn').addEventListener('click', function() {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});
