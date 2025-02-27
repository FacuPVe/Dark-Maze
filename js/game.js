const GRID_SIZE = Math.min(window.innerWidth, window.innerHeight) / 20; 
const COLS = Math.floor(window.innerWidth / GRID_SIZE); 
const ROWS = Math.floor(window.innerHeight / GRID_SIZE); 

const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
const lightCanvas = document.getElementById('lightCanvas');
const lightCtx = lightCanvas.getContext('2d');

// Ajustar tamaño de los canvas
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;
lightCanvas.width = window.innerWidth;
lightCanvas.height = window.innerHeight;

let player1GridX = 1;
let player1GridY = 1;

let player2GridX = 2;
let player2GridY = 1;

const goalGridX = Math.floor(COLS * 0.8);
const goalGridY = Math.floor(ROWS * 0.8);

const maze = [];
for (let i = 0; i < ROWS; i++) {
    maze[i] = [];
    for (let j = 0; j < COLS; j++) {
        maze[i][j] = 0;
    }
}

// ^Paredes
const walls = [
    {gridX: 3, gridY: 1, width: 1, height: 5}, 
    {gridX: 7, gridY: 3, width: 1, height: 5}, 
    {gridX: 3, gridY: 1, width: 3, height: 1},
    {gridX: 7, gridY: 8, width: 3, height: 1}, 
    {gridX: 1, gridY: 5, width: 1, height: 3},
    {gridX: 5, gridY: 5, width: 1, height: 3},
    {gridX: 9, gridY: 5, width: 1, height: 3},
    {gridX: 13, gridY: 5, width: 1, height: 3},
    {gridX: 1, gridY: 9, width: 1, height: 3},
    {gridX: 5, gridY: 9, width: 1, height: 3},
    {gridX: 9, gridY: 9, width: 1, height: 3},
    {gridX: 13, gridY: 9, width: 1, height: 3},
    {gridX: 1, gridY: 13, width: 1, height: 3},
    {gridX: 5, gridY: 13, width: 1, height: 3},
    {gridX: 9, gridY: 13, width: 1, height: 3},
    {gridX: 13, gridY: 13, width: 1, height: 3},
    {gridX: 1, gridY: 17, width: 1, height: 3},
    {gridX: goalGridX - 2, gridY: goalGridY - 2, width: 4, height: 1},
    {gridX: goalGridX - 2, gridY: goalGridY - 2, width: 1, height: 4},
    {gridX: 8, gridY: 7, width: 3, height: 1},
    {gridX: 11, gridY: 7, width: 1, height: 3},
    {gridX: 8, gridY: 9, width: 3, height: 1},
    {gridX: 8, gridY: 9, width: 1, height: 3},
    {gridX: 8, gridY: 11, width: 3, height: 1},
    {gridX: 4, gridY: 6, width: 3, height: 1},
    {gridX: 6, gridY: 6, width: 1, height: 3},
    {gridX: 15, gridY: 8, width: 3, height: 1},
    {gridX: 15, gridY: 8, width: 1, height: 3},
    {gridX: 2, gridY: 8, width: 2, height: 2},
    {gridX: 12, gridY: 12, width: 2, height: 2},
    {gridX: 6, gridY: 15, width: 2, height: 2},
    {gridX: 16, gridY: 14, width: 2, height: 2},
    {gridX: 10, gridY: 2, width: 1, height: 4},
    {gridX: 14, gridY: 3, width: 4, height: 1},
    {gridX: 3, gridY: 16, width: 4, height: 1},
    {gridX: 18, gridY: 10, width: 1, height: 4},
    {gridX: 4, gridY: 11, width: 2, height: 1},
    {gridX: 5, gridY: 12, width: 2, height: 1},
    {gridX: 6, gridY: 13, width: 2, height: 1},
    {gridX: 13, gridY: 15, width: 1, height: 1},
    {gridX: 15, gridY: 16, width: 1, height: 1},
    {gridX: 17, gridY: 17, width: 1, height: 1},
    {gridX: 11, gridY: 14, width: 1, height: 1},
    {gridX: 20, gridY: 11, width: 10, height: 4},


];

walls.forEach(wall => {
    for(let y = wall.gridY; y < wall.gridY + wall.height; y++) {
        for(let x = wall.gridX; x < wall.gridX + wall.width; x++) {
            maze[y][x] = 1;
        }
    }
});

let gameActive = false;
const gameMode = parseInt(localStorage.getItem('gameMode')) || 0;

const menuConfirmSound = new Audio("assets/audio/button-universfield.mp3");
menuConfirmSound.volume = 1;


