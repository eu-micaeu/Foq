import { attListTasks } from './attListTasks.mjs';

// Abrir o popUpTask
export function viewPopUpTask(task) {
    var popUpTask = document.getElementById("popUpTask");
    var overlay = document.getElementById("overlay");

    popUpTask.style.display = "block";
    overlay.style.display = "block";

    var taskTitle = document.getElementById("taskTitle");
    taskTitle.value = task.title;

    var taskDescription = document.getElementById("taskDescription");
    taskDescription.value = task.description;

    var taskStatus = document.getElementById("taskStatus");

    // Remove all previous event listeners for the taskStatus
    var newTaskStatus = taskStatus.cloneNode(true);
    taskStatus.parentNode.replaceChild(newTaskStatus, taskStatus);
    taskStatus = newTaskStatus;

    if (task.status === "pending") {
        taskStatus.style.backgroundColor = "yellow";
        taskStatus.value = "pending";
    } else if (task.status === "done") {
        taskStatus.style.backgroundColor = "green";
        taskStatus.value = "done";
    }

    // Define the toggle function
    function toggleTaskStatus() {
        console.log("CLICADO");
        if (taskStatus.style.backgroundColor === "green") {
            taskStatus.style.backgroundColor = "yellow";
            taskStatus.value = "pending";
        } else if (taskStatus.style.backgroundColor === "yellow") {
            taskStatus.style.backgroundColor = "green";
            taskStatus.value = "done";
        }
    }

    // Add event listener
    taskStatus.addEventListener("click", toggleTaskStatus);

    var btUpdateTask = document.getElementById("btUpdateTask");

    // Remove existing event listener, if any, by replacing the element
    var newBtUpdateTask = btUpdateTask.cloneNode(true);
    btUpdateTask.parentNode.replaceChild(newBtUpdateTask, btUpdateTask);
    btUpdateTask = newBtUpdateTask;

    // Define the update function
    function updateTask() {
        fetch('/task/' + task.task_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: taskTitle.value,
                description: taskDescription.value,
                status: taskStatus.value
            })
        })
        .then(response => {
            if (response.ok) {
                attListTasks();
                popUpTask.style.display = "none";
                var toastBlue = document.getElementById("toastBlue");
                toastBlue.style.display = "block";
                setTimeout(function () {
                    overlay.style.display = "none";
                    toastBlue.style.display = "none";
                }, 2000);
            } else {
                alert("Erro ao atualizar a task!");
            }
        });
    }

    // Add event listener
    btUpdateTask.addEventListener("click", updateTask);
}
