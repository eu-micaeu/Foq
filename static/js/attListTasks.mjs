import { getCookie } from './getCookie.mjs';
import { viewPopUpTask } from './popUpTask.mjs';

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

                        statsBar.id = "statsBar";

                        if (task.status == "done") {

                            statsBar.style.backgroundColor = "green";

                        } else if (task.status == "pending") {

                            statsBar.style.backgroundColor = "yellow";
                            
                        }

                        var btRemove = document.createElement("button");

                        btRemove.innerHTML = "X";

                        btRemove.id = "btRemove";

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

}

