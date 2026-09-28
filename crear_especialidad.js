document.addEventListener('DOMContentLoaded', () => {

    if (window.lucide) {
        lucide.createIcons();
    }

    // --- LÓGICA DEL MENÚ ---
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('nav');
    const logoutButton = document.getElementById('logout');

    function cerrarMenu() {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Abrir menú');
    }

    if (menuBtn && nav) {
        menuBtn.addEventListener('click', (event) => {
            if (window.innerWidth < 600) {
                const abierto = nav.classList.toggle('open');
                menuBtn.setAttribute('aria-expanded', String(abierto));
                menuBtn.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
                event.stopPropagation(); // Evita que se cierre inmediatamente
            }
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (event) => {
            if (window.innerWidth < 600 && nav.classList.contains('open') && !nav.contains(event.target)) {
                cerrarMenu();
            }
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 600) {
            cerrarMenu();
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    // --- LÓGICA DEL FORMULARIO ---
    const form = document.getElementById('createSpecialtyForm');
    const btnCancel = document.getElementById('btnCancel');

    if (btnCancel) {
        btnCancel.addEventListener('click', function () {
            if (confirm('¿Estás seguro que deseas cancelar? Se perderán los datos ingresados.')) {
                form.reset();
            }
        });
    }

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const nombre = document.getElementById('specialtyName').value.trim();
            const descripcion = document.getElementById('specialtyDesc').value.trim();
            const estado = document.getElementById('specialtyStatus').value;

            if (nombre === "" || descripcion === "") {
                alert("Completa el nombre y la descripción de la especialidad.");
                return;
            }

            const nuevaEspecialidad = {
                id: Date.now(),
                nombre: nombre,
                descripcion: descripcion,
                estado: estado
            };

            let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
            especialidades.push(nuevaEspecialidad);
            localStorage.setItem('especialidades', JSON.stringify(especialidades));
            alert(`La especialidad "${nombre}" se guardó correctamente`);
            form.reset();
        });
    }
});