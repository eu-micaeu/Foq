// Abrir o popUp

document.getElementById("btRegister").addEventListener("click", function () {

    var popUpRegister = document.getElementById("popUpRegister");

    var overlay = document.getElementById("overlay");

    popUpRegister.style.display = "block";

    overlay.style.display = "block";

});

// Submit form Register

document.getElementById("btSubmitRegister").addEventListener("click", function (event) {

    event.preventDefault(); // Previne o comportamento padrão de submissão do formulário

    var emailRegister = document.getElementById("emailRegister").value;

    var fullNameRegister = document.getElementById("fullNameRegister").value;

    var usernameRegister = document.getElementById("usernameRegister").value;

    var passwordRegister = document.getElementById("passwordRegister").value;

    // Utilizando a API Fetch para fazer a requisição POST /register e me mostre a resposta

    fetch('/register', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json'

        },

        body: JSON.stringify({

            email: emailRegister,

            full_name: fullNameRegister,

            username: usernameRegister,

            password: passwordRegister

        })

    })

        .then(response => {

            if (response.ok) {

                var popUpLogin = document.getElementById("popUpLogin");

                var popUpRegister = document.getElementById("popUpRegister");

                var overlay = document.getElementById("overlay");

                popUpLogin.style.display = "none";

                popUpRegister.style.display = "none";

                overlay.style.display = "none";


            }

            return response.json();

        })

        .catch(error => {

            console.error('Error:', error);

        });

});