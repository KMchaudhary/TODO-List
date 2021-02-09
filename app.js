// VARIABLES
const body = document.querySelector('body')
const todoButton = document.querySelector('.add-btn')
const todoInput = document.querySelector('.todo-input')
const todoList = document.querySelector('.todo-list')
const noteButton = document.querySelector('.add-note-btn')
const note = document.querySelector('.note')
const dateArea = document.querySelector('.date')
const filter = document.querySelector('.filter-todo')

// EVENTS
document.addEventListener('DOMContentLoaded', getTodos)
todoButton.addEventListener('click', addNewTodo)
todoList.addEventListener('click', checkDelete)
noteButton.addEventListener('click', toggleNote)
filter.addEventListener('click',filterTodo)
note.addEventListener('keypress',function(e){
    localStorage.setItem('note',note.children[1].value)
})


// FUNCTIONS
today();
function addNewTodo(event) {
    //Precent form fro submitting
    event.preventDefault();
    if(todoInput.value == "")
        return;
    //todo div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo-item');
    todoList.appendChild(todoDiv);

    //check mark
    const checkMark = document.createElement('button');
    checkMark.innerHTML = '<i class="far fa-square icon"></i>';
    checkMark.classList.add('check-todo');
    todoDiv.appendChild(checkMark);

    //todo
    const todo = document.createElement('li');
    todo.classList.add('todo');
    todo.innerText = todoInput.value;
    todoDiv.appendChild(todo);

    //Add to localstorege
    obj = {
        todo: todoInput.value,
        checked: false
    }
    saveLocalTodos(obj);

    //trash bin
    const deleteTodo = document.createElement('button');
    deleteTodo.innerHTML = '<i class="fas fa-trash"></i>';
    deleteTodo.classList.add('delete-todo');
    todoDiv.appendChild(deleteTodo);

    // cleare todo input
    todoInput.value = "";
}

function checkDelete(e) {
    const item = e.target;

    // cHECKED TODO
    if (item.classList[0] === 'check-todo') {
        const todo = item.parentNode;
        todo.classList.toggle('complete');
        if (!todo.classList.contains('complete')) {
            item.children[0].classList.remove('fas');
            item.children[0].classList.add('far');
            item.children[0].classList.remove('fa-check-square');
            item.children[0].classList.add('fa-square');
            updateTodo(todo.children[1].innerText, false)
        } else {
            item.children[0].classList.remove('far');
            item.children[0].classList.add('fas');
            item.children[0].classList.remove('fa-square');
            item.children[0].classList.add('fa-check-square');
            updateTodo(todo.children[1].innerText, true)
        }
    }

    // DELETE TODO
    if (item.classList[0] === 'delete-todo') {
        const todo = item.parentNode;
        //Animate todo
        todo.classList.add('fall');
        //delete todo from localStorage
        removeLocalTodos(todo);
        //delete todo
        todo.addEventListener('transitionend', function () {
            todo.remove();
        })
    }
}

function toggleNote() {
    noteButton.children[0].classList.toggle('fas')
    note.classList.toggle('display-note');
}

function saveLocalTodos(todo) {
    // Check -- hey do I have already things in there
    let todos;
    if (localStorage.getItem('todos') == null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    // Check -- hey do I have already things in there
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    // check for note
    let noteLocal;
    if(localStorage.getItem('note') === null) {
        noteLocal = "";
    } else {
        noteLocal = localStorage.getItem('note');
    }
    note.children[1].value = noteLocal;

    todos.forEach(function (todoItem) {
        //todo div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo-item');
        todoList.appendChild(todoDiv);

        //check mark
        const checkMark = document.createElement('button');
        checkMark.innerHTML = '<i class="far fa-square icon"></i>';
        checkMark.classList.add('check-todo');
        todoDiv.appendChild(checkMark);
        if (todoItem.checked === true) {
            checkMark.innerHTML = '<i class="fas fa-check-square icon"></i>';
            todoDiv.classList.add('complete');
        }

        //todo
        const todo = document.createElement('li');
        todo.classList.add('todo');
        todo.innerText = todoItem.todo;
        todoDiv.appendChild(todo);

        //trash bin
        const deleteTodo = document.createElement('button');
        deleteTodo.innerHTML = '<i class="fas fa-trash"></i>';
        deleteTodo.classList.add('delete-todo');
        todoDiv.appendChild(deleteTodo);
    })
}

function removeLocalTodos(todo) {
    // Check -- hey do I have already things in there
    let todos;
    if (localStorage.getItem('todos') == null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    for (let i = 0; i < todos.length; i++) {
        if (todos[i].todo === todo.children[1].innerText) {
            todos.splice(i,1);
        }
    }

    //todos.splice(todos.indexOf(todoIndex), 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateTodo(val, bool) {
    // Check -- hey do I have already things in there
    console.log(val, bool)
    let todos;
    if (localStorage.getItem('todos') == null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    for (let i = 0; i < todos.length; i++) {
        if (todos[i].todo === val) {
            todos[i].checked = bool;
        }
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}

function filterTodo(e){
    console.log("event");
    const todos = todoList.childNodes;
    console.log(todos);
    todos.forEach(function(todo){
        console.log(todo);
        switch(e.target.value) {
            case 'all':
                todo.style.display= "flex";
                break;
            case 'completed':
                if(todo.classList.contains('complete')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case 'pendding':
                if(!todo.classList.contains('complete')) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    })
}

function today() {
    const options = {day: 'numeric', year: 'numeric', month: 'long'};
    let date = new Date();
    let day = date.getDay();
    dateArea.innerText = date.toLocaleDateString(undefined,options);
    switch (day) {
        case 0:
            body.classList.add('sunday');
            break;
        case 1:
            body.classList.add('monday');
            break;
        case 2:
            body.classList.add('tuesday');
            break;
        case 3:
            body.classList.add('wednesday');
            break;
        case 4:
            body.classList.add('thrusday');
            break;
        case 5:
            body.classList.add('friday');
            break;
        case 6:
            body.classList.add('saturday');
            break;
    }
}
