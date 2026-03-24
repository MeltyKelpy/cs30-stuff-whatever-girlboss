// code i stole out of #laziness

let CELL_SIZE = 5;
let grid;
let rows;
let cols;
let screwuandurmagicnumberswhocares = 2;
let paused = false;
let can_key = true;
let alive = 1;
let dead = 0;
let gunBro;

function preload() {
  gunBro = loadJSON("gosper_gun.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height/CELL_SIZE);
  cols = Math.floor(width/CELL_SIZE);
  grid = generateEmptyGrid(cols, rows);
  noStroke();
}

function draw() {
  background(220);
  displayGrid();
  if (frameCount % screwuandurmagicnumberswhocares === 0) {
    if (!paused) {
      grid = updateGrid();
    }
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);

  //self
  toggleCell(x, y);

  // toggleCell(x + 1, y);
  // toggleCell(x - 1, y);
  // toggleCell(x, y - 1);
  // toggleCell(x, y + 1);
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols, rows);
  }
  if (key === "f") {
    dead = abs(dead - 1);
    alive = abs(alive - 1);
  }
  if (key == "g") {
    grid = gunBro;
  }
  if (key === "e") {
    grid = generateEmptyGrid(cols, rows);
  }
  if (key === "d") {
    grid = updateGrid();
  }
  if (key === " ") {
    paused = !paused;
  }
}

function toggleCell(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (grid[y][x] === alive) {
      grid[y][x] = dead;
    }
    else if (grid[y][x] === dead) {
      grid[y][x] = alive;
    }
  }
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === dead) {
        fill("rgb(104, 5, 5)");
      }
      if (grid[y][x] === alive) {
        fill("rgb(153, 49, 23)");
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 50) {
        newGrid[y].push(alive);
      }
      else {
        newGrid[y].push(dead);
      }
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(dead);
    }
  }
  return newGrid;
}

function updateGrid() {
  let nextTurn = generateEmptyGrid(cols, rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let neighbours = 0;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (x+j >= 0 && x+j < cols && y+i >= 0 && y+i < rows) {
            neighbours += grid[y+i][x+j];
          }
        }
      }
      neighbours -= grid[y][x];
      
      if (grid[y][x] === 1) {
        if (neighbours > 1 && neighbours < 4) {
          nextTurn[y][x] = alive;
        }
        else {
          nextTurn[y][x] = dead;
        }
      }
      else if (grid[y][x] === 0) {
        if (neighbours === 3) {
          nextTurn[y][x] = alive;
        }
      }
    }
  }
  return nextTurn;
}