document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    const tableBody = document.getElementById('tableBody');
    const paginationContainer = document.querySelector('.pagination');
    const resultsCount = document.getElementById('resultsCount');
    const errorMessage = document.getElementById('storageError');

    const totalSpecialties = document.getElementById('totalSpecialties');
    const activeSpecialties = document.getElementById('activeSpecialties');
    const inactiveSpecialties = document.getElementById('inactiveSpecialties');

    let especialidades = [];
    let datosCargados = false;

    let currentPage = 1;
    const pageSize = 5;

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
                const nombre = document.createElement('span');
                nombre.className = 'specialty-name';
                nombre.textContent = especialidad.name;
                celdaNombre.appendChild(nombre);

                const celdaDescripcion = document.createElement('td');
                celdaDescripcion.textContent = especialidad.description;

                const celdaEstado = document.createElement('td');
                const badgeEstado = document.createElement('span');
                badgeEstado.className = `specialty-state ${especialidad.estado === 'activo' ? 'is-active' : 'is-inactive'}`;
                badgeEstado.textContent = especialidad.estado === 'activo' ? 'Activa' : 'Inactiva';
                celdaEstado.appendChild(badgeEstado);

                const celdaAcciones = document.createElement('td');
                celdaAcciones.innerHTML = `
                <div class="action-buttons">
                    <button type="button" class="icon-btn" aria-label="Editar">
                        <i data-lucide="pencil" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="icon-btn" aria-label="Eliminar">
                        <i data-lucide="trash-2" aria-hidden="true"></i>
                    </button>
                </div>
            `;

            fila.appendChild(celdaNombre);
            fila.appendChild(celdaDescripcion);
            fila.appendChild(celdaEstado);
            fila.appendChild(celdaAcciones);
            tableBody.appendChild(fila);
            });
        if (window.lucide) lucide.createIcons();
    }
    function renderizarPaginacion(totalPages) {
        if (!paginationContainer) return;
        paginationContainer.replaceChildren();

        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.disabled = currentPage === 1 || totalPages === 0;
        prevBtn.innerHTML = '<i data-lucide="chevron-left" aria-hidden="true"></i>';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) { currentPage--; actualizarListado(); }
        });
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = i;

            if (i === currentPage) {
                btn.style.backgroundColor = '#e4f6fc';
                btn.style.color = '#07518c';
                btn.style.borderColor = '#07518c';
                btn.style.fontWeight = 'bold';
            }

            btn.addEventListener('click', () => {
                currentPage = i;
                actualizarListado();
            });

            paginationContainer.appendChild(btn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        nextBtn.innerHTML = '<i data-lucide="chevron-right" aria-hidden="true"></i>';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) { currentPage++; actualizarListado(); }
        });
        paginationContainer.appendChild(nextBtn);

        if (window.lucide) lucide.createIcons();
    }

    function actualizarListado() {
        if (!datosCargados) {
            return;
        }

        const busqueda = normalizarTexto(searchInput.value);
        const resultados = especialidades.filter((especialidad) => {
            return normalizarTexto(especialidad.name).includes(busqueda);
        });
        const totalPages = Math.ceil(resultados.length / pageSize) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * pageSize;
        const resultadosPaginados = resultados.slice(startIndex, startIndex + pageSize);

        mostrarEspecialidades(resultadosPaginados);
        renderizarPaginacion(totalPages);

        resultsCount.textContent = `Mostrando ${resultadosPaginados.length} de ${resultados.length} resultados filtrados`;
        totalSpecialties.textContent = especialidades.length;

        const activos = especialidades.filter(e => e.estado === 'activo').length;
        activeSpecialties.textContent = activos;
        inactiveSpecialties.textContent = especialidades.length - activos;
        }

    async function cargarEspecialidades() {
        errorMessage.hidden = true;
    //?    mostrarMensajeTabla('Cargando especialidades...');

        try {
            especialidades = StorageManager.getSpecialties();
            datosCargados = true;
            actualizarListado();

        } catch (error) {
            errorMessage.textContent = 'Hubo un problema al cargar los datos del almacenamiento local.';
            errorMessage.hidden = false;

            mostrarMensajeTabla('No se pudo cargar el listado.');
        }
    }

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentPage = 1;
        actualizarListado();
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        currentPage = 1;
        actualizarListado();
        searchInput.focus();
    });
    cargarEspecialidades();
});