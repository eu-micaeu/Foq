document.getElementById("overlay").addEventListener("click", function () {

    var popUpLogin = document.getElementById("popUpLogin");

    var popUpRegister = document.getElementById("popUpRegister");

    var popUpTask = document.getElementById("popUpTask");

    var popUpAddTask = document.getElementById("popUpAddTask");

    var popUpLogout = document.getElementById("popUpLogout");

    var overlay = document.getElementById("overlay");

    popUpLogin.style.display = "none";

    popUpRegister.style.display = "none";

    popUpTask.style.display = "none";

    popUpAddTask.style.display = "none";

    popUpLogout.style.display = "none";

    overlay.style.display = "none";

});