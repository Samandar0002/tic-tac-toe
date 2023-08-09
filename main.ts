const statusDisplay = document.querySelector('.game--status') as HTMLHeadElement;
const gameHistoryDisplay = document.querySelector('.game--history') as HTMLDivElement;

let gameActive = true;
let currentPlayer: "X" | "O" = "X";

let gameState: string[] = ["", "", "", "", "", "", "", "", ""];
let gameHistory: { move: number, player: "X" | "O", position: number}[] = [];

const winningMessage = (): string => `Player ${currentPlayer} has won!`;
const drawMessage = (): string => `Game ended in a draw!`;
const currentPlayerTurn = (): string => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart')?.addEventListener('click', handleRestartGame);

function handleCellClick(clickedCellEvent: Event) {
    const clickedCell = clickedCellEvent.target as HTMLDivElement;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index') || "O");

    if(gameState[clickedCellIndex] !== "" || !gameActive){
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    gameHistory.push({
        move: gameHistory.length + 1,
        player: currentPlayer,
        position: clickedCellIndex
    });

    updateGameHistoryDisplay();
}

function handleCellPlayed(clickedCell: HTMLDivElement, clickedCellIndex: number) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

const winningConditions: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultValidation() {
    let roundWon = false;
    for(let i = 0; i<=7; i++){
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if(a === "" || b === "" || c === ""){
            continue;
        }
        if(a === b && b === c) {
            roundWon = true;
            break;
        }
    }
    if(roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if(roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }
    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O": "X";
    statusDisplay.innerHTML = currentPlayerTurn();

}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => (cell.innerHTML = ""));
    gameHistory = [];
    updateGameHistoryDisplay();
}

function updateGameHistoryDisplay(){
    gameHistoryDisplay.innerHTML = "";
    gameHistory.forEach(move => {
        const moveElement = document.createElement("div");
        const moveButton = document.createElement("button");
        moveButton.textContent = `Move ${move.move}: Player ${move.player} placed at position ${move.position}`;
        moveButton.addEventListener("click", () => {
            goToMove(move.move);
        });
        moveElement.appendChild(moveButton);
        gameHistoryDisplay.appendChild(moveElement);
    });
}

function goToMove(moveNumber: number) {
    if(moveNumber > 0 && moveNumber <= gameHistory.length){
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    for(let i = 0; i < moveNumber; i++) {
        const move = gameHistory[i];
        const player = move.player === "X" ? "O" : "X";
        const position = move.position;
        gameState[position] = player;
        currentPlayer = player;
    }
    document.querySelectorAll('cell').forEach((cell, index) => {
        cell.innerHTML = gameState[index];
    });
    statusDisplay.innerHTML = currentPlayerTurn();
    }
}