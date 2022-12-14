
//const connection = require('/../db')

/*
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.currentTarget.appendChild(document.getElementById(data));
}

function createTask(){
    var x = document.getElementById("inprogress");
    var y = document.getElementById("done");
    var z = document.getElementById("create-new-task-block");
    if (x.style.display === "none") {
        x.style.display = "block";
        y.style.display = "block";
        z.style.display = "none";
    } else {
        x.style.display = "none";
        y.style.display = "none";
        z.style.display = "flex";
    }
}

/*
const saveTaskToDatabase = (taskname) => {
    const taskname = document.getElementById('task-name').value
connection.query(
'insert into task_table1 (taskname) values (?)', 
[task], 
console.log(task),
function(err) {
  if (err) {
    console.error(err);
  }
}
);
} */
/*function saveTask(){
 

   /* var todo = document.getElementById("todo");
    var taskName = document.getElementById("task-name").value;
    todo.innerHTML += `
    <div class="task" id="${taskName.toLowerCase().split(" ").join("")}" draggable="true" ondragstart="drag(event)">
        <span>${taskName}</span>
    </div>
    ` */
 /*   connection.query(
'insert into task_table1 (taskname) values (?)', 
[taskName], 
console.log(taskName),
function(err) {
  if (err) {
    console.error(err);
  }
}
);
} 

function editTask(){
    var saveButton = document.getElementById("save-button");
    var editButton = document.getElementById("edit-button");
    if (saveButton.style.display === "none") {
        saveButton.style.display = "block";
        editButton.style.display = "none";
    } else{
        saveButton.style.display = "none";
        editButton.style.display = "block";
    }
}

*/