function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showSection('today');

  // Puts current date
  const dateElement = document.getElementById('currentDate');
  if (dateElement) {
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  // TODAY TASKS SECTION
  const todoForm = document.querySelector('form');
  const todoInput = document.getElementById('todo-input');
  const todoListUL = document.getElementById('today-list');

  let allTodos = getTodos(); // Load from localStorage
  updateTodoList(); 

  // When the form is submitted, add a new todo
  todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
  });

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    const todayStr = new Date().toISOString().split('T')[0]; 
    const todoObject = {
      text: todoText,
      completed: false,
      date: todayStr
    };
    allTodos.push(todoObject);
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}

  function updateTodoList() {
    todoListUL.innerHTML = ""; 
    allTodos.forEach((todo, todoIndex) => {
      const todoItem = createTodoItem(todo, todoIndex);
      todoListUL.append(todoItem);
    });
  }

  function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;

    todoLI.className = "list-element";

    todoLI.innerHTML = `
      <input type="checkbox" id="${todoId}" ${todo.completed ? "checked" : ""} />
      <label class="custom-checkbox" for="${todoId}">
        <i class="fa-solid fa-check check-icon"></i>
      </label>
      <label for="${todoId}" class="today-text">${todoText}</label>
      <button class="today-delete-button">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    //Deletes item from the list
    const deletebutton = todoLI.querySelector(".today-delete-button");
    deletebutton.addEventListener("click", () => {
      deleteTodoitem(todoIndex);
    });

    // When checkbox changes, updates completion status and saves
    const checkbox = todoLI.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => {
      allTodos[todoIndex].completed = checkbox.checked;
      saveTodos();
    });

    return todoLI;
  }

  function saveTodos() {
    // Save array as JSON string in localStorage
    localStorage.setItem("todos", JSON.stringify(allTodos));
  }

  function deleteTodoitem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    updateTodoList();
    saveTodos();
  }

function getTodos() {
  try {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
    const todayStr = new Date().toISOString().split('T')[0];

    const validTodos = todos.filter(todo => todo.date === todayStr);

    // If tasks are from a previous day, clear localStorage
    if (validTodos.length !== todos.length) {
      localStorage.removeItem("todos");
    }

    return validTodos;
  } catch (e) {
    console.error("Failed to parse todos from localStorage", e);
    return [];
  }
}
/* ------------------------important section ----------------------------- */
const importantForm = document.getElementById('important-input-bar');
const importantInput = document.getElementById('important-input');
const importantList = document.getElementById('importantlist');
const dateInput = document.getElementById('reminder-date');
const timeInput = document.getElementById('reminder-time');

// Load tasks from localStorage on page load
window.addEventListener('DOMContentLoaded', loadTasksFromStorage);

importantForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const taskText = importantInput.value.trim();
  const taskDate = dateInput.value;
  const taskTime = timeInput.value;

  if (taskText === '') return;

  const task = {
    id: Date.now().toString(), // unique id as string
    text: taskText,
    date: taskDate,
    time: taskTime,
  };

  addTaskToDOM(task);
  saveTaskToStorage(task);

  importantInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
});

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.classList.add('important-task-item', 'important-li');
  li.dataset.id = task.id; 

  let content = `<div class="task-text"><strong>${task.text}</strong>`;

  if (task.date || task.time) {
    content += `<br><small>`;
    if (task.date) content += `📅 ${task.date} `;
    if (task.time) content += `⏰ ${task.time}`;
    content += `</small>`;
  }

  content += `</div>`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.classList.add('delete-button');
  deleteBtn.addEventListener('click', () => {
    li.remove();
    removeTaskFromStorage(task.id);
  });

  li.innerHTML = content;
  li.appendChild(deleteBtn);
  importantList.appendChild(li);
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('importantTasks') || '[]');
}

function saveTaskToStorage(task) {
  const tasks = getTasksFromStorage();
  tasks.push(task);
  localStorage.setItem('importantTasks', JSON.stringify(tasks));
}

function removeTaskFromStorage(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('importantTasks', JSON.stringify(tasks));
}

function loadTasksFromStorage() {
  const tasks = getTasksFromStorage();
  tasks.forEach(addTaskToDOM);
}

/* -------------------workout section-----------------*/
const addWorkoutBtn = document.getElementById("addWorkout");
const workoutEntries = document.getElementById("workoutEntries");

const savedWorkouts = JSON.parse(localStorage.getItem("workoutList")) || [];
savedWorkouts.forEach(({ title, content }) => createWorkoutBox(title, content));

addWorkoutBtn.addEventListener("click", () => {
  createWorkoutBox("Title", "Write workout...");
});

function createWorkoutBox(titleText, contentText) {
  const box = document.createElement("div");
  box.className = "entryBox";

  const topRow = document.createElement("div");
  topRow.className = "topRow";

  const title = document.createElement("div");
  title.className = "workoutTitle";
  title.setAttribute("contenteditable", "true");
  title.innerText = titleText;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteBtn";
  deleteBtn.innerText = "🗑️";
  deleteBtn.title = "Delete workout";
  deleteBtn.addEventListener("click", () => {
    box.remove();
    saveWorkouts();
  });

  topRow.appendChild(title);
  topRow.appendChild(deleteBtn);

  const content = document.createElement("div");
  content.className = "workoutContent";
  content.setAttribute("contenteditable", "true");
  content.innerText = contentText;

  title.addEventListener("blur", saveWorkouts);
  content.addEventListener("blur", saveWorkouts);

  box.appendChild(topRow);
  box.appendChild(content);

  workoutEntries.insertBefore(box, addWorkoutBtn);
}

  /* 
  Here, I selected all DOM elements with the class "entryBox". 
  Then I converted them into an array of objects and used the array's map method 
  to iterate through each DOM element. 
  For each box, I extracted its content, converted it into a new object (as strings), 
  and saved the array of objects to localStorage as a JSON string. 
*/
  
function saveWorkouts() {
  const boxes = document.querySelectorAll(".entryBox");
  const data = Array.from(boxes).map(box => {
    const [title, content] = box.querySelectorAll("[contenteditable]");
    return {
      title: title.innerText.trim(),
      content: content.innerText.trim()
    };
  });
  localStorage.setItem("workoutList", JSON.stringify(data));
}

/* ---------------------- groceries-------------------------- */
const groceriesInputBar = document.getElementById("grocery-input-bar");
const groceryList = document.getElementById("grocerylist");
const createGroceryInput = document.getElementById("grocery-list");

let groceryItems = getGroceryList(); 
updateGroceryList(); 

groceriesInputBar.addEventListener("submit", function (e) {
  e.preventDefault();

  const item = createGroceryInput.value.trim();
  if (item) {
    groceryItems.push({
      text: item,
      completed: false,
    });

    saveGroceryList();
    updateGroceryList();
    createGroceryInput.value = "";
  }
});

function updateGroceryList() {
  groceryList.innerHTML = "";

  const incomplete = groceryItems.filter(item => !item.completed);
  const complete = groceryItems.filter(item => item.completed);
  const sortedItems = [...incomplete, ...complete];

  sortedItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-element";

    const checkboxId = `grocery-${index}`;

    li.innerHTML = `
      <input type="checkbox" id="${checkboxId}" ${item.completed ? "checked" : ""} />
      <label class="custom-checkbox" for="${checkboxId}">
        <i class="fa-solid fa-check check-icon"></i>
      </label>
      <span class="create-text${item.completed ? ' completed' : ''}">${item.text}</span>
      <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
    `;

    // Handle checkbox change
    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => {
      const actualIndex = groceryItems.findIndex(
        i => i.text === item.text && i.completed === item.completed
      );
      if (actualIndex > -1) {
        groceryItems[actualIndex].completed = checkbox.checked;
        saveGroceryList();
        updateGroceryList();
      }
    });

    const textSpan = li.querySelector(".create-text");
    textSpan.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    });

    const deleteBtn = li.querySelector(".delete-button");
    deleteBtn.addEventListener("click", () => {
      const actualIndex = groceryItems.findIndex(
        i => i.text === item.text && i.completed === item.completed
      );
      if (actualIndex > -1) {
        removeGroceryItem(actualIndex);
      }
    });

    groceryList.appendChild(li);
  });
}

function removeGroceryItem(index) {
  groceryItems.splice(index, 1);
  saveGroceryList();
  updateGroceryList();
}

function saveGroceryList() {
  localStorage.setItem("groceryList", JSON.stringify(groceryItems));
}

function getGroceryList() {
  try {
    return JSON.parse(localStorage.getItem("groceryList")) || [];
  } catch (e) {
    console.error("Failed to parse grocery list from localStorage", e);
    return [];
  }
}

/*-----------------------create a list ----------------------------*/
//makes the title editable
  const h1 = document.getElementById("editableTitle");

  h1.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      h1.blur();
    }
  });

  h1.addEventListener("blur", () => {
    localStorage.setItem("title", h1.textContent); 
  });

  const saved = localStorage.getItem("title");
  if (saved) {
    h1.textContent = saved; 
  }

  const createListInput = document.getElementById("newlist-input");
  const createListUL = document.getElementById("newlist");

  let createList = getCreateList(); // Load saved lists
  updateCreateList(); 

  // Save new list item
  document.getElementById("input-bar").addEventListener("submit", function (e) {
    e.preventDefault();
    const value = createListInput.value.trim();
    if (value) {
      createList.push({
        text: value,
        completed: false,
      });
      updateCreateList();
      saveCreateList();
      createListInput.value = "";
    }
  });

  function updateCreateList() {
    createListUL.innerHTML = "";
    createList.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "list-element";

      const checkboxId = `create-${index}`;

      li.innerHTML = `
        <input type="checkbox" id="${checkboxId}" ${item.completed ? "checked" : ""} />
        <label class="custom-checkbox" for="${checkboxId}">
          <i class="fa-solid fa-check check-icon"></i>
        </label>
      <span class="create-text" contenteditable="false">${item.text}</span>
        <button class="delete-button">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      const checkbox = li.querySelector("input[type='checkbox']");
      const textSpan = li.querySelector(".create-text");
      const deleteBtn = li.querySelector(".delete-button");

      // Toggle completion status
      checkbox.addEventListener("change", () => {
        createList[index].completed = checkbox.checked;
        saveCreateList();
        updateCreateList(); 
      });

      textSpan.addEventListener("click", () => {
        createList[index].completed = !createList[index].completed;
        saveCreateList();
        updateCreateList();
      });

      deleteBtn.addEventListener("click", () => {
        deleteCreateListItem(index);
      });

//the task is styled here after the user checks the checkbox
      if (item.completed) {
        textSpan.style.textDecoration = "line-through";
        textSpan.style.opacity = "0.6";
      } else {
        textSpan.style.textDecoration = "none";
        textSpan.style.opacity = "1";
      }

      createListUL.appendChild(li);
    });
  }

  function deleteCreateListItem(index) {
    createList = createList.filter((_, i) => i !== index);
    updateCreateList();
    saveCreateList();
  }

  function saveCreateList() {
    localStorage.setItem("createList", JSON.stringify(createList));
  }

  function getCreateList() {
    try {
      return JSON.parse(localStorage.getItem("createList")) || [];
    } catch (e) {
      console.error("Failed to parse createList from localStorage", e);
      return [];
    }
  }
});
