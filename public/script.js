document.addEventListener('DOMContentLoaded', () => { 
    loadList();
});

async function addList() {
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const todoText = todoInput ? todoInput.value : '';
    console.log(`Todo text: ${todoText}`);
    if (todoText !== '') {
        try {
            const response = await fetch('http://localhost:5500/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({ text: todoText, completed: false })
            });
            const newTodo = await response.json();
            console.log(`New todo added: ${JSON.stringify(newTodo)}`);
            const listItem = document.createElement('li');
            const verification = document.createElement('input');
            verification.type = 'checkbox';
            verification.checked = newTodo.completed;
            verification.addEventListener('change', async function () {
                // Actualiza el estado de la tarea cuando se cambia el checkbox
                await fetch(`http://localhost:5500/todos/${newTodo.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({ text: newTodo.text, completed: this.checked })
                });
            });
            const listItemText = document.createElement('span');
            listItemText.textContent = newTodo.text;

            // Crear el contenedor para los botones
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('task-buttons');

            // Boton de elimminar
            const buttonDelete = document.createElement('button');
            buttonDelete.textContent = 'Eliminar';
            buttonDelete.classList.add('delete-button');
            buttonDelete.onclick = function() {
                deleteList(newTodo.id, listItem);
            };

            // Boton de editar 
            const buttonEdit = document.createElement('button');
            buttonEdit.textContent = 'Editar';
            buttonEdit.classList.add('edit-button');
            buttonEdit.onclick = function() {
                editList(newTodo.id, listItemText);
            };

            // Añadir botones al contenedor
            buttonContainer.appendChild(buttonEdit);
            buttonContainer.appendChild(buttonDelete);

            listItem.appendChild(verification);
            listItem.appendChild(listItemText);
            listItem.appendChild(buttonEdit);
            listItem.appendChild(buttonDelete);
            todoList.appendChild(listItem);
            todoInput.value = '';
        } catch (error) {
            console.error(`Error al añadir la tarea: ${error.message}`);
            alert(`No se pudo añadir la tarea: ${error.message}`);
        }
    } else {
        alert('Error: no se pueden guardar tareas vacías');
    }
}

async function deleteList(id, listItem) {
    try {
        const response = await fetch(`http://localhost:5500/todos/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }
        listItem.remove();
    } catch (error) {
        console.error(`Error al eliminar la tarea: ${error.message}`);
        alert(`No se pudo eliminar la tarea: ${error.message}`);
    }
}

async function editList(id, listItemText) {
    const newText = prompt('Editar tarea:', listItemText.textContent);
    if (newText !== null) {
        try {
            const response = await fetch(`http://localhost:5500/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({ text: newText,completed: false})
            });
            listItemText.textContent = newText;
        } catch (error) {
            console.error(`Error al editar la tarea: ${error.message}`);
            alert(`No se pudo editar la tarea: ${error.message}`);
        }
    }
}

async function loadList() {
    try {
        const response = await fetch('http://localhost:5500/todos');
        if (!response.ok) throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        const todos = await response.json();
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';  // Limpia la lista antes de cargar los datos
        todos.forEach(todo => {
            const listItem = document.createElement('li');
            const verification = document.createElement('input');
            verification.type = 'checkbox';
            verification.checked = todo.Completed;  // Asegúrate de que se usa la propiedad correcta
            verification.addEventListener('change', async function () {
                // Actualiza el estado de la tarea cuando se cambia el checkbox
                try {
                    const response = await fetch(`http://localhost:5500/todos/${todo.Id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: JSON.stringify({ text: todo.TaskText, completed: this.checked })
                    });
                    if (!response.ok) throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
                } catch (error) {
                    console.error(`Error al actualizar el estado de la tarea: ${error.message}`);
                    alert(`No se pudo actualizar el estado de la tarea: ${error.message}`);
                }
            });
            const listItemText = document.createElement('span');
            listItemText.textContent = todo.TaskText;  // Asegúrate de que se usa la propiedad correcta
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('task-buttons');
            const buttonDelete = document.createElement('button');
            buttonDelete.textContent = 'Eliminar';
            buttonDelete.classList.add('delete-button');
            buttonDelete.onclick = function() {
                deleteList(todo.Id, listItem);
            };
            const buttonEdit = document.createElement('button');
            buttonEdit.textContent = 'Editar';
            buttonEdit.classList.add('edit-button');
            buttonEdit.onclick = function() {
                editList(todo.Id, listItemText);
            };
            buttonContainer.appendChild(buttonEdit);
            buttonContainer.appendChild(buttonDelete);
            listItem.appendChild(verification);
            listItem.appendChild(listItemText);
            listItem.appendChild(buttonContainer);
            todoList.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error al cargar las tareas: ${error.message}`);
        alert(`No se pudieron cargar las tareas: ${error.message}`);
    }
}
