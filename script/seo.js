document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const saveSeoBtn = document.getElementById('saveSeoBtn');
    const saveContactBtn = document.getElementById('saveContactBtn');
    const metaTitleInput = document.getElementById('metaTitle');
    const metaDescriptionInput = document.getElementById('metaDescription');
    const metaKeywordsInput = document.getElementById('metaKeywords');
    const contactEmailInput = document.getElementById('contactEmail');
    const contactPhoneInput = document.getElementById('contactPhone');
    const contactAddressInput = document.getElementById('contactAddress');
    
    // Lấy các phần tử preview
    const previewTitle = document.querySelector('.preview-title');
    const previewDescription = document.querySelector('.preview-description');

    // Xử lý sự kiện cho nút lưu cài đặt SEO
    saveSeoBtn.addEventListener('click', function() {
        saveSeoSettings();
    });
    
    // Xử lý sự kiện cho nút lưu thông tin liên lạc
    saveContactBtn.addEventListener('click', function() {
        saveContactSettings();
    });
    
    // Cập nhật xem trước khi người dùng nhập
    metaTitleInput.addEventListener('input', function() {
        updatePreview();
    });
    
    metaDescriptionInput.addEventListener('input', function() {
        updatePreview();
    });

    // Hàm lưu cài đặt SEO
    function saveSeoSettings() {
        const metaTitle = metaTitleInput.value;
        const metaDescription = metaDescriptionInput.value;
        const metaKeywords = metaKeywordsInput.value;
        
        // Validate dữ liệu
        if (!metaTitle.trim()) {
            alert('Vui lòng nhập tiêu đề meta!');
            metaTitleInput.focus();
            return;
        }
        
        if (!metaDescription.trim()) {
            alert('Vui lòng nhập mô tả meta!');
            metaDescriptionInput.focus();
            return;
        }
        
        // Cập nhật xem trước
        updatePreview();
        
        // Ở đây bạn có thể gửi dữ liệu lên server
        console.log('SEO Settings Saved:', { 
            metaTitle, 
            metaDescription, 
            metaKeywords 
        });
        
        // Hiển thị thông báo thành công
        showNotification('Đã lưu cài đặt SEO thành công!', 'success');
        
        // Lưu vào localStorage (tùy chọn)
        saveToLocalStorage('seoSettings', {
            metaTitle,
            metaDescription,
            metaKeywords
        });
    }
    
    // Hàm lưu thông tin liên lạc
    function saveContactSettings() {
        const contactEmail = contactEmailInput.value;
        const contactPhone = contactPhoneInput.value;
        const contactAddress = contactAddressInput.value;
        
        // Validate email
        if (!isValidEmail(contactEmail)) {
            alert('Vui lòng nhập email hợp lệ!');
            contactEmailInput.focus();
            return;
        }
        
        // Validate số điện thoại
        if (!isValidPhone(contactPhone)) {
            alert('Vui lòng nhập số điện thoại hợp lệ!');
            contactPhoneInput.focus();
            return;
        }
        
        if (!contactAddress.trim()) {
            alert('Vui lòng nhập địa chỉ!');
            contactAddressInput.focus();
            return;
        }
        
        // Ở đây bạn có thể gửi dữ liệu lên server
        console.log('Contact Info Saved:', { 
            contactEmail, 
            contactPhone, 
            contactAddress 
        });
        
        // Hiển thị thông báo thành công
        showNotification('Đã lưu thông tin liên hệ thành công!', 'success');
        
        // Lưu vào localStorage (tùy chọn)
        saveToLocalStorage('contactSettings', {
            contactEmail,
            contactPhone,
            contactAddress
        });
    }
    
    // Hàm cập nhật preview
    function updatePreview() {
        const title = metaTitleInput.value || 'Cổng sự kiện festival sinh viên';
        const description = metaDescriptionInput.value || 'Nền tảng cung cấp sự kiện, lễ hội dành cho sinh viên';
        
        previewTitle.textContent = title;
        previewDescription.textContent = description;
    }
    
    // Hàm kiểm tra email hợp lệ
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Hàm kiểm tra số điện thoại hợp lệ
    function isValidPhone(phone) {
        const phoneRegex = /^(0|\+84)(\d{9,10})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // Hàm hiển thị thông báo
    function showNotification(message, type = 'info') {
        // Tạo thông báo
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            max-width: 400px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Tự động xóa thông báo sau 3 giây
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // Hàm lưu vào localStorage
    function saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Lỗi khi lưu vào localStorage:', error);
        }
    }
    
    // Hàm tải dữ liệu từ localStorage
    function loadFromLocalStorage() {
        try {
            // Tải cài đặt SEO
            const seoSettings = localStorage.getItem('seoSettings');
            if (seoSettings) {
                const data = JSON.parse(seoSettings);
                metaTitleInput.value = data.metaTitle || '';
                metaDescriptionInput.value = data.metaDescription || '';
                metaKeywordsInput.value = data.metaKeywords || '';
                updatePreview();
            }
            
            // Tải thông tin liên lạc
            const contactSettings = localStorage.getItem('contactSettings');
            if (contactSettings) {
                const data = JSON.parse(contactSettings);
                contactEmailInput.value = data.contactEmail || '';
                contactPhoneInput.value = data.contactPhone || '';
                contactAddressInput.value = data.contactAddress || '';
            }
        } catch (error) {
            console.error('Lỗi khi tải từ localStorage:', error);
        }
    }
    
    // Thêm CSS cho animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Tải dữ liệu đã lưu khi trang được tải
    loadFromLocalStorage();
    
    // Thêm sự kiện cho phím tắt
    document.addEventListener('keydown', function(e) {
        // Ctrl + S để lưu SEO
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveSeoSettings();
        }
        
        // Ctrl + L để lưu thông tin liên lạc
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            saveContactSettings();
        }
    });
    
    // Thêm placeholder động cho các input
    function addDynamicPlaceholders() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Lưu placeholder gốc
            const originalPlaceholder = input.getAttribute('placeholder') || '';
            
            input.addEventListener('focus', function() {
                this.setAttribute('data-original-placeholder', originalPlaceholder);
                this.removeAttribute('placeholder');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.setAttribute('placeholder', this.getAttribute('data-original-placeholder') || '');
                }
            });
        });
    }
    
    // Khởi tạo dynamic placeholders
    addDynamicPlaceholders();
});

document.querySelector('.logout-btn').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});
