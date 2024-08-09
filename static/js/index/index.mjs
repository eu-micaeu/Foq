import { getCookie } from '../getCookie.mjs';
import { viewPopUpTask } from '../popUpTask.mjs';

// Função DOM que é executada quando o documento HTML é carregado
document.addEventListener('DOMContentLoaded', function () {

    var btDeleteAccount = document.getElementById("btDeleteAccount");

    btDeleteAccount.addEventListener("click", function () {

        fetch('/delete', {

            method: 'DELETE',

            headers: {

                'Content-Type': 'application/json',

                'token': getCookie("token")

            },

        })

            .then(response => {

                if (response.ok) {

                    window.location.href = "/";

                }

                return response.json();

            })

    });

    var btCloseElements = document.getElementsByClassName("btClose");

    for (var i = 0; i < btCloseElements.length; i++) {
        btCloseElements[i].addEventListener("click", function () {
            document.getElementById("popUpTask").style.display = "none";
            document.getElementById("popUpAddTask").style.display = "none";
            document.getElementById("popUpLogin").style.display = "none";
            document.getElementById("popUpRegister").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        });
    }

    // Se o token existir
    if (getCookie("token")) {

        fetch('/logged', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                'token': getCookie("token")

            },

        })

            .then(response => {

                if (response.ok) {

                    var btLogin = document.getElementById("btLogin");

                    btLogin.style.display = "none";

                    var btLogout = document.getElementById("btLogout");

                    btLogout.style.display = "flex";

                    var btAdicionarTask = document.getElementById("btAdicionarTask");

                    btAdicionarTask.style.display = "flex";

                }

                return response.json();

            })

            .then(data => {

                fetch('/tasks/' + data.user.user_id, {

                    method: 'GET',

                    headers: {

                        'Content-Type': 'application/json',

                    },

                })

                    .then(response => {

                        return response.json();

                    })

                    .then(data => {

                        var tasks = data.tasks;

                        var tasksList = document.getElementById("listTasks");

                        tasksList.innerHTML = "";

                        // Bloco de código que cria um elemento HTML para cada tarefa

                        tasks.forEach(task => {

                            var taskDiv = document.createElement("div");

                            var taskTitle = document.createElement("p");

                            var statsBar = document.createElement("div");

                            statsBar.id = "statsBar";

                            if (task.status == "done") {

                                statsBar.style.backgroundColor = "green";

                            } else if (task.status == "pending") {

                                statsBar.style.backgroundColor = "yellow";

                            }

                            var btRemove = document.createElement("button");

                            btRemove.innerHTML = "X";

                            btRemove.id = "btRemove";

                            btRemove.title = "Delete task";

                            btRemove.addEventListener("click", function () {

                                fetch('/task/' + task.task_id, {

                                    method: 'DELETE',

                                    headers: {

                                        'Content-Type': 'application/json'

                                    },

                                })

                                    .then(response => {

                                        if (response.ok) {

                                            tasksList.removeChild(taskDiv);

                                        }

                                        return response.json();

                                    })

                            });

                            taskTitle.innerHTML = task.title;

                            taskDiv.addEventListener("click", () => viewPopUpTask(task));
                            taskDiv.classList.add("task");
                            taskDiv.appendChild(taskTitle);
                            taskDiv.appendChild(statsBar);
                            taskDiv.appendChild(btRemove);

                            tasksList.appendChild(taskDiv);

                        });

                    })

            })


    } else {

        var btLogin = document.getElementById("btLogin");

        btLogin.style.display = "flex";

        btDeleteAccount.style.display = "none";

        var btLogout = document.getElementById("btLogout");

        btLogout.style.display = "none";

        var btAdicionarTask = document.getElementById("btAdicionarTask");

        btAdicionarTask.style.display = "none";

    }

});