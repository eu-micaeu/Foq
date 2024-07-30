import { getCookie } from './getCookie.mjs';

document.getElementById("btLogout").addEventListener("click", function () {

    fetch('/exit', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            'token': getCookie("token")

        },

    })

        .then(response => {

            if (response.ok) {

                var btLogin = document.getElementById("btLogin");

                btLogin.style.display = "flex";

                var btLogout = document.getElementById("btLogout");

                btLogout.style.display = "none";

                var btAdicionarTask = document.getElementById("btAdicionarTask");

                btAdicionarTask.style.display = "none";

                var tasksList = document.getElementById("listTasks");

                tasksList.innerHTML = "";

            }

            return response.json();

        })

});