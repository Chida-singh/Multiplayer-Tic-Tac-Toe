// DOM Elements
const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector("#reset-button");
const newGameBtn = document.querySelector("#new-button");
const winnerContainer = document.querySelector(".winner-container");
const message = document.querySelector("#message");
const drawContainer = document.querySelector(".draw-container");
const drawResetBtn = document.querySelector("#draw-reset");
const currentPlayerDisplay = document.querySelector("#current-player");

// Game state
let turnO = false;
let count = 0;

// Win patterns (all possible winning combinations)
const winPatterns = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

// Reset game function
const resetGame = () => {
  turnO = false;
  count = 0;
  enableBoxes();
  winnerContainer.classList.add("hide");
  drawContainer.classList.add("hide");
  currentPlayerDisplay.innerText = "X";
  currentPlayerDisplay.style.color = "var(--x-color)";
};

// Add click event listeners to all boxes
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO) {
      // Player O's turn
      box.innerText = "O";
      box.style.color = "var(--o-color)";
      turnO = false;
      // Update display to show X is next
      currentPlayerDisplay.innerText = "X";
      currentPlayerDisplay.style.color = "var(--x-color)";
    } else {
      // Player X's turn
      box.innerText = "X";
      box.style.color = "var(--x-color)";
      turnO = true;
      // Update display to show O is next
      currentPlayerDisplay.innerText = "O";
      currentPlayerDisplay.style.color = "var(--o-color)";
    }
    
    // Disable the clicked box
    box.disabled = true;
    
    // Increment count of moves
    count++;
    
    // Check if game is finished
    const winnerFound = checkWinner();
    
    // If no winner yet and all boxes are filled, it's a draw
    if (!winnerFound && count === 9) {
      checkDraw();
    }
  });
});

// Disable all boxes function
const disableBoxes = () => {
  boxes.forEach(box => {
    box.disabled = true;
  });
};

// Enable and clear all boxes function
const enableBoxes = () => {
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
  });
};

// Show winner message function
const showWinner = (winner) => {
  message.innerHTML = `Player <span style="color: ${winner === 'X' ? 'var(--x-color)' : 'var(--o-color)'}; text-shadow: 1px 1px 3px ${winner === 'X' ? 'var(--x-shadow)' : 'var(--o-shadow)'};">${winner}</span> wins!`;
  winnerContainer.classList.remove("hide");
  disableBoxes();
};

// Check for a winner function
const checkWinner = () => {
  for (let pattern of winPatterns) {
    const pos1Val = boxes[pattern[0]].innerText;
    const pos2Val = boxes[pattern[1]].innerText;
    const pos3Val = boxes[pattern[2]].innerText;

    // If positions aren't empty and all match
    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
  return false;
};

// Check if game is a draw
const checkDraw = () => {
  drawContainer.classList.remove("hide");
};

// Add event listeners for buttons
drawResetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Add subtle animation for button clicks
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
  button.addEventListener('mousedown', () => {
    button.style.transform = 'scale(0.95)';
  });
  
  button.addEventListener('mouseup', () => {
    button.style.transform = '';
  });
});