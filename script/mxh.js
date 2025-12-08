document.addEventListener('DOMContentLoaded', function() {
    // Khai báo tất cả các phần tử
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const createOrgForm = document.getElementById('createOrgForm');

    // Modal sửa
    const editModalOverlay = document.getElementById('editModalOverlay');
    const closeEditBtn = document.getElementById('closeEditBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editOrgForm = document.getElementById('editOrgForm');

    // Modal xác nhận
    const confirmModalOverlay = document.getElementById('confirmModalOverlay');
    const closeConfirmBtn = document.querySelector('.close-confirm-btn');
    const cancelConfirmBtn = document.querySelector('.cancel-confirm-btn');
    const confirmBtn = document.querySelector('.confirm-btn');
    const confirmMessage = document.getElementById('confirmMessage');
    
    let currentCard = null;
    
    // ========== TẠO PHẦN TỬ THÔNG BÁO ==========
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
        `;
        document.body.appendChild(notification);
        return notification;
    }
    
    // Tạo notification element
    const notification = createNotificationElement();
    
    // Hàm hiển thị thông báo
    function showNotification(message, type = 'success') {
        // Đặt màu sắc theo loại thông báo
        const colors = {
            'success': '#4CAF50',
            'error': '#f44336',
            'info': '#2196F3',
            'warning': '#ff9800'
        };
        
        notification.textContent = message;
        notification.style.backgroundColor = colors[type] || colors['success'];
        
        // Hiển thị thông báo
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            hideNotification();
        }, 3000);
    }
    
    // Hàm ẩn thông báo
    function hideNotification() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-100px)';
    }
    
    // ========== MODAL TẠO MỚI ==========
    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });

    function closeModal() {
        modalOverlay.classList.remove('active');
        createOrgForm.reset();
    }

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // ========== MODAL SỬA ==========
    function closeEditModal() {
        editModalOverlay.classList.remove('active');
        editOrgForm.reset();
    }

    closeEditBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);

    editModalOverlay.addEventListener('click', (e) => {
        if (e.target === editModalOverlay) closeEditModal();
    });

    // ========== MODAL XÁC NHẬN ==========
    function showConfirmModal(message) {
        confirmMessage.textContent = message;
        confirmModalOverlay.classList.add('active');
    }

    function hideConfirmModal() {
        confirmModalOverlay.classList.remove('active');
        currentCard = null;
    }

    closeConfirmBtn.addEventListener('click', hideConfirmModal);
    cancelConfirmBtn.addEventListener('click', hideConfirmModal);

    confirmBtn.addEventListener('click', function() {
        if (currentCard) {
            const orgName = currentCard.querySelector('h3').textContent;
            currentCard.remove();
            showNotification(`Đã xóa "${orgName}" thành công!`, 'success');
        }
        hideConfirmModal();
    });

    confirmModalOverlay.addEventListener('click', (e) => {
        if (e.target === confirmModalOverlay) hideConfirmModal();
    });

    // ========== XỬ LÝ FORM TẠO MỚI ==========
    createOrgForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('orgName').value.trim();
        const link = document.getElementById('orgLink').value.trim();
        
        // Kiểm tra dữ liệu
        if (!name || !link) {
            showNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
            return;
        }
        
        // Thêm https:// nếu chưa có
        const fullLink = link.startsWith('http') ? link : `https://${link}`;
        
        createNewSocialMediaCard(name, fullLink);
        showNotification(`Đã tạo "${name}" thành công!`, 'success');
        closeModal();
    });

    // ========== XỬ LÝ FORM CHỈNH SỬA ==========
    if (editOrgForm) {
        editOrgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const id = document.getElementById('editOrgId').value;
            const name = document.getElementById('editOrgName').value.trim();
            const link = document.getElementById('editOrgLink').value.trim();
            
            // Kiểm tra dữ liệu
            if (!name || !link) {
                showNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
                return;
            }
            
            const fullLink = link.startsWith('http') ? link : `https://${link}`;
            updateSocialMediaCard(id, name, fullLink);
            showNotification(`Đã cập nhật "${name}" thành công!`, 'success');
            closeEditModal();
        });
    }

    // ========== XỬ LÝ NÚT TRÊN CARD ==========
    // Xử lý nút xóa ban đầu
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', function() {
            currentCard = this.closest('.card');
            showConfirmModal('Bạn có chắc chắn muốn xóa social media này?');
        });
    });

    // Xử lý nút sửa ban đầu
    document.querySelectorAll('.edit').forEach(button => {
        button.addEventListener('click', function() {
            openEditModal(this);
        });
    });

    // Hàm mở modal sửa
    function openEditModal(editButton) {
        const orgId = editButton.getAttribute('data-org-id');
        const orgName = editButton.getAttribute('data-org-name');
        const orgLink = editButton.getAttribute('data-org-link');
        
        // Điền dữ liệu vào form sửa
        document.getElementById('editOrgId').value = orgId;
        document.getElementById('editOrgName').value = orgName;
        document.getElementById('editOrgLink').value = orgLink;
        
        // Hiển thị modal sửa
        editModalOverlay.classList.add('active');
    }

    // ========== HÀM XỬ LÝ CARD ==========
    // Tạo card mới
    function createNewSocialMediaCard(name, link) {
        const cardsContainer = document.querySelector('.cards');
        const newCard = document.createElement('div');
        newCard.className = 'card';
        
        // Tạo ID duy nhất
        const newId = Date.now() + Math.floor(Math.random() * 1000);
        
        newCard.innerHTML = `
            <h3>${name}</h3>
            <a class="web" href="${link}" target="_blank">${link}</a>
            <div class="actions">
                <button class="edit" data-org-id="${newId}" data-org-name="${name}" data-org-link="${link}">Sửa</button>
                <button class="delete">Xóa</button>
            </div>
        `;
        
        addEventListenersToCard(newCard);
        cardsContainer.appendChild(newCard);
    }

    // Cập nhật card
    function updateSocialMediaCard(id, name, link) {
        // Tìm tất cả các nút sửa
        const allEditButtons = document.querySelectorAll('.edit');
        
        // Tìm nút sửa có đúng ID
        let targetEditButton = null;
        allEditButtons.forEach(button => {
            if (button.getAttribute('data-org-id') === id.toString()) {
                targetEditButton = button;
            }
        });
        
        // Nếu tìm thấy, cập nhật card
        if (targetEditButton) {
            const card = targetEditButton.closest('.card');
            if (card) {
                card.querySelector('h3').textContent = name;
                card.querySelector('.web').textContent = link;
                card.querySelector('.web').href = link;
                
                // Cập nhật data attributes trên nút sửa
                targetEditButton.setAttribute('data-org-name', name);
                targetEditButton.setAttribute('data-org-link', link);
            }
        }
    }

    // Thêm event listeners cho card mới
    function addEventListenersToCard(card) {
        const editBtn = card.querySelector('.edit');
        const deleteBtn = card.querySelector('.delete');
        
        editBtn.addEventListener('click', function() {
            openEditModal(this);
        });
        
        deleteBtn.addEventListener('click', function() {
            currentCard = this.closest('.card');
            showConfirmModal('Bạn có chắc chắn muốn xóa social media này?');
        });
    }

    // ========== PHÍM ESC ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (modalOverlay.classList.contains('active')) {
                closeModal();
            }
            if (editModalOverlay && editModalOverlay.classList.contains('active')) {
                closeEditModal();
            }
            if (confirmModalOverlay.classList.contains('active')) {
                hideConfirmModal();
            }
            // Ẩn thông báo khi nhấn ESC
            hideNotification();
        }
    });

    // Cho phép click để ẩn thông báo sớm
    notification.addEventListener('click', hideNotification);
});

// ========== LOGOUT ==========
document.querySelector('.logout-btn')?.addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});