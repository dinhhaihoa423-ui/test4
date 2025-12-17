document.addEventListener('DOMContentLoaded', function() {
    // ==================== DOM Elements ====================
    const saveSeoBtn = document.getElementById('saveSeoBtn');
    const saveContactBtn = document.getElementById('saveContactBtn');
    const metaTitleInput = document.getElementById('metaTitle');
    const metaDescriptionInput = document.getElementById('metaDescription');
    const metaKeywordsInput = document.getElementById('metaKeywords');
    const contactEmailInput = document.getElementById('contactEmail');
    const contactPhoneInput = document.getElementById('contactPhone');
    const contactAddressInput = document.getElementById('contactAddress');

    const previewTitle = document.querySelector('.preview-title');
    const previewDescription = document.querySelector('.preview-description');

    // ==================== API URL ====================
    const CONTACT_API_URL = 'https://test4-7cop.onrender.com/api/contact';

    // ==================== Load Contact Info từ Backend ====================
    async function loadContactInfo() {
        try {
            const res = await fetch(CONTACT_API_URL);
            if (res.ok) {
                const data = await res.json();
                contactEmailInput.value = data.email || '';
                contactPhoneInput.value = data.phone || '';
                contactAddressInput.value = data.address || '';
            } else {
                console.warn('Không lấy được thông tin liên lạc từ server, dùng giá trị mặc định');
            }
        } catch (err) {
            console.error('Lỗi load thông tin liên lạc:', err);
            showNotification('Không kết nối được server để tải thông tin liên lạc', 'error');
        }
    }

    // ==================== Save Contact Settings lên Backend ====================
    async function saveContactSettings() {
        const contactEmail = contactEmailInput.value.trim();
        const contactPhone = contactPhoneInput.value.trim();
        const contactAddress = contactAddressInput.value.trim();

        // Validate
        if (!isValidEmail(contactEmail)) {
            alert('Vui lòng nhập email hợp lệ!');
            contactEmailInput.focus();
            return;
        }
        if (!isValidPhone(contactPhone)) {
            alert('Vui lòng nhập số điện thoại hợp lệ!');
            contactPhoneInput.focus();
            return;
        }
        if (!contactAddress) {
            alert('Vui lòng nhập địa chỉ!');
            contactAddressInput.focus();
            return;
        }

        try {
            const res = await fetch(CONTACT_API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: contactEmail,
                    phone: contactPhone,
                    address: contactAddress
                })
            });

            if (res.ok) {
                showNotification('Đã lưu thông tin liên hệ thành công!', 'success');
                // Optional: vẫn lưu localStorage làm cache nhanh
                saveToLocalStorage('contactSettings', { contactEmail, contactPhone, contactAddress });
            } else {
                throw new Error('Server trả về lỗi');
            }
        } catch (err) {
            showNotification('Lỗi khi lưu thông tin liên hệ lên server!', 'error');
            console.error(err);
        }
    }

    // ==================== Save SEO Settings (giữ nguyên localStorage) ====================
    function saveSeoSettings() {
        const metaTitle = metaTitleInput.value.trim();
        const metaDescription = metaDescriptionInput.value.trim();
        const metaKeywords = metaKeywordsInput.value.trim();

        if (!metaTitle) {
            alert('Vui lòng nhập tiêu đề meta!');
            metaTitleInput.focus();
            return;
        }
        if (!metaDescription) {
            alert('Vui lòng nhập mô tả meta!');
            metaDescriptionInput.focus();
            return;
        }

        updatePreview();
        console.log('SEO Settings Saved:', { metaTitle, metaDescription, metaKeywords });
        showNotification('Đã lưu cài đặt SEO thành công!', 'success');

        saveToLocalStorage('seoSettings', {
            metaTitle,
            metaDescription,
            metaKeywords
        });
    }

    // ==================== Update Preview ====================
    function updatePreview() {
        const title = metaTitleInput.value || 'Cổng sự kiện festival sinh viên';
        const description = metaDescriptionInput.value || 'Nền tảng cung cấp sự kiện, lễ hội dành cho sinh viên';

        previewTitle.textContent = title;
        previewDescription.textContent = description;
    }

    // ==================== Validation Helpers ====================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^(0|\+84)(\d{9,10})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // ==================== Notification ====================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
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

        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 3000);
    }

    // ==================== localStorage Helpers ====================
    function saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Lỗi lưu localStorage:', error);
        }
    }

    function loadFromLocalStorage() {
        try {
            const seoSettings = localStorage.getItem('seoSettings');
            if (seoSettings) {
                const data = JSON.parse(seoSettings);
                metaTitleInput.value = data.metaTitle || '';
                metaDescriptionInput.value = data.metaDescription || '';
                metaKeywordsInput.value = data.metaKeywords || '';
                updatePreview();
            }

            // Contact sẽ được load từ API, không dùng localStorage nữa (nhưng giữ làm fallback)
            const contactSettings = localStorage.getItem('contactSettings');
            if (contactSettings) {
                const data = JSON.parse(contactSettings);
                if (!contactEmailInput.value) contactEmailInput.value = data.contactEmail || '';
                if (!contactPhoneInput.value) contactPhoneInput.value = data.contactPhone || '';
                if (!contactAddressInput.value) contactAddressInput.value = data.contactAddress || '';
            }
        } catch (error) {
            console.error('Lỗi tải localStorage:', error);
        }
    }

    // ==================== Events ====================
    saveSeoBtn.addEventListener('click', saveSeoSettings);
    saveContactBtn.addEventListener('click', saveContactSettings);

    metaTitleInput.addEventListener('input', updatePreview);
    metaDescriptionInput.addEventListener('input', updatePreview);

    // Phím tắt
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveSeoSettings();
        }
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            saveContactSettings();
        }
    });

    // Dynamic placeholders
    function addDynamicPlaceholders() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
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
    addDynamicPlaceholders();

    // ==================== CSS Animation ====================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ==================== Init ====================
    loadFromLocalStorage();   // SEO + fallback contact
    loadContactInfo();        // Load contact chính từ backend
});

// Logout
document.querySelector('.logout-btn')?.addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});
