const canvas = document.getElementById("menuCanvas");
const context = canvas.getContext("2d");

// Música de fondo
const backgroundMusic = new Audio("assets/audio/background-music(jonathan-gaming-143999).mp3");
const menuSelectSound = new Audio("assets/audio/menu-selection(mp3cut.net).mp3");
const menuConfirmSound = new Audio("assets/audio/button-universfield.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 1;
let currentVolume = 1;
let musicOn = true;
let isDragging = false;

// Estados del menú
const menuOptions = ["Jugar", "Opciones", "Salir"];
let selectedOption = 0;
let optionsSelected = 0; // 0: slider, 1: Atrás
let viewOptionsMenu = false;
let viewGameModeMenu = false;
let hoverMainMenu = -1;
let hoverSlider = false;
let hoverBack = false;
let selectedGameMode = 0; // 0: 1 jugador, 1: 2 jugadores
let hoverGameMode = -1;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawMenu();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawMenu() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (viewGameModeMenu) {
        dibujarTexto("Selecciona el modo de juego", 50, canvas.width / 2, 150, "white");

        const modoWidth = canvas.width / 2;
        
        let color1P = (selectedGameMode === 0 || hoverGameMode === 0) ? "yellow" : "white";
        dibujarTexto("1 Jugador", 40, modoWidth / 2, canvas.height / 2 - 30, color1P);
        dibujarTexto("Flechas", 25, modoWidth / 2, canvas.height / 2 + 20, color1P);
        
        context.strokeStyle = "white";
        context.beginPath();
        context.moveTo(canvas.width / 2, 200);
        context.lineTo(canvas.width / 2, canvas.height - 200);
        context.stroke();
        
        let color2P = (selectedGameMode === 1 || hoverGameMode === 1) ? "yellow" : "white";
        dibujarTexto("2 Jugadores", 40, canvas.width / 2 + modoWidth / 2, canvas.height / 2 - 30, color2P);
        dibujarTexto("Flechas y WASD", 25, canvas.width / 2 + modoWidth / 2, canvas.height / 2 + 20, color2P);

        let colorBotonAtras = (selectedGameMode === -1 || hoverBack) ? "yellow" : "white";
        dibujarTexto("Atrás", 40, canvas.width / 2, canvas.height - 100, colorBotonAtras);
    } else if (viewOptionsMenu) {
        dibujarTexto("Opciones", 50, canvas.width / 2, 150, "white");

        dibujarTexto("Volumen", 30, canvas.width / 2, 260, "white");

        let sliderX = canvas.width / 2 - 100;
        let sliderY = 300;
        
        context.fillStyle = "white";
        context.fillRect(sliderX, sliderY, 200, 20);
        
        let handleX = sliderX + (currentVolume * 200) - 5;
        context.fillStyle = (optionsSelected === 0 || hoverSlider) ? "yellow" : "white";
        context.fillRect(handleX, sliderY - 5, 10, 30);

        let colorBotonAtras = (optionsSelected === 1 || hoverBack) ? "yellow" : "white";
        dibujarTexto("Atrás", 40, canvas.width / 2, 450, colorBotonAtras);
    } else {
        dibujarTexto("Dark Maze", 50, canvas.width / 2, 150, "white");

        for(let i = 0; i < menuOptions.length; i++) {
            let estaSeleccionado = (i === selectedOption || i === hoverMainMenu);
            let color = estaSeleccionado ? "yellow" : "white";
            dibujarTexto(menuOptions[i], 40, canvas.width / 2, 350 + i * 100, color);
        }
    }
}

function dibujarTexto(texto, tamano, x, y, color) {
    context.fillStyle = color;
    context.font = tamano + "px Arial";
    context.textAlign = "center";
    context.fillText(texto, x, y);
}

function updateVolume() {
    backgroundMusic.volume = currentVolume;
    if (currentVolume <= 0 && !backgroundMusic.paused) {
        backgroundMusic.pause();
    } else if (currentVolume > 0 && backgroundMusic.paused) {
        backgroundMusic.play();
    }
}

function playBackgroundMusic() {
    if (musicOn && backgroundMusic.paused) {
        backgroundMusic.play();
    }
}

function playMenuSelectSound() {
    menuSelectSound.currentTime = 0;
    menuSelectSound.volume = currentVolume;
    menuSelectSound.play();
}

function playMenuConfirmSound() {
    menuConfirmSound.currentTime = 0;
    menuConfirmSound.volume = currentVolume;
    menuConfirmSound.play();
}

