const loginsec = document.querySelector('.login-section');
const loginForm = document.querySelector('.form-box.login');
const registerForm = document.querySelector('.form-box.register');
const loginlink = document.querySelector('.login-link');
const registerlink = document.querySelector('.register-link');

registerlink.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
});

loginlink.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
});
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value) {
            this.classList.add('not-empty');
        } else {
            this.classList.remove('not-empty');
        }
    });
});

