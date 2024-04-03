//HTML Objects
const boardGame = document.getElementById('boardGame');
const scoreBoard = document.getElementById('scoreBoard');
const start = document.getElementById('start');
const gameOver = document.getElementById('gameOver');

//Game settings
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

const directions = {
    arrowUp: -10,
    arrowDown: 10,
    arrowRight: 1,
    arrowLeft: -1
}

//Game Variables
let snake;
let score;
let direction;
let boardSquare;
let emptySquare;
let moveInterval;

const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
};

// Rellena cada cuadrado del tablero
// @params 
// square: posicion del cuadrado,
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
    const [row, column] = square.split('');
    boardSquare[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquare.push(square);
    } else {
        if (emptySquare.indexOf(square) !== -1) {
            emptySquare.splice(emptySquare.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');

    if( newSquare < 0 || 
        newSquare > boardSize * boardSize ||
        (direction === 'arrowRight' && column == 0) ||
        (direction === 'arrowLeft' && column == 9 ||
        boardSquare[row][column] === squareTypes.snakeSquare) ) {
        gameOverText();
    } else {
        snake.push(newSquare);
        if(boardSquare[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
};

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
};

const gameOverText = () => {
    gameOver.style.display = 'block';
    clearInterval(moveInterval);
    start.disabled = false;
};

const setDirection = newDirection => {
    direction = newDirection;
};

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            if (direction !== 'arrowDown') {
                setDirection('arrowUp');
            }
            break;
        case 'ArrowDown':
            if (direction !== 'arrowUp') {
                setDirection('arrowDown');
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'arrowRight') {
                setDirection('arrowLeft');
            }
            break;
        case 'ArrowRight':
            if (direction !== 'arrowLeft') {
                setDirection('arrowRight');
            }
            break;
    }
};

const createRandomFood = () => {
    const randomEmptySquare = emptySquare[Math.floor(Math.random() * emptySquare.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
};

const updateScore = () => {
    scoreBoard.innerHTML = score - 4;
};

const createBoard = () => {
boardSquare.forEach( (row, rowIndex) => {
    row.forEach( (column, columnIndex) => {
        const squareValue = `${rowIndex}${columnIndex}`;
        const squareElement = document.createElement('div');
        squareElement.setAttribute('class', 'square emptySquare');
        squareElement.setAttribute('id', squareValue);
        boardGame.appendChild(squareElement);
        emptySquare.push(squareValue)
    })
})
};

const setGame = () => {
snake = ['00', '01', '02', '03'];
score = snake.length;
direction = 'arrowRight';
boardSquare = Array.from(Array(boardSize), ()=> new Array(boardSize).fill(squareTypes.emptySquare));
console.log(boardSquare)
boardGame.innerHTML = '';
emptySquare = [];
createBoard();
};

const startGame = () => {
setGame();
gameOver.style.display = 'none';
start.disabled = true;
drawSnake();
updateScore();
createRandomFood();
document.addEventListener('keydown', directionEvent);
moveInterval = setInterval( () => moveSnake(), gameSpeed);
};

start.addEventListener('click', startGame)