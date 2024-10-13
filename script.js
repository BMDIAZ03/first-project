function addTodo() {
    var  todoInput= document.getElementById("todoInpunt");
    var todoList= document.getElementById("todoList");
    var  todoText= todoInput.value;
    
    if (todoText !== '') {
        var listItem = document.createElement('li');
        listItem.textContent = todoText;
        todoList.appendChild(listItem);
        todoInput.value = '';
    }  else{
        alert('error no se puede Guardar tareas vacias');
    }
}

