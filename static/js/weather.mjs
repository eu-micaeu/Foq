function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const apiKey = 'bb6c66a151a7565e84a60578bf0b13ac';
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data); // Log da resposta completa da API
                        if (data.main) {
                            const temperature = (data.main.temp).toFixed(1) + '°C';
                            document.getElementById('temperature').innerText = temperature;
                        } else {
                            console.error('Dados de clima não encontrados:', data);
                        }
                    })
                    .catch(error => console.error('Erro ao obter o clima:', error));
            },
            error => {
                console.error('Erro ao obter a localização:', error);
                document.getElementById('temperature').innerText = 'Localização negada';
            }
        );
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
    }
}

// Chama a função para obter o clima ao carregar a página
window.onload = getWeather;
