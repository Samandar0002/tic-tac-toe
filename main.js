var _a;
var statusDisplay = document.querySelector('.game--status');
var gameHistoryDisplay = document.querySelector('.game--history');
var gameActive = true;
var currentPlayer = "X";
var gameState = ["", "", "", "", "", "", "", "", ""];
var gameHistory = [];
var winningMessage = function () { return "Player ".concat(currentPlayer, " has won!"); };
var drawMessage = function () { return "Game ended in a draw!"; };
var currentPlayerTurn = function () { return "It's ".concat(currentPlayer, "'s turn"); };
statusDisplay.innerHTML = currentPlayerTurn();
document.querySelectorAll('.cell').forEach(function (cell) { return cell.addEventListener('click', handleCellClick); });
(_a = document.querySelector('.game--restart')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', handleRestartGame);
function handleCellClick(clickedCellEvent) {
    var clickedCell = clickedCellEvent.target;
    var clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index') || "O");
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
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
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}
var winningConditions = [
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
    var roundWon = false;
    for (var i = 0; i <= 7; i++) {
        var winCondition = winningConditions[i];
        var a = gameState[winCondition[0]];
        var b = gameState[winCondition[1]];
        var c = gameState[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }
    var roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }
    handlePlayerChange();
}
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(function (cell) { return (cell.innerHTML = ""); });
    gameHistory = [];
    updateGameHistoryDisplay();
}
function updateGameHistoryDisplay() {
    gameHistoryDisplay.innerHTML = "";
    gameHistory.forEach(function (move) {
        var moveElement = document.createElement("div");
        var moveButton = document.createElement("button");
        moveButton.textContent = "Move ".concat(move.move, ": Player ").concat(move.player, " placed at position ").concat(move.position);
        moveButton.addEventListener("click", function () {
            goToMove(move.move);
        });
        moveElement.appendChild(moveButton);
        gameHistoryDisplay.appendChild(moveElement);
    });
}
function goToMove(moveNumber) {
    if (moveNumber > 0 && moveNumber <= gameHistory.length) {
        gameState = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        for (var i = 0; i < moveNumber; i++) {
            var move = gameHistory[i];
            var player = move.player === "X" ? "O" : "X";
            var position = move.position;
            gameState[position] = player;
            currentPlayer = player;
        }
        document.querySelectorAll('cell').forEach(function (cell, index) {
            cell.innerHTML = gameState[index];
        });
        statusDisplay.innerHTML = currentPlayerTurn();
    }
}
