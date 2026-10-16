// get the elements we need
const addBtn = document.getElementById("add-task-btn");
const overlay = document.getElementById("overlay");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const titleError = document.getElementById("title-error");
const cancelBtn = document.getElementById("cancel-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

// open the modal
function openModal() {
  overlay.classList.add("show");
  document.body.classList.add("no-scroll");
  titleInput.focus();
}

// close the modal and clear the form
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

// update the "You have X tasks" text
function updateCount() {
  const count = taskList.children.length;
  taskCount.textContent = "You have " + count + (count === 1 ? " task" : " tasks");
}

// build a new task card and add it to the top of the list
function addTask(title, description) {
  const card = document.createElement("div");
  card.className = "task";

  const header = document.createElement("div");
  header.className = "task-header";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const status = document.createElement("span");
  status.className = "status pending";
  status.textContent = "Pending";

  header.appendChild(heading);
  header.appendChild(status);

  const desc = document.createElement("p");
  desc.textContent = description || "No description";

  card.appendChild(header);
  card.appendChild(desc);

  taskList.prepend(card);
  updateCount();
}

// ---------- events ----------

// open when Add Task is clicked
addBtn.addEventListener("click", openModal);

// Cancel button
cancelBtn.addEventListener("click", closeModal);

// click on the dark area (but not inside the modal) closes it
overlay.addEventListener("click", function (event) {
  if (event.target === overlay) {
    closeModal();
  }
});

// Escape key closes it
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && overlay.classList.contains("show")) {
    closeModal();
  }
});

// remove the error as soon as the user starts typing
titleInput.addEventListener("input", clearError);

// Save button
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