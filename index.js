let taskInput = document.querySelector(".task-input input");
let submitBtn = document.querySelector(".task-input button");
let tasks = document.querySelector(".tasks .content");

let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];

createTasks();
checkEmpty();

document.querySelector("form").onsubmit = (e) => e.preventDefault();

submitBtn.addEventListener("click", function () {
  if (taskInput.value !== "" && !isDuplicated()) {
    let checkedInp;

    document
      .querySelectorAll(".task-priority .opt input")
      .forEach((inp) => (inp.checked ? (checkedInp = inp) : ""));
    let taskObj = {
      id: Date.now().toString().slice(6),
      inputId: `in-${Date.now().toString().slice(6)}`,
      textContent: taskInput.value,
      date: taskDate(),
      done: false,
      priority: checkedInp.nextElementSibling.classList.item(0),
    };
    tasksArr.push(taskObj);
    updateLocalStorage();
    createTasks();
  }
  taskInput.value = "";
});

tasks.addEventListener("click", function (e) {
  // delete
  if (e.target.classList.contains("del")) {
    tasksArr = tasksArr.filter(
      (task) => task.id != e.target.closest(".task").id
    );
    e.target.closest(".task").remove();

    checkEmpty();
  }

  // edit
  if (e.target.classList.contains("edit")) {
    tasksArr.forEach((task) => {
      if (task.id === e.target.closest(".task").id) {
        if (!task.done) {
          let input = e.target
            .closest(".task")
            .querySelector(".text-content input");

          e.target.innerHTML = "Save";
          input.readOnly = false;
          input.focus();
          input.select();
          input.onblur = function () {
            e.target.innerHTML = "Edit";
            input.readOnly = true;
            task.textContent = input.value;

            createTasks();
          };
        }
      }
    });
  }

  // priority
  if (e.target.closest(".priority")) {
    e.target.closest(".task").classList.toggle("done");
    tasksArr.forEach((task) => {
      if (task.id === e.target.closest(".task").id) {
        task.done = task.done === false ? true : false;
      }
    });
  }
  updateLocalStorage();
});

// clear all
document.querySelector(".clear .all").onclick = function () {
  tasks.innerHTML = "";
  tasksArr = [];
  updateLocalStorage();
  checkEmpty();
};

// clear completed
document.querySelector(".clear .completed").onclick = function () {
  tasksArr = tasksArr.filter((task) => task.done === false);
  updateLocalStorage();
  createTasks();
  checkEmpty();
};

// get the date that task has been added in
function taskDate() {
  let d = new Date();
  function addPad(v) {
    return v.toString().padStart(2, "0");
  }

  return `${addPad(d.getDate())} / ${addPad(
    d.getMonth() + 1
  )} / ${d.getFullYear()} At ${
    addPad(d.getHours() % 12) == 0 ? "12" : addPad(d.getHours() % 12)
  }:${addPad(d.getMinutes())}${d.getHours() >= 12 ? "PM" : "AM"}`;
}

// create and appending tasks function
function createTasks() {
  tasks.innerHTML = "";
  if (tasksArr.length > 0) {
    tasksArr.forEach((task) => {
      let div = document.createElement("div");
      let cat = document.createElement("div");
      let catInput = document.createElement("input");
      let catLabel = document.createElement("label");
      let catLabelSpan = document.createElement("span");
      let textContent = document.createElement("div");
      let textContentInput = document.createElement("input");
      let textContentSpan = document.createElement("span");
      let actions = document.createElement("div");
      let actionsEdit = document.createElement("button");
      let actionsDel = document.createElement("button");

      cat.className = "cat";
      catInput.type = "checkbox";
      catInput.id = task.inputId;

      catLabel.className = "priority";
      catLabel.htmlFor = task.inputId;
      catLabel.classList.add(task.priority);
      catLabel.append(catLabelSpan);

      cat.append(catInput, catLabel);

      textContent.className = "text-content";
      textContentInput.type = "text";
      textContentInput.readOnly = true;
      textContentInput.value = task.textContent;

      textContentSpan.className = "date";
      textContentSpan.innerText = task.date;

      textContent.append(textContentInput, textContentSpan);

      actions.className = "actions d-flex";
      actionsEdit.className = "edit";
      actionsEdit.innerHTML = "Edit";

      actionsDel.className = "del";
      actionsDel.innerHTML = "Delete";

      actions.append(actionsEdit, actionsDel);

      div.classList.add("task", "d-flex");
      if (task.done) {
        div.classList.add("done");
      }
      div.id = task.id;
      div.append(cat, textContent, actions);

      tasks.prepend(div);
    });
  }
}

function checkEmpty() {
  if (tasksArr.length === 0) {
    let div = document.createElement("div");
    let p = document.createElement("p");

    p.innerHTML = "Enter your first task";

    div.className = "no-tasks";
    div.innerHTML = "You Have Nothing To Do Today!";
    div.appendChild(p);

    div.addEventListener("mousedown", function () {
      this.style.boxShadow = "0 0";
      taskInput.focus();
    });

    div.addEventListener("mouseup", function () {
      this.style.boxShadow = "rgba(0, 0, 0, 1) 3px 3px 0px 0px";
      taskInput.focus();
    });

    tasks.appendChild(div);
  }
}

function updateLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

function isDuplicated() {
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].textContent === taskInput.value) return true;
  }
  return false;
}
