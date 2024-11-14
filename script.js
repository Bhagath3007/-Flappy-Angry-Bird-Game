const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird, pipes, gameInterval, pipeInterval, isPaused, isGameOver, score;
const birdImage = new Image();
birdImage.src = 'Angrybird.png'; // Bird image URL

// Initial Game Setup
document.getElementById("startButton").onclick = startGame;
document.getElementById("pauseButton").onclick = togglePause;
document.getElementById("restartButton").onclick = restartGame;

function startGame() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    
    bird = { x: 50, y: canvas.height / 2, width: 40, height: 40, dy: 0 };
    pipes = [];
    score = 0;
    isPaused = false;
    isGameOver = false;

    // Start the game loop
    gameInterval = setInterval(gameLoop, 20);
    pipeInterval = setInterval(generatePipes, 1500);

    // Listen for spacebar or tap to make the bird "flap"
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") flap();
    });
    document.addEventListener("click", flap);
}

function flap() {
    if (!isPaused && !isGameOver) bird.dy = -8;
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;
    document.getElementById("pauseButton").innerText = isPaused ? "Resume" : "Pause";
}

function restartGame() {
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    startGame();
}

function generatePipes() {
    const gap = 200; // Gap between top and bottom pipes
    const pipeHeight = Math.floor(Math.random() * (canvas.height - gap));
    
    // Top pipe (starts from the top)
    pipes.push({ x: canvas.width, y: 0, width: 60, height: pipeHeight });
    
    // Bottom pipe (starts from the bottom, adjusted to fit the gap)
    pipes.push({ x: canvas.width, y: pipeHeight + gap, width: 60, height: canvas.height - pipeHeight - gap });
}

function gameLoop() {
    if (isPaused) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird gravity
    bird.dy += 0.5;
    bird.y += bird.dy;

    // Draw bird using image
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    // Move and draw pipes
    pipes.forEach((pipe, index) => {
        pipe.x -= 5; // Move pipes to the left
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

        // Check for collisions
        if (pipe.x < bird.x + bird.width &&
            pipe.x + pipe.width > bird.x &&
            pipe.y < bird.y + bird.height &&
            pipe.y + pipe.height > bird.y) {
            gameOver();
        }

        // Remove pipes off-screen and increment score
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            if (index % 2 === 0) score++; // Increment score when the bird passes a pair of pipes
        }
    });

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Check for out of bounds (bird hitting top or bottom of the canvas)
    if (bird.y + bird.height >= canvas.height || bird.y <= 0) gameOver();
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(pipeInterval);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
}

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
