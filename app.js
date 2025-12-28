const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

let todos = [];
let currentFilter = "all";

// Load todos
const saved = localStorage.getItem("todos");
if (saved) {
    todos = JSON.parse(saved);
}
remaining.innerHTML = todos.filter(t => !t.isCompleted).length;


// ---------------- HELPERS ----------------
function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
    remaining.innerHTML = todos.filter(t => !t.isCompleted).length;
}

function getFiltered() {
    if (currentFilter === "active") return todos.filter(t => !t.isCompleted);
    if (currentFilter === "completed") return todos.filter(t => t.isCompleted);
    return todos;
}


// ---------------- RENDER ----------------
function populateTodos() {
    let html = "";

    for (const todo of getFiltered()) {
        html += `
        <li class="todo-item ${todo.isCompleted ? "completed" : ""}" data-id="${todo.id}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""}>
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`;
    }

    todoListUl.innerHTML = html;
}

populateTodos();


// ---------------- EVENT DELEGATION (ONE LISTENER) ----------------
todoListUl.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;

    const id = li.dataset.id;

    // DELETE
    if (e.target.classList.contains("delete-btn")) {
        todos = todos.filter(t => t.id !== id);
        save();
        populateTodos();
        return;
    }

    // TOGGLE CHECKBOX
    if (e.target.classList.contains("todo-checkbox")) {
        todos = todos.map(t =>
            t.id === id ? { ...t, isCompleted: e.target.checked } : t
        );
        save();
        populateTodos();
    }
});


// ---------------- ADD TODO ----------------
addTodoBtn.addEventListener("click", () => {
    const text = inputTag.value.trim();
    if (text.length < 4) return;

    const todo = {
        id: "todo-" + Date.now(),
        title: text,
        isCompleted: false
    };

    todos.push(todo);
    inputTag.value = "";

    save();
    populateTodos();
});


// ---------------- CLEAR COMPLETED ----------------
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter(t => !t.isCompleted);
    save();
    populateTodos();
});


// ---------------- FILTERS ----------------
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.dataset.filter;
        populateTodos();
    });
});
