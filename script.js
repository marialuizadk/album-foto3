const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio("../assets/audio.mp3");

const size = 30;
const initialPosition = { x: 270, y: 240 };

let snake = [initialPosition];

const TARGET_SCORE = 60; // Pontuação máxima
const REDIRECT_SCORE = TARGET_SCORE; // Pontuação para redirecionamento

const incrementScore = () => {
    score.innerText = +score.innerText + 10;

    // Verifica se atingiu a pontuação para redirecionamento
    if (+score.innerText >= REDIRECT_SCORE) {
        goToPhotoAlbum();
    }
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / size) * size;
};

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

let direction, loopId;

const drawFood = () => {
    const { x, y, color } = food;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawSnake = () => {
    ctx.fillStyle = "#ddd";
    snake.forEach((position, index) => {
        ctx.fillStyle = index === snake.length - 1 ? "white" : "#ddd";
        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({ x: head.x + size, y: head.y });
    }
    if (direction === "left") {
        snake.push({ x: head.x - size, y: head.y });
    }
    if (direction === "down") {
        snake.push({ x: head.x, y: head.y + size });
    }
    if (direction === "up") {
        snake.push({ x: head.x, y: head.y - size });
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "orange";
    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];
    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push(head);
        audio.play();

        let x, y;
        do {
            x = randomPosition();
            y = randomPosition();
        } while (snake.find((position) => position.x === x && position.y === y));

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const selfCollision = snake.find((position, index) => index < neckIndex && position.x === head.x && position.y === head.y);

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(20px)";
};

const goToPhotoAlbum = () => {
    clearInterval(loopId); // Para o loop do jogo
    alert("Você atingiu a pontuação de 60! Redirecionando para o álbum de fotos.");
    window.location.href = "index2.html"; // Altere para a URL do seu álbum de fotos
};

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(gameLoop, 300);
};

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direction !== "left") direction = "right";
    if (key === "ArrowLeft" && direction !== "right") direction = "left";
    if (key === "ArrowDown" && direction !== "up") direction = "down";
    if (key === "ArrowUp" && direction !== "down") direction = "up";
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [initialPosition];
    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor(); // Reset food
    direction = undefined; // Reset direction
    gameLoop(); // Start game loop
});

// Initialize game loop
gameLoop();
