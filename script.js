let N;
let board = [];
let solutions = [];
let current = 0;
let interval = null;

// Constraint Check
function isSafe(row, col) {
  for (let i = 0; i < row; i++) {
    if (board[i] === col) return false;
    if (Math.abs(board[i] - col) === Math.abs(i - row)) return false;
  }
  return true;
}

// Forward Checking
function forwardCheck(row) {
  for (let i = row + 1; i < N; i++) {
    let possible = false;

    for (let col = 0; col < N; col++) {
      let safe = true;

      for (let j = 0; j <= row; j++) {
        if (
          board[j] === col ||
          Math.abs(board[j] - col) === Math.abs(j - i)
        ) {
          safe = false;
          break;
        }
      }

      if (safe) {
        possible = true;
        break;
      }
    }

    if (!possible) return false;
  }
  return true;
}

// Backtracking
function solve(row, limit) {
  if (row === N) {
    solutions.push([...board]);
    return;
  }

  for (let col = 0; col < N; col++) {
    if (isSafe(row, col)) {
      board[row] = col;

      if (forwardCheck(row)) {
        solve(row + 1, limit);
        if (limit && solutions.length >= limit) return;
      }
    }
  }
}

// Draw Single Solution
function drawBoard(sol) {
  let html = "<table>";

  for (let i = 0; i < N; i++) {
    html += "<tr>";
    for (let j = 0; j < N; j++) {
      let color = (i + j) % 2 === 0 ? "white" : "black";

      if (sol[i] === j) html += `<td class="${color}">♛</td>`;
      else html += `<td class="${color}"></td>`;
    }
    html += "</tr>";
  }

  html += "</table>";

  document.getElementById("board").innerHTML = html;
  document.getElementById("info").innerHTML =
    `<b>Solution ${current + 1} / ${solutions.length}</b>`;
}

// Draw All Solutions
function drawAllSolutions() {
  let startTime = performance.now();
  
  let html = "";

  solutions.forEach((sol, index) => {
    html += `<div class="solutionBox">`;
    html += `<p><b>#${index + 1}</b></p>`;
    html += "<table>";

    for (let i = 0; i < N; i++) {
      html += "<tr>";
      for (let j = 0; j < N; j++) {
        let color = (i + j) % 2 === 0 ? "white" : "black";

        if (sol[i] === j)
          html += `<td class="${color}">♛</td>`;
        else html += `<td class="${color}"></td>`;
      }
      html += "</tr>";
    }

    html += "</table></div>";
  });

  let endTime = performance.now();
  let renderTime = (endTime - startTime).toFixed(2);

  document.getElementById("board").innerHTML = html;
  document.getElementById("info").innerHTML =
    `<b>Total Solutions: ${solutions.length}</b><br><span style="font-size: 0.9em; color: #666;">Display Time: ${renderTime} ms</span>`;
}

// Navigation
function nextSolution() {
  if (solutions.length === 0) return;
  current = (current + 1) % solutions.length;
  drawBoard(solutions[current]);
}

function prevSolution() {
  if (solutions.length === 0) return;
  current = (current - 1 + solutions.length) % solutions.length;
  drawBoard(solutions[current]);
}

// Auto Play
function autoPlay() {
  if (interval) {
    clearTimeout(interval);
    interval = null;
    document.getElementById("autoPlayBtn").innerHTML = '<span class="btn-icon">▶▶</span> Auto Play';
    return;
  }

  document.getElementById("autoPlayBtn").innerHTML = '<span class="btn-icon">⏸</span> Stop';

  function playNext() {
    nextSolution();
    let speed = document.getElementById("speed").value;
    let delay = 1300 - speed; // Higher value = faster (lower delay)
    interval = setTimeout(playNext, delay);
  }

  playNext();
}

// Start
function start() {
  N = parseInt(document.getElementById("nValue").value);
  let limit = parseInt(document.getElementById("limitValue").value);

  if (!N || N < 4) {
    alert("Enter N ≥ 4");
    return;
  }

  board = new Array(N);
  solutions = [];
  current = 0;

  let startTime = performance.now();

  solve(0, limit);

  let endTime = performance.now();

  if (solutions.length === 0) {
    document.getElementById("board").innerHTML = "No Solution!";
    document.getElementById("info").innerHTML = "";
  } else {
    drawBoard(solutions[current]);
  }

  document.getElementById("info").innerHTML +=
    `<br>Total: ${solutions.length} | Time: ${(endTime - startTime).toFixed(2)} ms`;
}