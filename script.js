console.log("To-Do script loaded successfully!");

const taskInput   = document.getElementById("taskInput");
const addBtn      = document.getElementById("addBtn");
const taskList    = document.getElementById("taskList");
const pendingCount = document.getElementById("pendingCount");
const clearCompleted = document.getElementById("clearCompleted");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");

let tasks = [];
let currentFilter = "all";

// ────────────────────────────────────────────────
function loadTasks() {
    const saved = localStorage.getItem("myTodoTasks");
    if (saved) {
        tasks = JSON.parse(saved);
        console.log("Loaded", tasks.length, "tasks from localStorage");
    }
    renderTasks();
}

function saveTasks() {
    localStorage.setItem("myTodoTasks", JSON.stringify(tasks));
    console.log("Tasks saved");
}

function updateStatsAndEmptyState() {
    const pending = tasks.filter(t => !t.completed).length;
    pendingCount.textContent = `${pending} task${pending !== 1 ? 's' : ''} pending`;

    emptyMessage.classList.toggle("show", tasks.length === 0);
}

function createTaskElement(task) {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button class="btn-edit">Edit</button>
        <button class="btn-delete">Delete</button>
    `;

    
    li.querySelector(".task-text").addEventListener("click", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    });

    
    li.querySelector(".btn-delete").addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
    });

    
    li.querySelector(".btn-edit").addEventListener("click", () => {
        const newText = prompt("Edit your task:", task.text);
        if (newText !== null) {
            const trimmed = newText.trim();
            if (trimmed) {
                task.text = trimmed;
                saveTasks();
                renderTasks();
            } else {
                alert("Task cannot be empty!");
            }
        }
    });

    return li;
}

function renderTasks() {
    taskList.innerHTML = "";
    let filtered = tasks;

    if (currentFilter === "pending") {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === "completed") {
        filtered = tasks.filter(t => t.completed);
    }

    filtered.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });

    updateStatsAndEmptyState();
}

// ────────────────────────────────────────────────
function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
    console.log("Added new task:", text);
}

// ────────────────────────────────────────────────
// Event Listeners
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearCompleted.addEventListener("click", () => {
    if (!confirm("Remove all completed tasks?")) return;
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", next);
});


const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

// Start 
loadTasks();

