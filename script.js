let tasks = JSON.parse(localStorage.getItem("tasks")) || {
    todo: [],
    doing: [],
    done: []
};

let draggedTask = null;
let editTaskId = null;

/* OPEN/CLOSE ADD MODAL */
function openAddModal() {
    document.getElementById("addModal").style.display = "block";
}

function closeAddModal() {
    document.getElementById("addModal").style.display = "none";
}

/* ADD TASK */
function addTask() {
    const title = taskTitle.value;
    const desc = taskDesc.value;
    const priority = taskPriority.value;
    const color = taskColor.value;

    if (!title.trim()) return alert("Enter title!");

    const task = {
        id: Date.now(),
        title,
        desc,
        priority,
        color
    };

    tasks.todo.push(task);
    saveTasks();
    renderTasks();
    closeAddModal();
}

/* SAVE TO STORAGE */
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* RENDER ALL TASKS */
function renderTasks() {
    ["todo", "doing", "done"].forEach(column => {
        const container = document.getElementById(column);
        container.innerHTML = "";

        tasks[column].forEach(task => {
            const div = document.createElement("div");
            div.className = "task";
            div.id = task.id;
            div.draggable = true;

            div.ondragstart = e => draggedTask = e.target.id;

            div.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.desc}</p>

                <span class="priority ${task.priority}">
                    ${task.priority.toUpperCase()}
                </span>

                <div class="task-actions">
                    <button class="edit-btn" onclick="openEditModal(${task.id})">Edit</button>
                    <button class="del-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;

            div.style.borderLeft = `5px solid ${task.color}`;

            container.appendChild(div);
        });
    });
}

/* DRAG/DROP */
function allowDrop(e) { e.preventDefault(); }

function drop(e) {
    e.preventDefault();
    const container = e.target.closest(".task-container");
    if (!container) return;

    const column = container.id;

    ["todo", "doing", "done"].forEach(c => {
        tasks[c] = tasks[c].filter(t => t.id != draggedTask);
    });

    const task = findTask(draggedTask);
    tasks[column].push(task);

    saveTasks();
    renderTasks();
}

function findTask(id) {
    return [...tasks.todo, ...tasks.doing, ...tasks.done].find(t => t.id == id);
}

/* DELETE */
function deleteTask(id) {
    ["todo", "doing", "done"].forEach(col => {
        tasks[col] = tasks[col].filter(t => t.id !== id);
    });

    saveTasks();
    renderTasks();
}

/* EDIT */
function openEditModal(id) {
    editTaskId = id;

    const task = findTask(id);

    editTitle.value = task.title;
    editDesc.value = task.desc;
    editPriority.value = task.priority;
    editColor.value = task.color;

    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
    const updated = {
        title: editTitle.value,
        desc: editDesc.value,
        priority: editPriority.value,
        color: editColor.value
    };

    ["todo", "doing", "done"].forEach(col => {
        tasks[col] = tasks[col].map(t =>
            t.id === editTaskId ? { ...t, ...updated } : t
        );
    });

    saveTasks();
    renderTasks();
    closeEditModal();
}

renderTasks();
