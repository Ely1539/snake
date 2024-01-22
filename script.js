const board = document.getElementById ("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

//game settings

const boardSize= 10;
const gameSpeed = 100;
const squareTypes= {
    emptySquare:0,
    snakeSquare:1,
    foodSquare:2,
};
const directions={
    ArrowUP:-10,
    ArrowDown:10,
    ArrowRight:1,
    Arrowleft:-1,
};
//game variables

let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval; 

const drawSnake =() => {
    snake.forEach(square => drawSquare(square, "snakeSquare"));
}

//Rellena cada cuadrado del tablero
//@params
//square:posision del cuadrado
//type: tipo de cuadrado(emptuSquare,snakeSquare,foodScquare)
const drawSquare = (square, type) => {
    const [row, column] = square.split("");
    const rowIndex = parseInt(row, 10);
    const columnIndex = parseInt(column, 10);
    boardSquares[rowIndex][columnIndex] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute(`class`, `square ${type}`);

    if (type === "emptySquare") {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();
};

const moveSnake = () => {
    const currentHead = snake[snake.length - 1];
    const currentRow = parseInt(currentHead[0], 10);
    const currentColumn = parseInt(currentHead[1], 10);

    let newRow = currentRow;
    let newColumn = currentColumn;

    switch (direction) {
        case 'ArrowUp':
            newRow = (currentRow - 1 + boardSize) % boardSize;
            break;
        case 'ArrowDown':
            newRow = (currentRow + 1) % boardSize;
            break;
        case 'ArrowLeft':
            newColumn = (currentColumn - 1 + boardSize) % boardSize;
            break;
        case 'ArrowRight':
            newColumn = (currentColumn + 1) % boardSize;
            break;
    }

    const newSquare = `${newRow}${newColumn}`;
    console.log('newSquare:', newSquare);

    if (boardSquares[newRow][newColumn] === squareTypes.snakeSquare) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[newRow][newColumn] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSquare(newSquare, 'snakeSquare');
    }
};


const addFood = () =>{
    score++;
    updateScore();
    createRandomFood();
} 
const gameOver =() =>{
    gameOverSign.style.display = "block";
    clearInterval(moveInterval)
    startButton.disabled=false;
}
const setDirection = newDirection =>{
    direction = newDirection;
}

const directionEvent = key =>{
    switch (key.code){
    case "ArrowUp": 
        direction != "ArrowDown" && setDirection(key.code)
        break;
    case "ArrowDown":
        direction!="ArrowUp" && setDirection(key.code)
        break;
    case "ArrowLeft":
        direction !="ArrowRight" && setDirection(key.code)
        break;
    case "ArrowRight": 
        direction != "ArrowLeft" && setDirection(key.code)
    break;
    }
} 

const createRandomFood= () =>{
    const randomEmptySquare = emptySquares[Math.floor(Math.random()*emptySquares.length)];
   drawSquare(randomEmptySquare,"foodSquare"); 
}

const updateScore=() =>{
    scoreBoard.innerText = score;
}
const createBoard = () => {
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));

    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
        for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        }
    }
};


const startGame = () =>{
    setGame();
    gameOverSign.style.display="none";
    startButton.disabled=true;
    drawSnake();
    updateScore ();
    createRandomFood();
    document.addEventListener("keydown",directionEvent);
    moveInterval =setInterval( () => moveSnake() , gameSpeed);
}
startButton.addEventListener("click", startGame);