// Eventos de teclado
document.addEventListener("keydown", (e) => {
    playBackgroundMusic();
    
    if (viewGameModeMenu) {
        switch(e.key) {
            case "ArrowLeft":
            case "ArrowRight":
                playMenuSelectSound();
                selectedGameMode = e.key === "ArrowLeft" ? 0 : 1;
                break;
            case "ArrowUp":
            case "ArrowDown":
                playMenuSelectSound();
                if (selectedGameMode === -1) {
                    selectedGameMode = 0;
                } else {
                    selectedGameMode = -1; 
                }
                break;
            case "Enter":
                if (selectedGameMode === -1) {
                    playMenuConfirmSound();
                    viewGameModeMenu = false;
                } else {
                    handleGameModeSelection(selectedGameMode);
                }
                break;
            case "Escape":
                playMenuConfirmSound();
                viewGameModeMenu = false;
                break;
        }
        drawMenu();
        return;
    }

    if (viewOptionsMenu) {
        switch(e.key) {
            case "ArrowUp":
            case "ArrowDown":
                playMenuSelectSound();
                optionsSelected = e.key === "ArrowUp" ? 
                    Math.max(0, optionsSelected - 1) : 
                    Math.min(1, optionsSelected + 1);
                break;
            case "ArrowLeft":
            case "ArrowRight":
                if (optionsSelected === 0) {
                    playMenuSelectSound();
                    currentVolume = e.key === "ArrowLeft" ?
                        Math.max(0, currentVolume - 0.05) :
                        Math.min(1, currentVolume + 0.05);
                    updateVolume();
                }
                break;
            case "Enter":
                playMenuConfirmSound();
                if (optionsSelected === 1) viewOptionsMenu = false;
                break;
            case "Escape":
                playMenuConfirmSound();
                viewOptionsMenu = false;
                break;
        }
    } else {
        switch(e.key) {
            case "ArrowUp":
            case "ArrowDown":
                playMenuSelectSound();
                selectedOption = e.key === "ArrowUp" ?
                    (selectedOption > 0 ? selectedOption - 1 : menuOptions.length - 1) :
                    (selectedOption < menuOptions.length - 1 ? selectedOption + 1 : 0);
                break;
            case "Enter":
                playMenuConfirmSound();
                handleMenuSelection();
                break;
        }
    }
    drawMenu();
});

function openOptions() {
    viewOptionsMenu = true;
    optionsSelected = 0;
    drawMenu();
}

function handleMenuSelection() {
    if (selectedOption === 0) {
        // Jugar
        viewGameModeMenu = true;
        selectedGameMode = 0;
        hoverGameMode = -1;
    } else if (selectedOption === 1) {
        openOptions();
    } else if (selectedOption === 2) {
        alert("Saliendo del juego...");
    }
}

function handleGameModeSelection(mode) {
    playMenuConfirmSound();
    setTimeout(() => {
        localStorage.setItem('gameMode', mode);
        window.location.href = 'game.html';
    }, 400);
}

// Eventos del ratón
canvas.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    if (viewGameModeMenu) {
        let antiguoHoverGameMode = hoverGameMode;
        let antiguoHoverBack = hoverBack;
        
        if (mouseY >= canvas.height / 2 - 50 && mouseY <= canvas.height / 2 + 30) {
            if (mouseX < canvas.width / 2) {
                hoverGameMode = 0;
            } else {
                hoverGameMode = 1;
            }
        } else {
            hoverGameMode = -1;
        }

        hoverBack = mouseY >= canvas.height - 130 && mouseY <= canvas.height - 70 &&
                   mouseX >= canvas.width / 2 - 50 && mouseX <= canvas.width / 2 + 50;

        if (antiguoHoverGameMode !== hoverGameMode || antiguoHoverBack !== hoverBack) {
            drawMenu();
        }
        return;
    }

    if (isDragging && viewOptionsMenu) {
        let sliderX = canvas.width / 2 - 100;
        currentVolume = Math.max(0, Math.min(1, (mouseX - sliderX) / 200));
        updateVolume();
        drawMenu();
        return;
    }

    if (viewOptionsMenu) {
        let sliderX = canvas.width / 2 - 100;
        let sliderY = 300;
        
        let antiguoHoverSlider = hoverSlider;
        hoverSlider = mouseX >= sliderX && mouseX <= sliderX + 200 && 
                     mouseY >= sliderY - 15 && mouseY <= sliderY + 35;

        let antiguoHoverBack = hoverBack;
        hoverBack = mouseY >= 420 && mouseY <= 460 &&
                   mouseX >= canvas.width / 2 - 50 && mouseX <= canvas.width / 2 + 50;

        if (hoverSlider) optionsSelected = 0;
        if (hoverBack) optionsSelected = 1;

        if (antiguoHoverSlider !== hoverSlider || antiguoHoverBack !== hoverBack) {
            drawMenu();
        }
    } else {
        let antiguoHoverMenu = hoverMainMenu;
        hoverMainMenu = -1;
        
        for(let i = 0; i < menuOptions.length; i++) {
            let posicionY = 350 + i * 100;
            if (mouseY >= posicionY - 40 && mouseY <= posicionY &&
                mouseX >= canvas.width / 2 - 100 && mouseX <= canvas.width / 2 + 100) {
                hoverMainMenu = i;
                selectedOption = i;
            }
        }

        if (antiguoHoverMenu !== hoverMainMenu) {
            drawMenu();
        }
    }
});

canvas.addEventListener("mousedown", (e) => {
    playBackgroundMusic();
    
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    if (viewGameModeMenu) {
        if (hoverGameMode !== -1) {
            handleGameModeSelection(hoverGameMode);
        } else if (hoverBack) {
            playMenuConfirmSound();
            viewGameModeMenu = false;
        }
        drawMenu();
        return;
    }

    if (viewOptionsMenu) {
        if (hoverSlider) {
            playMenuSelectSound();
            currentVolume = Math.max(0, Math.min(1, (mouseX - (canvas.width / 2 - 100)) / 200));
            updateVolume();
            drawMenu();
            isDragging = true;
        }
        if (hoverBack) {
            playMenuConfirmSound();
            viewOptionsMenu = false;
        }
    } else {
        if (hoverMainMenu !== -1) {
            playMenuConfirmSound();
            selectedOption = hoverMainMenu;
            handleMenuSelection();
        }
    }
    drawMenu();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => {
    isDragging = false;
    hoverMainMenu = -1;
    hoverSlider = false;
    hoverBack = false;
    drawMenu();
});

// Inicializar el menú
resizeCanvas();
drawMenu();
playBackgroundMusic();