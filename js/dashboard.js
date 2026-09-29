document.addEventListener('DOMContentLoaded', () => {

    if (window.lucide) {
        lucide.createIcons();
    }

   
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('nav');
    const logoutButton = document.getElementById('logout');
    const opciones = document.querySelectorAll('.nav-links a');

    
    function cerrarMenu() {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Abrir menú');
    }

    
    menuBtn.addEventListener('click', () => {
        if (window.innerWidth < 600) {
            const abierto = nav.classList.toggle('open');

            menuBtn.setAttribute('aria-expanded', String(abierto));
            menuBtn.setAttribute(
                'aria-label',
                abierto ? 'Cerrar menú' : 'Abrir menú'
            );
        }
    });

    
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 600) {
            cerrarMenu();
        }
    });

    
    opciones.forEach((opcion) => {
        opcion.addEventListener('click', (event) => {
            
            if (opcion.getAttribute('href') === '#') {
                event.preventDefault();
            }

            opciones.forEach((item) => {
                item.classList.remove('active');
            });

            opcion.classList.add('active');

            
            if (window.innerWidth < 600) {
                cerrarMenu();
            }
        });
    });

  logoutButton.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
});