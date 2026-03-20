// Rectangular Grid Array Demo
// ts nested loop

const CELL_SIZE = 100;
let grid;
let rows;
let cols;
let fun_land = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.floor(height / CELL_SIZE);
  rows = Math.floor(width / CELL_SIZE);
  grid = generateRandomGrid(cols, rows);
}

function generateRandomGrid(cols, rows, filled = true) {
  let output = [];
  for (let i = 0; i < cols; i++) {
    let curArray = [];
    for (let e = 0; e < rows; e++) {
      let randoms = random(100);
      if (filled) {
        if (randoms > 50) {
          curArray.push(1);
        }
        if (randoms < 50) {
          curArray.push(0);
        }
      }
      else {
        curArray.push(0);
      }
    }
    output.push(curArray);
  }
  return output;
}

function displayGrid() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      }
      else if (grid[y][x] === 1) {
        fill("black");
      }
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function mousePressed() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      if (((mouseX <= x * CELL_SIZE + CELL_SIZE) && (mouseX >= x * CELL_SIZE)) && ((mouseY <= y * CELL_SIZE + CELL_SIZE) && (mouseY >= y * CELL_SIZE))) {
        if (fun_land === true) {
          for (let a of [{y: y, x: x}, {y: y - 1, x: x}, {y: y + 1, x: x}, {y: y, x: x - 1}, {y: y, x: x + 1}]) {
            if (((a.x >= 0) && (a.x <= cols * CELL_SIZE) && (a.y >= 0) && (a.y <= rows * CELL_SIZE))) {
              if (grid[a.y][a.x] === 0) {
                grid[a.y][a.x] = 1;
              }
              else if (grid[a.y][a.x] === 1) {
                grid[a.y][a.x] = 0;
              }
            }
          }
        }
        else {
          if (grid[y][x] === 0) {
            grid[y][x] = 1;
          }
          else if (grid[y][x] === 1) {
            grid[y][x] = 0;
          }
          break
        }
      }
    }
  }
}

function draw() {
  background(220);

  displayGrid();
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols, rows);
  }
  if (key === "e") {
    grid = generateRandomGrid(cols, rows, false);
  }
}