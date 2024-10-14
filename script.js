// para cunado cargue la pantalla, me devuelva los datos guardados
document.addEventListener('DOMContentLoaded', () =>{
    loadlist();
});

// funcion principal de la creacion de las tareas
function addList() {
    const  todoInput= document.getElementById("todoInpunt");
    const todoList= document.getElementById("todoList");
    const  todoText= todoInput.value;
    
    if (todoText !== '') {

        /*se creo un li de la lista de tarea*/ 
        const listItem = document.createElement('li');

        /*crear el checkbox para ponerlo como realizada */
        const verification = document.createElement('input');
        verification.type = 'checkbox';

        /*se crea un span para separar cada tarea*/ 
        const listItemText = document.createElement('span');
        listItemText.textContent = todoText;
        
        /*crear el boton de eliminar*/
        const buttonDelete = document.createElement('button');
        buttonDelete.textContent = 'Eliminar';
        buttonDelete.classList.add('delete-button');
        buttonDelete.onclick = function () {
            todoList.removeChild(listItem);
            saveList();
        }

        /*se agregan todos los elementos a la lista de tareas como hijos
        */
        listItem.appendChild(verification);
        listItem.appendChild(listItemText);
        listItem.appendChild(buttonDelete);
        todoList.appendChild(listItem);

        //se limpia el campo de text
        todoInput.value = ''; 

        //se guarda todas las tareas
        saveList();


    }else{
        //alert para el ususario
        alert('error no se puede Guardar tareas vacias');
    }
}

function saveList() {
    const todoList = document.getElementById('todoList');
    const todos = todoList.innerHTML;
    localStorage.setItem('todos',todos);
}

function loadlist() {
    //recuperamos los valores guardados
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        const todoList = document.getElementById('todoList');

        // damos valor a el html, con los datos guardados
        todoList.innerHTML = savedTodos;

        // selecion de todos los elementos y le damos funcion 
        todoList.querySelectorAll('.delete-button').forEach(button => {
            button.onclick = function() {
                const listItem = button.parentNode;
                todoList.removeChild(listItem);
                saveList();
            };
        });
    }
}º