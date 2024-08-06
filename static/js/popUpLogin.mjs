import { getCookie } from './getCookie.mjs';
import { viewPopUpTask } from './popUpTask.mjs';

// Abrir o popUp

document.getElementById("btLogin").addEventListener("click", function () {

    var popUpLogin = document.getElementById("popUpLogin");

    var overlay = document.getElementById("overlay");

    popUpLogin.style.display = "block";

    overlay.style.display = "block";

});

// Funções para o popUp de login

document.getElementById("btSubmitLogin").addEventListener("click", function (event) {


    event.preventDefault(); // Previne o comportamento padrão de submissão do formulário

    var usernameLogin = document.getElementById("usernameLogin").value;

    var passwordLogin = document.getElementById("passwordLogin").value;

    // Utilizando a API Fetch para fazer a requisição POST /login e me mostre a resposta

    fetch('/login', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            username: usernameLogin,

            password: passwordLogin

        })

    })

        .then(response => {

            if (response.ok) {

                var popUpLogin = document.getElementById("popUpLogin");

                var popUpRegister = document.getElementById("popUpRegister");

                var overlay = document.getElementById("overlay");

                var toastGreenLogin = document.getElementById("toastGreenLogin");

                toastGreenLogin.style.display = "block";

                setTimeout(function () {

                    toastGreenLogin.style.display = "none";

                    popUpLogin.style.display = "none";

                    popUpRegister.style.display = "none";

                    overlay.style.display = "none";

                }, 2000);

            }else{

                var toastRedLogin = document.getElementById("toastRedLogin");

                toastRedLogin.style.display = "block";

                setTimeout(function () {

                    toastRedLogin.style.display = "none";

                }, 2000);

                document.getElementById("usernameLogin").value = "";

                document.getElementById("passwordLogin").value = "";

            }

            return response.json();

        })

        .then(data => {

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
                                statsBar.title = "Change status";

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
                                taskTitle.style.width = "200px";
                                taskTitle.addEventListener("click", () => viewPopUpTask(task));
                                taskDiv.appendChild(taskTitle);
                                taskDiv.appendChild(statsBar);
                                taskDiv.appendChild(btRemove);
                                tasksList.appendChild(taskDiv);
                            });

                            ///////////////////////////////////////////////////////

                        })
                })

                .catch(error => {
                    console.error('Error:', error);
                });

        })

})