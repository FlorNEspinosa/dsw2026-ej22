document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    const tableBody = document.getElementById('tableBody');
    const resultsCount = document.getElementById('resultsCount');
    const storageError = document.getElementById('storageError');

    const totalSpecialties = document.getElementById('totalSpecialties');
    const activeSpecialties = document.getElementById('activeSpecialties');
    const inactiveSpecialties = document.getElementById('inactiveSpecialties');

    function obtenerEspecialidades() {
        storageError.hidden = true;

        try {
            const datos = localStorage.getItem('especialidades');
            const especialidades = datos ? JSON.parse(datos) : [];

            if (!Array.isArray(especialidades)) {
                throw new Error('Los datos no son un array.');
            }

            const datosValidos = especialidades.every((especialidad) => {
                return especialidad &&
                    typeof especialidad.nombre === 'string' &&
                    typeof especialidad.descripcion === 'string' &&
                    (
                        especialidad.estado === 'activo' ||
                        especialidad.estado === 'inactivo'
                    );
            });

            if (!datosValidos) {
                throw new Error('Hay especialidades con formato incorrecto.');
            }

            return especialidades;
        } catch (error) {
            storageError.textContent =
                'No se pudieron leer las especialidades guardadas. ' +
                'Revisá los datos de LocalStorage. No se eliminó ningún registro.';

            storageError.hidden = false;
            return null;
        }
    }

    function normalizarTexto(texto) {
        return texto
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function crearIcono(nombre) {
        const icono = document.createElement('i');

        icono.setAttribute('data-lucide', nombre);
        icono.setAttribute('aria-hidden', 'true');

        return icono;
    }

    function crearBotonAccion(icono, etiqueta) {
        const boton = document.createElement('button');

        boton.type = 'button';
        boton.className = 'icon-btn';
        boton.disabled = true;
        boton.title = etiqueta + ' (pendiente)';
        boton.setAttribute('aria-label', etiqueta);
        boton.appendChild(crearIcono(icono));

        return boton;
    }
    function mostrarMensajeTabla(mensaje) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');

        celda.colSpan = 4;
        celda.className = 'empty-row';
        celda.textContent = mensaje;

        fila.appendChild(celda);
        tableBody.appendChild(fila);
    }

    function mostrarEspecialidades(especialidades) {
        tableBody.replaceChildren();

        if (especialidades.length === 0) {
            return;
        }

        especialidades.forEach((especialidad) => {
            const fila = document.createElement('tr');

            const celdaNombre = document.createElement('td');
            celdaNombre.className = 'col-name';

            const contenedorNombre = document.createElement('div');
            contenedorNombre.className = 'specialty-name';

            const fondoIcono = document.createElement('span');
            fondoIcono.className = 'specialty-icon';
            fondoIcono.appendChild(crearIcono('shapes'));

            const nombre = document.createElement('span');
            nombre.textContent = especialidad.nombre;

            contenedorNombre.appendChild(fondoIcono);
            contenedorNombre.appendChild(nombre);
            celdaNombre.appendChild(contenedorNombre);

            const celdaDescripcion = document.createElement('td');
            celdaDescripcion.textContent = especialidad.descripcion;

            const celdaEstado = document.createElement('td');
            const estado = document.createElement('span');
            const activa = especialidad.estado === 'activo';

            estado.className = activa
                ? 'specialty-state is-active'
                : 'specialty-state is-inactive';

            estado.textContent = activa ? 'Activa' : 'Inactiva';
            celdaEstado.appendChild(estado);

            const celdaAcciones = document.createElement('td');
            const acciones = document.createElement('div');
            acciones.className = 'action-buttons';

            acciones.appendChild(crearBotonAccion('pencil', 'Editar especialidad'));
            acciones.appendChild(crearBotonAccion('trash-2', 'Eliminar especialidad'));
            celdaAcciones.appendChild(acciones);

            fila.appendChild(celdaNombre);
            fila.appendChild(celdaDescripcion);
            fila.appendChild(celdaEstado);
            fila.appendChild(celdaAcciones);

            tableBody.appendChild(fila);
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function actualizarListado() {
        const especialidades = obtenerEspecialidades();

        if (especialidades === null) {
            tableBody.replaceChildren();
            mostrarMensajeTabla('No se pudo cargar el listado.');

            resultsCount.textContent = 'Datos no disponibles';
            totalSpecialties.textContent = '—';
            activeSpecialties.textContent = '—';
            inactiveSpecialties.textContent = '—';
            return;
        }

        const textoBusqueda = normalizarTexto(searchInput.value);

        const resultados = especialidades.filter((especialidad) => {
            return normalizarTexto(especialidad.nombre).includes(textoBusqueda);
        });

        mostrarEspecialidades(resultados);

        if (especialidades.length === 0) {
            mostrarMensajeTabla(
                'Todavía no hay especialidades. Usá “Nueva Especialidad” para agregar una.'
            );
        } else if (resultados.length === 0) {
            mostrarMensajeTabla('No se encontraron especialidades con ese nombre.');
        }

        resultsCount.textContent =
            `Mostrando ${resultados.length} de ${especialidades.length} especialidades`;

        totalSpecialties.textContent = especialidades.length;

        activeSpecialties.textContent = especialidades.filter((especialidad) => {
            return especialidad.estado === 'activo';
        }).length;

        inactiveSpecialties.textContent = especialidades.filter((especialidad) => {
            return especialidad.estado === 'inactivo';
        }).length;
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

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            actualizarListado();
        }
    });

    window.addEventListener('pageshow', () => {
        actualizarListado();
    });

    window.addEventListener('storage', (event) => {
        if (event.key === 'especialidades' || event.key === null) {
            actualizarListado();
        }
    });

    actualizarListado();
});