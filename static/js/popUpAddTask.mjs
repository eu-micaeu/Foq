import { getCookie } from './getCookie.mjs';
import { attListTasks } from './attListTasks.mjs';

// Abrir o popUp

document.getElementById("btAdicionarTask").addEventListener("click", function () {

    var popUpAddTask = document.getElementById("popUpAddTask");

    var overlay = document.getElementById("overlay");

    popUpAddTask.style.display = "block";

    overlay.style.display = "block";

});

// Submit Add Task

document.getElementById("btSubmitAddTask").addEventListener("click", function (event) {

    event.preventDefault();

    var userId;

    var taskTitle = document.getElementById("addtaskTitle").value;

    var taskDescription = document.getElementById("addtaskDescription").value;

    var taskStatus = 'pending';

    fetch('/logged', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            'token': getCookie("token")

        },

    })


        .then(response => {

            return response.json();

        })

        .then(data => {

            userId = data.user.user_id;

            fetch('/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    title: taskTitle,
                    description: taskDescription,
                    status: taskStatus
                })
            })
        
            .then(response => {
                if (response.ok) {

                    var popUpAddTask = document.getElementById("popUpAddTask");
                    var overlay = document.getElementById("overlay");
                    popUpAddTask.style.display = "none";
                    overlay.style.display = "none";
                    attListTasks();

                }
                return response.json();
            })

        })

});