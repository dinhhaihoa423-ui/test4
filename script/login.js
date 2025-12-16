function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.src = "picture/eye.png";
    } else {
        passwordInput.type = "password";
        toggleIcon.src = "picture/eye-off.png";
    }
}

// Thêm event listener khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById("password");
    const emailInput = document.querySelector('input[type="email"]');
    const loginBtn = document.querySelector('.login-btn');

    // Nhấn Enter để đăng nhập
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });

    // Xử lý click nút đăng nhập
    loginBtn.addEventListener('click', function(e) {
        if (!validateForm()) {
            e.preventDefault(); // Ngăn chuyển hướng nếu validate thất bại
        }
        // Nếu validate thành công thì tự động chuyển hướng qua thẻ <a> bao ngoài button
    });

    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Kiểm tra email rỗng
        if (!email) {
            alert('Vui lòng nhập email!');
            emailInput.focus();
            return false;
        }

        // Kiểm tra định dạng email
        if (!isValidEmail(email)) {
            alert('Vui lòng nhập email hợp lệ!');
            emailInput.focus();
            return false;
        }

        // Kiểm tra mật khẩu rỗng
        if (!password) {
            alert('Vui lòng nhập mật khẩu!');
            passwordInput.focus();
            return false;
        }

        // Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            passwordInput.focus();
            return false;
        }

        // === TÀI KHOẢN ĐĂNG NHẬP ĐỊNH NGHĨA SẴN ===
        const validEmail = "admin@gmail.com";    // Thay đổi email nếu muốn
        const validPassword = "123456";            // Thay đổi mật khẩu nếu muốn

        if (email !== validEmail || password !== validPassword) {
            alert('Email hoặc mật khẩu không đúng!');
            passwordInput.focus();
            return false;
        }

        // Đăng nhập thành công
        alert('Đăng nhập thành công! Chào mừng bạn.');
        return true; // Cho phép chuyển hướng đến tke.html
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
