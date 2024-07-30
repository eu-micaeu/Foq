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