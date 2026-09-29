document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    const tableBody = document.getElementById('tableBody');
    const resultsCount = document.getElementById('resultsCount');
    const errorMessage = document.getElementById('storageError');

    const totalSpecialties = document.getElementById('totalSpecialties');
    const activeSpecialties = document.getElementById('activeSpecialties');
    const inactiveSpecialties = document.getElementById('inactiveSpecialties');

    let especialidades = [];
    let datosCargados = false;

    activeSpecialties.textContent = '—';
    inactiveSpecialties.textContent = '—';
    totalSpecialties.textContent = '—';
    
    function normalizarTexto(texto) {
        return texto
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function mostrarMensajeTabla(mensaje) {
        tableBody.replaceChildren();

        const fila = document.createElement('tr');
        const celda = document.createElement('td');

        celda.colSpan = 2;
        celda.className = 'empty-row';
        celda.textContent = mensaje;

        fila.appendChild(celda);
        tableBody.appendChild(fila);
    }

    function mostrarEspecialidades(lista) {
        tableBody.replaceChildren();

        if (lista.length === 0) {
            mostrarMensajeTabla('No se encontraron especialidades.');
            return;
        }

            lista.forEach((especialidad) => {
                const fila = document.createElement('tr');
                const celdaNombre = document.createElement('td');
                const celdaDescripcion = document.createElement('td');

                const nombre = document.createElement('span');
                nombre.className = 'specialty-name';
                nombre.textContent = especialidad.name;

                celdaNombre.appendChild(nombre);
                celdaDescripcion.textContent = especialidad.description;

            fila.appendChild(celdaNombre);
            fila.appendChild(celdaDescripcion);
            tableBody.appendChild(fila);
        });
    }

    function actualizarListado() {
        if (!datosCargados) {
            return;
        }

        const busqueda = normalizarTexto(searchInput.value);
        const resultados = especialidades.filter((especialidad) => {
            return normalizarTexto(especialidad.name).includes(busqueda);
        });

        mostrarEspecialidades(resultados);

        resultsCount.textContent = `Mostrando ${resultados.length} de ${especialidades.length} especialidades`;
        totalSpecialties.textContent = especialidades.length;
        }

    async function cargarEspecialidades() {
        errorMessage.hidden = true;
        mostrarMensajeTabla('Cargando especialidades...');

        try {
            const respuesta = await fetch('./data/specialties.json');

            if (!respuesta.ok) {
                throw new Error('No se pudo cargar specialties.json.');
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos) || !datos.every((item) =>
                item &&
                typeof item.name === 'string' &&
                typeof item.description === 'string'
            )) {
                throw new Error('El JSON no tiene el formato esperado.');
               }

            especialidades = datos;
            datosCargados = true;
            actualizarListado();

        } catch (error) {
            errorMessage.textContent = 'No se pudieron cargar las especialidades. Revisá el archivo specialties.json y abrí la página desde localhost.';
            errorMessage.hidden = false;

            mostrarMensajeTabla('No se pudo cargar el listado.');

            resultsCount.textContent = 'Datos no disponibles';

            console.error(error);
        }
    }

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        actualizarListado();
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        actualizarListado();
        searchInput.focus();
    });
    cargarEspecialidades();
});