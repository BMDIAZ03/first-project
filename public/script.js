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
            console.log(`Server response: ${response.status}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }
            const newTodo = await response.json();
            console.log(`New todo added: ${JSON.stringify(newTodo)}`);
            const listItem = document.createElement('li');
            const verification = document.createElement('input');
            verification.type = 'checkbox';
            const listItemText = document.createElement('span');
            listItemText.textContent = newTodo.text;
            const buttonDelete = document.createElement('button');
            buttonDelete.textContent = 'Eliminar';
            buttonDelete.classList.add('delete-button');
            buttonDelete.onclick = function() {
                deleteList(newTodo.id, listItem);
            };
            listItem.appendChild(verification);
            listItem.appendChild(listItemText);
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
async function loadList() {
    try {
        const response = await fetch('http://localhost:5500/todos');
        if (!response.ok) throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        const todos = await response.json();
        const todoList = document.getElementById('todoList');
        todos.forEach(todo => {
            const listItem = document.createElement('li');
            const verification = document.createElement('input');
            verification.type = 'checkbox';
            verification.checked = todo.Completed;
            const listItemText = document.createElement('span');
            listItemText.textContent = todo.Text;
            const buttonDelete = document.createElement('button');
            buttonDelete.textContent = 'Eliminar';
            buttonDelete.classList.add('delete-button');
            buttonDelete.onclick = function() {
                deleteList(todo.Id, listItem);
            };
            listItem.appendChild(verification);
            listItem.appendChild(listItemText);
            listItem.appendChild(buttonDelete);
            todoList.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error al cargar las tareas: ${error.message}`);
        alert(`No se pudieron cargar las tareas: ${error.message}`);
    }
}
