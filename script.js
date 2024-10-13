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
        listItem.textContent = todoText;
        

        /*crear el boton de eliminar*/
        const buttonDelete = document.createElement('button');
        buttonDelete.textContent = 'Eliminar';
        buttonDelete.onclick = function () {
            todoList.removeChild(listItem);
        }

        
        listItem.appendChild(verification);
        listItem.appendChild(listItemText);
        listItem.appendChild(buttonDelete);
        todoList.appendChild(listItem);

        todoInput.value = '';


    }else{
        alert('error no se puede Guardar tareas vacias');
    }
}

