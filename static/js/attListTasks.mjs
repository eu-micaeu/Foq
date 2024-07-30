import { getCookie } from './getCookie.mjs';

// Função para atualizar a lista de tarefas

export function attListTasks() {

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
            fetch('/tasks/' + data.user.user_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': getCookie("token")
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
                        statsBar.style.width = "40vw";
                        statsBar.style.height = "15px";
                        statsBar.style.borderRadius = "10px";
                        statsBar.style.cursor = "pointer";
                        if (task.status === "done") {
                            statsBar.style.backgroundColor = "green";
                        } else if (task.status === "pending") {
                            statsBar.style.backgroundColor = "yellow";
                        }
                        statsBar.addEventListener("click", () => {
                            fetch('/task/' + task.task_id, {
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
                        taskDiv.classList.add("task");
                        var btRemove = document.createElement("button");
                        btRemove.innerHTML = "X";
                        btRemove.id = "btRemove"
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
                        taskTitle.style.width = "70px";
                        taskTitle.addEventListener("click", () => viewPopUpTask(task));
                        taskDiv.appendChild(taskTitle);
                        taskDiv.appendChild(statsBar);
                        taskDiv.appendChild(btRemove);
                        tasksList.appendChild(taskDiv);
                    });

                    ///////////////////////////////////////////////////////

                })
        })

}

