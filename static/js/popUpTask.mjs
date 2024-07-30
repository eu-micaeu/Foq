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

    var btUpdateTask = document.getElementById("btUpdateTask");

    btUpdateTask.addEventListener("click", function () {

        fetch('/task/' + task.task_id, {

            method: 'PUT',

            headers: {

                'Content-Type': 'application/json',

            },

            body: JSON.stringify(

                {

                    title: taskTitle.value,

                    description: taskDescription.value

                }
            )

        })

            .then(response => {

                if (response.ok) {

                    attListTasks();

                    popUpTask.style.display = "none";

                    overlay.style.display = "none";

                }

                else {

                    alert("Erro ao atualizar a task!");

                }

            });

    });

};