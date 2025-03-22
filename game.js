// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 100;

// Game variables
let snake = [
    { x: 10, y: 10 }
];
let food = generateFood();
let direction = 'right';
let gameLoop;
let score = 0;

// Get canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = canvas.width / GRID_SIZE;

// Initialize game
function init() {
    document.addEventListener('keydown', handleKeyPress);
    startGame();
}

// Start game loop
function startGame() {
    if (gameLoop) clearInterval(gameLoop);
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    score = 0;
    food = generateFood();
    document.getElementById('score').textContent = score;
    document.getElementById('gameOver').style.display = 'none';
    gameLoop = setInterval(gameStep, GAME_SPEED);
}

// Game step function
function gameStep() {
    const head = { ...snake[0] };
    
    // Update snake head position
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Check collisions
    if (isCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }

    // Draw game
    draw();
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    
    switch(key) {
        case 'arrowup':
        case 'w':
            if (direction !== 'down') direction = 'up';
            break;
        case 'arrowdown':
        case 's':
            if (direction !== 'up') direction = 'down';
            break;
        case 'arrowleft':
        case 'a':
            if (direction !== 'right') direction = 'left';
            break;
        case 'arrowright':
        case 'd':
            if (direction !== 'left') direction = 'right';
            break;
    }
}

// Check for collisions
function isCollision(position) {
    // Wall collision
    if (position.x < 0 || position.x >= GRID_SIZE ||
        position.y < 0 || position.y >= GRID_SIZE) {
        return true;
    }

    // Self collision
    return snake.some(segment => 
        segment.x === position.x && segment.y === position.y
    );
}

// Generate new food position
function generateFood() {
    while (true) {
        const food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };

        // Make sure food doesn't spawn on snake
        const onSnake = snake.some(segment =>
            segment.x === food.x && segment.y === food.y
        );

        if (!onSnake) return food;
    }
}

// Draw game state
function draw() {
    // Clear canvas
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(
            segment.x * cellSize,
            segment.y * cellSize,
            cellSize - 1,
            cellSize - 1
        );
    });

    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(
        food.x * cellSize,
        food.y * cellSize,
        cellSize - 1,
        cellSize - 1
    );
}

// Game over function
function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
}

// Restart game function
function restartGame() {
    startGame();
}

// Start the game when the page loads
window.onload = init;