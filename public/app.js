const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-button");
const newGameBtn = document.getElementById("new-button");
const drawResetBtn = document.getElementById("draw-reset");
const winnerContainer = document.querySelector(".winner-container");
const drawContainer = document.querySelector(".draw-container");
const message = document.getElementById("message");
const currentPlayerDisplay = document.getElementById("current-player");

let turnO = false;
let count = 0;
let playerType = '';
let isPlayerTurn = false;

const socket = io();

// Assign player type
socket.on("playerType", (type) => {
  playerType = type;
  isPlayerTurn = type === 'X';
  currentPlayerDisplay.innerText = "X";
  currentPlayerDisplay.style.color = "var(--x-color)";
  
  if (type === "spectator") {
    alert("Game is full. You are a spectator.");
  }
});

// Handle opponent's move
socket.on("opponentMove", ({ index, symbol }) => {
  const box = boxes[index];
  if (!box) return;

  box.innerText = symbol;
  box.style.color = symbol === "X" ? "var(--x-color)" : "var(--o-color)";
  box.disabled = true;
  count++;

  turnO = symbol === "X";
  updateCurrentPlayerDisplay();

  const winnerFound = checkWinner();
  if (!winnerFound && count === 9) {
    checkDraw();
  }

  isPlayerTurn = true;
});

// Handle game reset from opponent
socket.on("resetGame", () => {
  resetGame(false);
});

// Handle opponent disconnection
socket.on("playerLeft", () => {
  alert("Opponent left the game.");
});

// Add move listener to each box
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!isPlayerTurn || box.innerText !== '') return;

    const symbol = playerType;
    box.innerText = symbol;
    box.style.color = symbol === "X" ? "var(--x-color)" : "var(--o-color)";
    box.disabled = true;
    count++;

    socket.emit("makeMove", { index, symbol });

    turnO = symbol === "X";
    updateCurrentPlayerDisplay();

    const winnerFound = checkWinner();
    if (!winnerFound && count === 9) {
      checkDraw();
    }

    isPlayerTurn = false;
  });
});

// Game logic

const checkWinner = () => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boxes[a].innerText &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[a].innerText === boxes[c].innerText
    ) {
      showWinner(boxes[a].innerText);
      disableBoxes();
      return true;
    }
  }
  return false;
};

const showWinner = (winner) => {
  message.innerText = `Player ${winner} Wins!`;
  winnerContainer.classList.remove("hide");
};

const checkDraw = () => {
  drawContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

const updateCurrentPlayerDisplay = () => {
  const current = turnO ? "O" : "X";
  currentPlayerDisplay.innerText = current;
  currentPlayerDisplay.style.color = current === "X" ? "var(--x-color)" : "var(--o-color)";
};

const resetGame = (emit = true) => {
  turnO = false;
  count = 0;
  enableBoxes();
  winnerContainer.classList.add("hide");
  drawContainer.classList.add("hide");
  currentPlayerDisplay.innerText = "X";
  currentPlayerDisplay.style.color = "var(--x-color)";
  isPlayerTurn = playerType === "X";

  if (emit) {
    socket.emit("resetGame");
  }
};

// Button events
resetBtn.addEventListener("click", () => resetGame());
newGameBtn.addEventListener("click", () => resetGame());
drawResetBtn.addEventListener("click", () => resetGame());