const backgroundMusic = new Audio("assets/audio/horror-background-tension-254885.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.7; 

window.onload = () => {
    gameActive = true;
    gameCanvas.style.display = 'block';
    lightCanvas.style.display = 'block';
    drawGame();
};

let musicStarted = false;

function startBackgroundMusic() {
    if (!musicStarted) {
        backgroundMusic.play()
            .then(() => {
                musicStarted = true;
            })
    }
}

function drawGame() {
    clearCanvas();
    drawBackground();
    drawWalls();
    drawGoal();
    drawPlayers();
    drawLighting();
}

function clearCanvas() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawBackground() {
    gameCtx.fillStyle = '#333';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawWalls() {
    gameCtx.fillStyle = '#666';
    for (let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        gameCtx.fillRect(
            wall.gridX * GRID_SIZE,
            wall.gridY * GRID_SIZE,
            wall.width * GRID_SIZE,
            wall.height * GRID_SIZE
        );
    }
}

function drawGoal() {
    gameCtx.fillStyle = '#44ff44';
    gameCtx.beginPath();
    gameCtx.arc(
        (goalGridX + 0.5) * GRID_SIZE,
        (goalGridY + 0.5) * GRID_SIZE,
        GRID_SIZE/2,
        0,
        Math.PI * 2
    );
    gameCtx.fill();
}

function drawPlayers() {
    // Dibujar jugador 1
    gameCtx.fillStyle = '#ff4444';
    gameCtx.beginPath();
    gameCtx.arc(
        (player1GridX + 0.5) * GRID_SIZE,
        (player1GridY + 0.5) * GRID_SIZE,
        GRID_SIZE/2,
        0,
        Math.PI * 2
    );
    gameCtx.fill();
    
    // Dibujar jugador 2 si está en modo 2 jugadores
    if (gameMode === 1) {
        gameCtx.fillStyle = '#4444ff';
        gameCtx.beginPath();
        gameCtx.arc(
            (player2GridX + 0.5) * GRID_SIZE,
            (player2GridY + 0.5) * GRID_SIZE,
            GRID_SIZE/2,
            0,
            Math.PI * 2
        );
        gameCtx.fill();
    }
}

function drawLighting() {
    lightCtx.clearRect(0, 0, lightCanvas.width, lightCanvas.height);
    
    lightCtx.fillStyle = 'rgba(0, 0, 0, 1)';
    lightCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);
    
    lightCtx.globalCompositeOperation = 'destination-out';
    
    createPlayerLight(player1GridX, player1GridY);
    
    if (gameMode === 1) {
        createPlayerLight(player2GridX, player2GridY);
    }
    
    lightCtx.globalCompositeOperation = 'source-over';
}

function createPlayerLight(playerX, playerY) {
    const gradient = lightCtx.createRadialGradient(
        (playerX + 0.5) * GRID_SIZE,
        (playerY + 0.5) * GRID_SIZE,
        0,
        (playerX + 0.5) * GRID_SIZE,
        (playerY + 0.5) * GRID_SIZE,
        GRID_SIZE * 4
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    lightCtx.fillStyle = gradient;
    lightCtx.beginPath();
    lightCtx.arc(
        (playerX + 0.5) * GRID_SIZE,
        (playerY + 0.5) * GRID_SIZE,
        GRID_SIZE * 4,
        0,
        Math.PI * 2
    );
    lightCtx.fill();
}

// Modificar la función checkWin para manejar dos jugadores
function checkWin() {
    if (player1GridX === goalGridX && player1GridY === goalGridY) {
        gameActive = false;
        setTimeout(() => {
            alert('¡Jugador 1 ganó!');
            returnToMenu();
        }, 100);
    } else if (gameMode === 1 && player2GridX === goalGridX && player2GridY === goalGridY) {
        gameActive = false;
        setTimeout(() => {
            alert('¡Jugador 2 ganó!');
            returnToMenu();
        }, 100);
    }
}

// Función para volver al menú
function returnToMenu() {
    backgroundMusic.pause(); 
    backgroundMusic.currentTime = 0; 
    
    if (menuConfirmSound) {
        menuConfirmSound.currentTime = 0;
        menuConfirmSound.play();
        setTimeout(() => {
            localStorage.removeItem('gameMode');
            window.location.href = 'index.html';
        }, 400);
    } else {
        localStorage.removeItem('gameMode');
        window.location.href = 'index.html';
    }
}

// Mover jugador 1 (flechas)
function movePlayer1(dx, dy) {
    const newX = player1GridX + dx;
    const newY = player1GridY + dy;
    
    // Verificar límites y colisiones
    if (newX >= 0 && newX < COLS && 
        newY >= 0 && newY < ROWS && 
        maze[newY][newX] !== 1 &&
        !(gameMode === 1 && newX === player2GridX && newY === player2GridY)) {
        player1GridX = newX;
        player1GridY = newY;
        drawGame();
        checkWin();
    }
}

// Mover jugador 2 (WASD)
function movePlayer2(dx, dy) {
    const newX = player2GridX + dx;
    const newY = player2GridY + dy;
    
    // Verificar límites y colisiones
    if (newX >= 0 && newX < COLS && 
        newY >= 0 && newY < ROWS && 
        maze[newY][newX] !== 1 &&
        !(newX === player1GridX && newY === player1GridY)) {
        player2GridX = newX;
        player2GridY = newY;
        drawGame();
        checkWin();
    }
}

window.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    
    startBackgroundMusic(); 
    
    switch(e.key) {
        case 'ArrowLeft':
            movePlayer1(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer1(1, 0);
            break;
        case 'ArrowUp':
            movePlayer1(0, -1);
            break;
        case 'ArrowDown':
            movePlayer1(0, 1);
            break;
    }
    
    if (gameMode === 1) {
        switch(e.key.toLowerCase()) {
            case 'a':
                movePlayer2(-1, 0);
                break;
            case 'd':
                movePlayer2(1, 0);
                break;
            case 'w':
                movePlayer2(0, -1);
                break;
            case 's':
                movePlayer2(0, 1);
                break;
        }
    }
    
    if (e.key === 'Escape') {
        returnToMenu();
    }
});

// Agregar evento de redimensionamiento
window.addEventListener('resize', () => {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    lightCanvas.width = window.innerWidth;
    lightCanvas.height = window.innerHeight;
    drawGame();
});

window.addEventListener('click', () => {
    startBackgroundMusic();
});

// Inicializar juego
drawGame();