# Dark Maze 🌑

## Descripción
Dark Maze es un juego de laberinto en la oscuridad desarrollado con JavaScript y Canvas. Los jugadores deben navegar a través de un laberinto oscuro donde solo pueden ver lo que está dentro de su radio de luz.

## Características principales
- 🎮 Dos modos de juego:
  - Modo un jugador
  - Modo dos jugadores (local)
- 🔦 Sistema de iluminación dinámica
- 🎵 Efectos de sonido y música ambiental


## Controles
### Modo Un Jugador
- Flechas direccionales: Mover al jugador

### Modo Dos Jugadores
- Jugador 1: Flechas direccionales
- Jugador 2: WASD
- ESC: Volver al menú principal

## Tecnologías utilizadas
- HTML5 Canvas
- JavaScript vanilla
- CSS3

## Estructura del proyecto
```javascript
/dark-maze
  ├── index.html          # Página principal del menú
  ├── game.html          # Página del juego
  ├── css/
  │   └── styles.css     # Estilos globales
  ├── js/
  │   ├── menu.js        # Lógica del menú principal
  │   └── game.js        # Lógica principal del juego
  ├── assets/
  │   └── audio/         # Archivos de audio y música
  └── licences/          # Licencias de recursos utilizados
```

## Características técnicas destacadas

### Sistema de iluminación
El juego implementa un sistema de iluminación dinámica usando dos canvas superpuestos:
- Canvas principal: Renderiza el laberinto y los jugadores
- Canvas de iluminación: Crea el efecto de oscuridad y el radio de luz alrededor de los jugadores

### Menú interactivo
- Selección de modo de juego
- Control de volumen
- Navegación mediante teclado y ratón
- Efectos de sonido en la interfaz

### Sistema de colisiones
Implementación de detección de colisiones para:
- Paredes del laberinto
- Interacción entre jugadores
- Detección de victoria al alcanzar la meta

## Instalación y ejecución
1. Clona el repositorio
2. Abre `index.html` en tu navegador web
3. ¡Disfruta del juego!

## Requisitos del sistema
- Navegador web moderno con soporte para HTML5 Canvas
- JavaScript habilitado
- Conexión a internet (para la primera carga de recursos)

## Créditos
Música y efectos de sonido obtenidos de Pixabay bajo licencia Pixabay:
- Música de menú: "Jonathan Gaming" por OneTent
- Música de juego: "Horror Background Tension" por DeloSound

## Licencia
Este proyecto está disponible bajo la licencia MIT. Ver el archivo LICENSE para más detalles.