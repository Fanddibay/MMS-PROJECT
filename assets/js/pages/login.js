/* ============================================================
   PAGE: Login
   
   Password visibility toggle and form submission for
   the login page.
   
   Dependencies: None (vanilla JS)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Password Visibility Toggle
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#password');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission (redirect for demo)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            
            if (user === 'admin' && pass === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username or password. Try admin/admin.');
            }
        });
    }
});
