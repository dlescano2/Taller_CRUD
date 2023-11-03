document.addEventListener('DOMContentLoaded', function () {
    //BUSCAR REGISTRO
    const btnGet = document.getElementById('btnGet1');
    const inputGetId = document.getElementById('inputGet1Id');
    const resultsContainer = document.getElementById('results');
    const usersURL = "https://6542afe6ad8044116ed3c4b9.mockapi.io/users";

    btnGet.addEventListener('click', function () {
        const userId = inputGetId.value;
        const apiUrl = userId ? `https://6542afe6ad8044116ed3c4b9.mockapi.io/users/${userId}` : 'https://6542afe6ad8044116ed3c4b9.mockapi.io/users';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de conexión');
                }
                return response.json();
            })
            .then(data => {
                // Mostrar los resultados
                displayResults(Array.isArray(data) ? data : [data]);
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                displayError();
            });
    });

    // Función para mostrar resultados
    function displayResults(data) {
        resultsContainer.innerHTML = '';

        data.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            
            const idDiv = document.createElement('div');
            idDiv.textContent = `ID: ${item.id}`;
            listItem.appendChild(idDiv);
    
            const nameDiv = document.createElement('div');
            nameDiv.textContent = `Nombre: ${item.name}`;
            listItem.appendChild(nameDiv);
    
            const lastnameDiv = document.createElement('div');
            lastnameDiv.textContent = `Apellido: ${item.lastname}`;
            listItem.appendChild(lastnameDiv);            
            
            resultsContainer.appendChild(listItem);
        });
    }

    // Función para mostrar mensaje de error
    function displayError() {
        resultsContainer.innerHTML = '';

        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger';
        errorAlert.textContent = '¡Algo salió mal al obtener los datos!';
        resultsContainer.appendChild(errorAlert);
    }

    // Función para configurar la habilitación/deshabilitación de botones
    function setupButton(inputElement, buttonElement) {
        buttonElement.disabled = true;

        inputElement.addEventListener('input', function () {
            buttonElement.disabled = !inputElement.value;
        });
    }

    // INGRESAR NUEVO REGISTRO
    const btnPost = document.getElementById('btnPost');
    const inputPostNombre = document.getElementById('inputPostNombre');
    const inputPostApellido = document.getElementById('inputPostApellido');

    setupButton(inputPostNombre, btnPost);
    setupButton(inputPostApellido, btnPost);

    btnPost.addEventListener('click', function () {
        const nombre = inputPostNombre.value;
        const apellido = inputPostApellido.value;

        if (nombre && apellido) {
            const newData = {
                name: nombre,
                lastname: apellido
            };

            fetch(usersURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de conexión');
                }
                return response.json();
            })
            .then(data => {
                return fetch(usersURL);
            })
            .then(response => response.json())
            .then(data => {
                displayResults(data);
            })
            .catch(error => {
                console.error('Error de conexión o al cargar los datos:', error);
                displayError();
            })
            .finally(() => {
                inputPostNombre.value = '';
                inputPostApellido.value = '';
                btnPost.disabled = true;
            });
        }
    });

    // MODIFICAR REGISTRO
    const btnPut = document.getElementById('btnPut');
    const inputPutId = document.getElementById('inputPutId');
    const inputPutNombre = document.getElementById('inputPutNombre');
    const inputPutApellido = document.getElementById('inputPutApellido');
    const btnSendChanges = document.getElementById('btnSendChanges');
    const dataModal = new bootstrap.Modal(document.getElementById('dataModal'));

    setupButton(inputPutId, btnPut);

    btnPut.addEventListener('click', function () {
        const userId = inputPutId.value;
        const apiUrl = `https://6542afe6ad8044116ed3c4b9.mockapi.io/users/${userId}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error de conexión');
                }
                return response.json();
            })
            .then(data => {
                // Abrir el modal y cargar los datos existentes
                inputPutNombre.value = data.name || '';
                inputPutApellido.value = data.lastname || '';
                btnSendChanges.disabled = false;
                dataModal.show();
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                displayError();
            });
    });

    btnSendChanges.addEventListener('click', function () {
        const userId = inputPutId.value;
        const apiUrl = `https://6542afe6ad8044116ed3c4b9.mockapi.io/users/${userId}`;

        const updatedData = {
            name: inputPutNombre.value,
            lastname: inputPutApellido.value
        };

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de conexión');
            }
            return response.json();
        })
        .then(data => {
            // Cerrar el modal y actualizar la lista de registros
            dataModal.hide();
            return fetch(usersURL);
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error de conexión o al cargar los datos:', error);
            displayError();
        });
    });

    // ELIMINAR REGISTRO
    const btnDelete = document.getElementById('btnDelete');
    const inputDelete = document.getElementById('inputDelete');

    setupButton(inputDelete, btnDelete);

    btnDelete.addEventListener('click', function () {
        const userId = inputDelete.value;
        const apiUrl = `https://6542afe6ad8044116ed3c4b9.mockapi.io/users/${userId}`;

        fetch(apiUrl, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error de conexión');
            }
            return response.json();
        })
        .then(data => {
            // Actualizar la lista de registros después de eliminar
            return fetch(usersURL);
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error de conexión o al cargar los datos:', error);
            displayError();
        })
        .finally(() => {
            // Limpiar el campo de input y deshabilitar el botón después de eliminar
            inputDelete.value = '';
            btnDelete.disabled = true;
        });
    });
});