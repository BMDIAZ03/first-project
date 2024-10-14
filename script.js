document.addEventListener('DOMContentLoaded', () =>{
    loadTodos();
})

function addTodo() {
    const  todoInput= document.getElementById("todoInpunt");
    const todoList= document.getElementById("todoList");
    const  todoText= todoInput.value;
    
    if (todoText !== '') {

        /*se creo un li de la lista de tarea*/ 
        const listItem = document.createElement('li');

        /*crear el checkbox para ponerlo como realizada */
        const verification = document.createElement('input');
        verification.type = 'checkbox';
        
        const listItemText = document.createElement('span');
        listItemText.textContent = todoText;
        

        /*crear el boton de eliminar*/
        const buttonDelete = document.createElement('button');
        buttonDelete.textContent = 'Eliminar';
        buttonDelete.classList.add('delete-button');
        buttonDelete.onclick = function () {
            todoList.removeChild(listItem);
            saveTodos();
        }

        
        listItem.appendChild(verification);
        listItem.appendChild(listItemText);
        listItem.appendChild(buttonDelete);
        todoList.appendChild(listItem);

        todoInput.value = '';
        saveTodos();


    }else{
        alert('error no se puede Guardar tareas vacias');
    }
}

function saveTodos() {
    const todoList = document.getElementById('todoList');
    const todos = todoList.innerHTML;
    localStorage.setItem('todos',todos);
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = savedTodos;
        todoList.querySelectorAll('.delete-button').forEach(button => {
            button.onclick = function() {
                const listItem = button.parentNode;
                todoList.removeChild(listItem);
                saveTodos();
            };
        });
    }
}