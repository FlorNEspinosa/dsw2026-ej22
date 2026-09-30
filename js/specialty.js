document.addEventListener('DOMContentLoaded', () => {

    if (window.lucide) {
        lucide.createIcons();
    }

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
                event.stopPropagation(); 
            }
        });

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

    const form = document.getElementById('createSpecialtyForm');
    const btnCancel = document.getElementById('btnCancel');

    const nameInput = document.getElementById('specialtyName');
    const descriptionInput = document.getElementById('specialtyDesc');
    const statusInput = document.getElementById('specialtyStatus');

    const nameError = document.getElementById('nameError');
    const descriptionError = document.getElementById('descriptionError');

    function limpiarErrores() {
        nameError.textContent = '';
        descriptionError.textContent = '';
    }

    btnCancel.addEventListener('click', () => {
        if (confirm('¿Querés cancelar? Se perderán los datos ingresados.')) {
            form.reset();
            limpiarErrores();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores();

        const nombre = nameInput.value.trim();
        const descripcion = descriptionInput.value.trim();

        let hayErrores = false;

        if (nombre === '') {
            nameError.textContent = 'El nombre es obligatorio.';
            hayErrores = true;
        } else if (nombre.length > 15) {
            nameError.textContent = 'El nombre no puede superar los 15 caracteres.';
            hayErrores = true;
        }

        if (descripcion === '') {
            descriptionError.textContent = 'La descripción es obligatoria.';
            hayErrores = true;
        } else if (descripcion.length > 100) {
            descriptionError.textContent = 'La descripción no puede superar los 100 caracteres.';
            hayErrores = true;
        }

        if (hayErrores) {
            return;
        }
        const nuevaEspecialidad = {
            id: crypto.randomUUID(),
            name: nombre,
            description: descripcion,
            estado: statusInput.value
        };
        StorageManager.addSpecialty(nuevaEspecialidad);
        alert('Especialidad creada con éxito.');
        window.location.href = 'lista_especialidades.html';
    });
});