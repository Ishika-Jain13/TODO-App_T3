//Initial References
const newTaskInput = document.querySelector("#new-task input[type='text']");
const newTaskInputNum = document.querySelector("#new-task input[type='number']");

const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

//Function on window load
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

//Function to Display The Tasks
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }

  //Clear the tasks
  tasksDiv.innerHTML = "";

  //Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort(function(a,b){
    x= localStorage.getItem(a);
    y=localStorage.getItem(b);
    let arr = JSON.parse(x);
    let value=parseInt(arr[1]);
    let arr1 = JSON.parse(y);
    let value1=parseInt(arr1[1]);
    if (value<value1 ){
      return -1;
    }
    if ( value>value1 ){
      return 1;
    }
    return 0;
  });
  console.log(tasks);


  //sorting task based on priority

  for (let key of tasks) {
    let classValue = "";

    //Get all values
    let val = localStorage.getItem(key);
    console.log(val, key);
    let arr = JSON.parse(val);
    let value=arr[0];
    console.log(value);

    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname" title="Click to mark task as completed">${key.split("_")[1]}</span>`;
    //localstorage would store boolean as string so we parse it to boolean back
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!value) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }

  //tasks completed
  tasks = document.querySelectorAll(".task");
  tasks.forEach((element, index) => {
    element.onclick = () => {
      //local storage update
      if (element.classList.contains("completed")) {
        updateStorage(element.id.split("_")[0], element.innerText,newTaskInputNum.value, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText,newTaskInputNum.value, true);
      }
    };
  });

  //Edit Tasks
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      disableButtons(true);
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      updateNote = parent.id;
      parent.remove();
    });
  });

  //Delete Tasks
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      //Delete from local storage and remove div
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};

//Disable Edit Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Remove Task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

//Add tasks to local storage
const updateStorage = (index, taskValue, taskValueNum, completed) => {
  let array = [completed,taskValueNum];
  // console.log(array);
  let str = JSON.stringify(array);
  // console.log(str);
  localStorage.setItem(`${index}_${taskValue}`, str);
  displayTasks();
};

//Function To Add New Task
document.querySelector("#push").addEventListener("click", () => {
  //Enable the edit button
  disableButtons(false);
  if (newTaskInput.value.length == 0) { 
    alert("Please Enter A Task");
  } else {
    //Store locally and display from local storage
    if(newTaskInputNum.value.length==0)
    newTaskInputNum.value=1;
    if (updateNote == "") {
      //new task
      // console.log(newTaskInputNum.value);
      updateStorage(count, newTaskInput.value, newTaskInputNum.value, false);
    } else {
      //update task
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value,newTaskInputNum.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
    newTaskInputNum.value="";
  }
});