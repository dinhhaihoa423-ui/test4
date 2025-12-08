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

// Thêm event listener cho phím Enter
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById("password");
    const emailInput = document.querySelector('input[type="email"]');
    const loginBtn = document.querySelector('.login-btn');
    
    // Enter để đăng nhập
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
    
    // Validate form trước khi đăng nhập
    loginBtn.addEventListener('click', function(e) {
        if (!validateForm()) {
            e.preventDefault();
        }
    });
    
    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email) {
            alert('Vui lòng nhập email!');
            emailInput.focus();
            return false;
        }
        
        if (!isValidEmail(email)) {
            alert('Vui lòng nhập email hợp lệ!');
            emailInput.focus();
            return false;
        }
        
        if (!password) {
            alert('Vui lòng nhập mật khẩu!');
            passwordInput.focus();
            return false;
        }
        
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            passwordInput.focus();
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});