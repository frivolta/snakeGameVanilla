let canvas = document.getElementById("canvas");

const ROWS = 30;
const COLS = 50;
const PIXEL = 10

let currentSnake = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
let currentSnakePositions = toPositionSet(currentSnake)

let pixels = new Map()

function initCanvas() {
    for (let i = 0; i < ROWS; i++) {
        for (let k = 0; k < COLS; k++) {
            let pixel = document.createElement("div");
            pixel.style.position = "absolute";
            pixel.style.border = '1px solid #aaa';
            pixel.style.left = k * PIXEL + "px";
            pixel.style.top = i * PIXEL + "px";
            pixel.style.width = PIXEL + "px"
            pixel.style.height = PIXEL + "px"
            let position = i + '_' + k;
            canvas.appendChild(pixel)
            pixels.set(position, pixel);
        }
    }
}
function toPositionSet(toSet){
    let positionsSet = new Set();
    for (let [x, y] of toSet) {
        let position = x + '_' + y;
        positionsSet.add(position);
    }
    return positionsSet;
}
function drawSnake() {
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let position = i + '_' + j;
            let pixel = pixels.get(position);
            pixel.style.background = currentSnakePositions.has(position) ? "black" : "white";

        }
    }
}


const moveRight = ([top, left]) => [top, left + 1];
const moveLeft = ([top, left]) => [top, left - 1];
const moveUp = ([top, left]) => [top - 1, left];
const moveDown = ([top, left]) => [top + 1, left];
let currentDirection = moveDown;
let flushedDirection = currentDirection;
let directionQueue = []



function step() {
    currentSnake.shift();
    let head = currentSnake[currentSnake.length - 1];
    let nextDirection = currentDirection
    while (directionQueue.length > 0) {
        let candidateDirection = directionQueue.shift();
        if (!areOpposite(candidateDirection, currentDirection)) {
            nextDirection = candidateDirection
            break;
        }
    }
    currentDirection = nextDirection
    let nextHead = currentDirection(head);
    if (!checkValidHead(currentSnakePositions, nextHead)) {
        stopGame()

        return
    }
    currentSnake.push(nextHead)
    currentSnakePositions = toPositionSet(currentSnake)
    drawSnake()
}

function checkValidHead(positions, [top, left]) {
    if (top < 0 || left < 0) {
        return false
    }
    if (top >= ROWS || left >= COLS) {
        return false
    }
    let position = top + '_'+left;
    if(positions.has(position)){
        return false
    }
    return true
}


function stopGame() {
    clearInterval(gameInterval);
    canvas.style.borderColor = "red";
}

function areOpposite(dir1, dir2) {
    if (dir1 === moveLeft && dir2 === moveRight) {
        return true
    }
    if (dir1 === moveRight && dir2 === moveLeft) {
        return true
    }
    if (dir1 === moveUp && dir2 === moveDown) {
        return true
    }
    if (dir1 === moveDown && dir2 === moveUp) {
        return true
    }
    return false
}

let gameInterval = setInterval(() => {
    step();
    flushedDirection = currentDirection
}, 100)

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            directionQueue.push(moveLeft)
            break;
        case "ArrowRight":
            directionQueue.push(moveRight)
            break
        case "ArrowUp":
            directionQueue.push(moveUp)
            break
        case "ArrowDown":
            directionQueue.push(moveDown)
            break
    }
})


initCanvas();
drawSnake();
