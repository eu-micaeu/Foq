function updateClock() {

    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    const secondDegree = (seconds / 60) * 360;
    const minuteDegree = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegree = (hours / 12) * 360 + (minutes / 60) * 30;

    document.getElementById('second').style.transform = `rotate(${secondDegree}deg)`;
    document.getElementById('minute').style.transform = `rotate(${minuteDegree}deg)`;
    document.getElementById('hour').style.transform = `rotate(${hourDegree}deg)`;

}

setInterval(updateClock, 1000);

updateClock();

function updateDate() {
    const now = new Date();
    
    // Definindo os nomes dos dias da semana e dos meses
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    
    // Atualizando o conteúdo
    document.getElementById('date').textContent = month + '/' + day + '/' + year;
}

// Atualize a data quando a página carregar
updateDate();

// Atualize a data a cada dia (24 horas em milissegundos)
setInterval(updateDate, 24 * 60 * 60 * 1000);
