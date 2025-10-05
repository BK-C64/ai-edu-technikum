const car = document.getElementById('car');
const speedDisplay = document.getElementById('speed');
const modeDisplay = document.getElementById('mode');
const gameContainer = document.getElementById('game-container');

let carX = gameContainer.offsetWidth / 2;
let carY = gameContainer.offsetHeight / 2;
let carRotation = 0; // w stopniach
let speed = 0;
let acceleration = 0.1;
let maxSpeed = 5;
let friction = 0.05;
let turnSpeed = 3; // stopnie na klatkę
let currentMode = 'Przód'; // 'Przód' lub 'Tył'

const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    p: false,
    t: false
};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

function updateCarPosition() {
    // Przyspieszanie / Zwalnianie
    if (keys.w) {
        if (currentMode === 'Przód') {
            speed = Math.min(speed + acceleration, maxSpeed);
        } else { // Tryb 'Tył'
            speed = Math.max(speed - acceleration, -maxSpeed / 2); // Mniejsza prędkość wsteczna
        }
    }
    if (keys.s) {
        if (currentMode === 'Przód') {
            speed = Math.max(speed - acceleration, -maxSpeed / 2);
        } else { // Tryb 'Tył'
            speed = Math.min(speed + acceleration, maxSpeed);
        }
    }

    // Tarcie
    if (speed > 0) {
        speed = Math.max(0, speed - friction);
    } else if (speed < 0) {
        speed = Math.min(0, speed + friction);
    }

    // Skręcanie
    if (keys.a && speed !== 0) {
        carRotation -= turnSpeed * (speed > 0 ? 1 : -1); // Skręcanie w zależności od kierunku jazdy
    }
    if (keys.d && speed !== 0) {
        carRotation += turnSpeed * (speed > 0 ? 1 : -1); // Skręcanie w zależności od kierunku jazdy
    }

    // Zmiana trybu
    if (keys.p) {
        currentMode = 'Przód';
        modeDisplay.textContent = currentMode;
    }
    if (keys.t) {
        currentMode = 'Tył';
        modeDisplay.textContent = currentMode;
    }

    // Obliczanie nowej pozycji
    const radians = carRotation * Math.PI / 180;
    carX += speed * Math.cos(radians);
    carY += speed * Math.sin(radians);

    // Kolizje ze ścianami kontenera
    const carWidth = car.offsetWidth;
    const carHeight = car.offsetHeight;

    if (carX - carWidth / 2 < 0) {
        carX = carWidth / 2;
        speed = 0; // Zatrzymanie po uderzeniu
    }
    if (carX + carWidth / 2 > gameContainer.offsetWidth) {
        carX = gameContainer.offsetWidth - carWidth / 2;
        speed = 0; // Zatrzymanie po uderzeniu
    }
    if (carY - carHeight / 2 < 0) {
        carY = carHeight / 2;
        speed = 0; // Zatrzymanie po uderzeniu
    }
    if (carY + carHeight / 2 > gameContainer.offsetHeight) {
        carY = gameContainer.offsetHeight - carHeight / 2;
        speed = 0; // Zatrzymanie po uderzeniu
    }

    // Aktualizacja stylu samochodu
    car.style.left = `${carX}px`;
    car.style.top = `${carY}px`;
    car.style.transform = `translate(-50%, -50%) rotate(${carRotation}deg)`;

    // Aktualizacja wyświetlacza prędkości
    speedDisplay.textContent = Math.abs(Math.round(speed * 10)); // Prędkość w km/h (przybliżenie)

    requestAnimationFrame(updateCarPosition);
}

// Inicjalizacja pozycji samochodu
car.style.left = `${carX}px`;
car.style.top = `${carY}px`;
car.style.transform = `translate(-50%, -50%) rotate(${carRotation}deg)`;

updateCarPosition();