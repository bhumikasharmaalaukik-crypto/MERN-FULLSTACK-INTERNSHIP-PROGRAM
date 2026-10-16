// ---------- state ----------
// all the tasks live in this array. The page is drawn from it.
let tasks = [
  { id: 1, title: "Design login page",     description: "Create the login and registration layout.",              status: "completed" },
  { id: 2, title: "Add form validation",   description: "Check email format, password length and confirm password.", status: "completed" },
  { id: 3, title: "Build dashboard",       description: "Sidebar, welcome section and statistics cards.",         status: "completed" },
  { id: 4, title: "Create task list",      description: "Show tasks as cards with title, description and status.", status: "pending" },
  { id: 5, title: "Connect to backend",    description: "Load the tasks from the server instead of static data.", status: "pending" },
  { id: 6, title: "Write documentation",   description: "Explain the setup steps and the folder structure.",      status: "pending" }
];

let nextId = 7;   // every new task gets a new unique id

// ---------- elements ----------
const addBtn = document.getElementById("add-task-btn");
const overlay = document.getElementById("overlay");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const titleError = document.getElementById("title-error");
const cancelBtn = document.getElementById("cancel-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

// ---------- rendering ----------

// make one task card from a task object
function createCard(task) {
  const card = document.createElement("div");
  card.className = "task";
  card.dataset.id = task.id;

  const header = document.createElement("div");
  header.className = "task-header";

  const heading = document.createElement("h3");
  heading.textContent = task.title;

  const status = document.createElement("span");
  status.className = "status " + task.status;
  status.textContent = task.status === "completed" ? "Completed" : "Pending";

  header.appendChild(heading);
  header.appendChild(status);

  const desc = document.createElement("p");
  desc.textContent = task.description || "No description";

  const footer = document.createElement("div");
  footer.className = "task-footer";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.setAttribute("aria-label", "Delete task: " + task.title);

  footer.appendChild(deleteBtn);

  card.appendChild(header);
  card.appendChild(desc);
  card.appendChild(footer);

  return card;
}

// draw the whole list from the tasks array
function render() {
  // build all cards off-screen first, then put them in the page in one go
  const fragment = document.createDocumentFragment();
  tasks.forEach(function (task) {
    fragment.appendChild(createCard(task));
  });
  taskList.replaceChildren(fragment);

  // update the count and the empty message
  taskCount.textContent = "You have " + tasks.length + (tasks.length === 1 ? " task" : " tasks");
  emptyMessage.hidden = tasks.length > 0;
}

// ---------- state changes ----------

function addTask(title, description) {
  const newTask = {
    id: nextId++,
    title: title,
    description: description,
    status: "pending"
  };
  tasks.unshift(newTask);   // newest task goes first
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  render();
}

// ---------- modal ----------

function openModal() {
  overlay.classList.add("show");
  document.body.classList.add("no-scroll");
  titleInput.focus();
}

function closeModal() {
  overlay.classList.remove("show");
  document.body.classList.remove("no-scroll");
  form.reset();
  clearError();
  addBtn.focus();
}

function showError(message) {
  titleError.textContent = message;
  titleInput.classList.add("invalid");
}

function clearError() {
  titleError.textContent = "";
  titleInput.classList.remove("invalid");
}

// ---------- events ----------

addBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", function (event) {
  if (event.target === overlay) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && overlay.classList.contains("show")) {
    closeModal();
  }
});

titleInput.addEventListener("input", clearError);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (title === "") {
    showError("Please enter a task title.");
    titleInput.focus();
    return;
  }

  addTask(title, description);
  closeModal();
});

// one listener on the list handles every Delete button (event delegation)
taskList.addEventListener("click", function (event) {
  const button = event.target.closest(".delete-btn");
  if (!button) return;

  const card = button.closest(".task");
  deleteTask(Number(card.dataset.id));
});

// ---------- start ----------
render();