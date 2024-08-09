import { getCookie } from './getCookie.mjs';

document.getElementById("btLogout").addEventListener("click", function () {

    var overlay = document.getElementById("overlay");

    overlay.style.display = "flex";

    var popUpLogout = document.getElementById("popUpLogout");

    popUpLogout.style.display = "flex";

    var btYesLogout = document.getElementById("btYesLogout");

    btYesLogout.addEventListener("click", function () {

        fetch('/exit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': getCookie("token")
            },
        })
            .then(response => {
                if (response.ok) {
                    var btDeleteAccount = document.getElementById("btDeleteAccount");
                    btDeleteAccount.style.display = "none";
                    var btLogin = document.getElementById("btLogin");
                    btLogin.style.display = "flex";
                    var btLogout = document.getElementById("btLogout");
                    btLogout.style.display = "none";
                    var btAdicionarTask = document.getElementById("btAdicionarTask");
                    btAdicionarTask.style.display = "none";
                    var tasksList = document.getElementById("listTasks");
                    tasksList.innerHTML = "";
                    popUpLogout.style.display = "none";
                    overlay.style.display = "none";
                }
                return response.json();
            })

    });

    var btNoLogout = document.getElementById("btNoLogout");

    btNoLogout.addEventListener("click", function () {

        popUpLogout.style.display = "none";

        overlay.style.display = "none";

    });

});