document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();

    const form = document.querySelector('form');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const usernameInput = document.getElementById('username');
    const errorMessage = document.getElementById('error-message');

    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
            } else {
                passwordInput.type = 'password';
            }
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Aquí puedes agregar la lógica para validar el usuario y la contraseña
        if(username === 'admin' && password === 'password') {
            // Redirigir a la página de productos o dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
        if (errorMessage) {
            errorMessage.innerText = "Usuario o contraseña incorrectos";
        }
    });
});