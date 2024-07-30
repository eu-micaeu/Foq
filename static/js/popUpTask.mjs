// Abrir o popUpTask

export function viewPopUpTask (task) {

    var popUpTask = document.getElementById("popUpTask");

    var overlay = document.getElementById("overlay");

    popUpTask.style.display = "block";

    overlay.style.display = "block";

    var taskTitle = document.getElementById("taskTitle");

    taskTitle.value = task.title;

    var taskDescription = document.getElementById("taskDescription");

    taskDescription.value = task.description;

    if (task.status === "pending") {

        var statsBar = document.getElementById("statsBar");

        statsBar.style.backgroundColor = "yellow";

    } else {

        var statsBar = document.getElementById("statsBar");

        statsBar.style.backgroundColor = "green";

    }

};

