import { getCookie } from './getCookie.mjs';
import { viewPopUpTask } from './popUpTask.mjs';

// Função DOM que é executada quando o documento HTML é carregado
document.addEventListener('DOMContentLoaded', function () {

    // Verifique se o usuário está logado

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

                btAdicionarTask.style.display = "block";

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

                        if (task.status === "done") {

                            statsBar.style.backgroundColor = "green";

                        } else if (task.status === "pending") {

                            statsBar.style.backgroundColor = "yellow";

                        }

                        statsBar.addEventListener("click", () => {

                            fetch('/taskStatus/' + task.task_id, {

                                method: 'PUT',

                                headers: {

                                    'Content-Type': 'application/json'

                                },

                                body: JSON.stringify({

                                    status: task.status === "done" ? "pending" : "done"

                                })

                            })
                                .then(response => {

                                    if (response.ok) {

                                        task.status = task.status === "done" ? "pending" : "done";

                                        if (task.status === "done") {

                                            statsBar.style.backgroundColor = "green";

                                        } else if (task.status === "pending") {

                                            statsBar.style.backgroundColor = "yellow";

                                        }

                                    }

                                    return response.json();

                                })

                        });

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

                        taskTitle.style.cursor = "pointer";

                        taskTitle.style.width = "200px";

                        taskTitle.addEventListener("click", () => viewPopUpTask(task));

                        taskDiv.classList.add("task");

                        taskDiv.appendChild(taskTitle);

                        taskDiv.appendChild(statsBar);

                        taskDiv.appendChild(btRemove);

                        tasksList.appendChild(taskDiv);

                    });

                })

        })
        
});