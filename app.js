let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-button");
let newGameBtn = document.querySelector("#new-button");
let msg = document.querySelector(".msg");
let mesage = document.querySelector("#msg");
let drawBtn = document.querySelector(".draw");

let turn0 = false;
let count =0;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
const resetGame = () =>
{  
    turn0 = false;
    enableBoxes();
    msg.classList.add("hide");
    draw.classList.add("hide");
    count =0;

}
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turn0) {
      box.innerText = "0";
      turn0 = false;
    } else {
      box.innerText = "X";
      turn0 = true;
    }
    box.disabled = true;
    count++;
    checkWinner();
    if(count == 2)
    {
        checkDraw();
    }
  });
});
const disableBoxes = () =>{
   for(let box of boxes)
    {
        box.disabled = true;
    } 
}
const enableBoxes = () =>{
   for(let box of boxes)
    {
        box.disabled = false;
        box.innerText=""
    } 
}
const showWinner = (winner) =>{
    message.innerHTML = `You Win  ${winner}`;
    msg.classList.remove("hide");
    disableBoxes();

}


const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        console.log("Winner ",pos1Val);
        
        showWinner(pos1Val);

      }
    }
  }
};

newGameBtn.addEventListener("click",resetGame);
resetBtn.addEventListener("click",resetGame);

const checkDraw = () =>
{
    draw.classList.remove("hide");
}