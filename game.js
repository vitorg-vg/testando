const size = 8;
let currentPlayer = 1;
let phase = "placement";

const board1 = [];
const board2 = [];

let shipsToPlace = 5;

const board1Div = document.getElementById("board1");
const board2Div = document.getElementById("board2");
const statusText = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

// Transição
const transitionScreen = document.getElementById("transitionScreen");
const transitionText = document.getElementById("transitionText");
const countdownText = document.getElementById("countdown");

let isTransitioning = false;

// Criar tabuleiro
function createBoard(board, element, player) {
  element.innerHTML = "";
  for (let i = 0; i < size * size; i++) {
    board[i] = 0;

    const cell = document.createElement("div");
    cell.classList.add("cell");

    cell.addEventListener("click", () => handleClick(i, board, player, cell));

    element.appendChild(cell);
  }
}

// Tela de transição (APENAS NA BATALHA)
function startTransition(nextPlayer) {
  if (phase !== "battle") return;

  isTransitioning = true;
  transitionScreen.classList.remove("hidden");

  let timeLeft = 5;
  transitionText.textContent = `Passe o computador para o Jogador ${nextPlayer}`;
  countdownText.textContent = timeLeft;

  const timer = setInterval(() => {
    timeLeft--;
    countdownText.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      transitionScreen.classList.add("hidden");
      currentPlayer = nextPlayer;
      statusText.textContent = `Turno do Jogador ${currentPlayer}`;
      isTransitioning = false;
    }
  }, 1000);
}

function handleClick(index, board, player, cell) {
  if (isTransitioning) return;

  // FASE DE POSICIONAMENTO
  if (phase === "placement") {
    if (currentPlayer !== player) return;

    if (board[index] === 0 && shipsToPlace > 0) {
      board[index] = 1;
      cell.classList.add("ship");
      shipsToPlace--;

      if (shipsToPlace === 0) {
        if (currentPlayer === 1) {
          currentPlayer = 2;
          shipsToPlace = 5;
          statusText.textContent = "Jogador 2 posicionando entidades...";
        } else {
          statusText.textContent = "Clique em começar!";
        }
      }
    }
  }

  // FASE DE BATALHA
  if (phase === "battle") {
    if (currentPlayer === player) return;

    if (board[index] === 1) {
      cell.classList.add("hit");
      board[index] = 2;
      statusText.textContent = `💀 Jogador ${currentPlayer} acertou!`;
    } else if (board[index] === 0) {
      cell.classList.add("miss");
      board[index] = 3;

      let nextPlayer = currentPlayer === 1 ? 2 : 1;
      startTransition(nextPlayer);
    }

    checkVictory();
  }
}

function checkVictory() {
  const remaining1 = board1.includes(1);
  const remaining2 = board2.includes(1);

  if (!remaining1) {
    alert("Jogador 2 venceu!");
    location.reload();
  }

  if (!remaining2) {
    alert("Jogador 1 venceu!");
    location.reload();
  }
}

startBtn.addEventListener("click", () => {
  phase = "battle";
  currentPlayer = 1;
  statusText.textContent = "Turno do Jogador 1";
});

// Inicializar
createBoard(board1, board1Div, 1);
createBoard(board2, board2Div, 2);
