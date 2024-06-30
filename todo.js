// Variables
let todoItems = [];
const todoInput = document.querySelector('.todo-input');
const completedTodosDiv = document.querySelector('.completed-todos');
const uncompletedTodosDiv = document.querySelector('.uncompleted-todos');
const audio = new Audio('sound.mp3');
const close = new Audio('close.mp3');

// Get todo list on first boot
window.onload = () => {
    let storageTodoItems = localStorage.getItem('todoItems');
    if (storageTodoItems !== null) {
        todoItems = JSON.parse(storageTodoItems);
    }

    render();
};

// Get the content typed into the input
todoInput.onkeyup = (e) => {
    let value = e.target.value.replace(/^\s+/, '');
    if (value && e.keyCode === 13) { // Enter
        addTodo(value);

        todoInput.value = '';
        todoInput.focus();
    }
};

// Add todo
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveAndRender();
}

// Remove todo
function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id));
    saveAndRender();
}

// Mark as completed
function markAsCompleted(id) {
    todoItems = todoItems.map(todo => {
        if (todo.id === Number(id)) {
            todo.completed = true;
        }
        return todo;
    });

    audio.play();

    saveAndRender();
}

// Mark as uncompleted
function markAsUncompleted(id) {
    todoItems = todoItems.map(todo => {
        if (todo.id === Number(id)) {
            todo.completed = false;
        }
        return todo;
    });

    saveAndRender();
}

// Save in localStorage
function save() {
    localStorage.setItem('todoItems', JSON.stringify(todoItems));
}

// Render
function render() {
    let unCompletedTodos = todoItems.filter(item => !item.completed);
    let completedTodos = todoItems.filter(item => item.completed);

    completedTodosDiv.innerHTML = '';
    uncompletedTodosDiv.innerHTML = '';

    if (unCompletedTodos.length > 0) {
        unCompletedTodos.forEach(todo => {
            uncompletedTodosDiv.append(createTodoListItem(todo));
        });
    } else {
        uncompletedTodosDiv.innerHTML = `<div class="empty">No uncompleted mission</div>`;
    }

    if (completedTodos.length > 0) {
        completedTodosDiv.innerHTML = `<div class="completed-title">Completed (${completedTodos.length} / ${todoItems.length})</div>`;

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoListItem(todo));
        });
    }
}

// Save and Render
function saveAndRender() {
    save();
    render();
}

// Create todo list item
function createTodoListItem(todo) {
    // Create todo list container
    const todoDiv = document.createElement('div');
    todoDiv.setAttribute('data-id', todo.id);
    todoDiv.className = 'todo-item';

    // Create todo item text
    const todoTextSpan = document.createElement('span');
    todoTextSpan.innerHTML = todo.text;

    // Checkbox for list
    const todoInputCheckbox = document.createElement('input');
    todoInputCheckbox.type = 'checkbox';
    todoInputCheckbox.checked = todo.completed;
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id;
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id);
    };

    // Delete button for list
    const todoRemoveBtn = document.createElement('a');
    todoRemoveBtn.innerHTML = `<ion-icon name="close"></ion-icon>`;
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id;
        removeTodo(id);
        close.play();
    };

    todoTextSpan.prepend(todoInputCheckbox);
    todoDiv.appendChild(todoTextSpan);
    todoDiv.appendChild(todoRemoveBtn);

    return todoDiv;
}
