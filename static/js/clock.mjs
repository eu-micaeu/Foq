function updateClock() {
    const now = new Date();
    let seconds = now.getSeconds().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');

    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Chame updateClock a cada segundo
setInterval(updateClock, 1000);
updateClock();

function updateDate() {
    const now = new Date();
    
    // Definindo os nomes dos dias da semana e dos meses
    const day = now.getDate();
    const month = now.getMonth() + 1; // Adiciona 1 ao mês
    const year = now.getFullYear();
    
    // Atualizando o conteúdo
    document.getElementById('date').textContent = month + '/' + day + '/' + year;
}

// Atualize a data quando a página carregar
updateDate();

// Atualize a data a cada dia (24 horas em milissegundos)
setInterval(updateDate, 24 * 60 * 60 * 1000);

