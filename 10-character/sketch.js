// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 50;
let grid;
let rows;
let cols;
let walkable = 0;
let wall = 1;
let player = 9;
let newFriendInANewWorld = {
  x: 0,
  y: 0
};

let play_sprite;
let board;
let waller;

function preload() {
  board = loadImage("images/board.png");
  waller = loadImage("images/wall.png");
  play_sprite = loadImage("images/mypal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.floor(height / CELL_SIZE);
  rows = Math.floor(width / CELL_SIZE);
  grid = generateRandomGrid(cols, rows);
  noStroke();
}

function generateRandomGrid(cols, rows, filled = true) {
  let output = [];
  for (let i = 0; i < cols; i++) {
    let curArray = [];
    for (let e = 0; e < rows; e++) {
      let randoms = random(100);
      if (filled) {
        if (randoms > 50) {
          curArray.push(wall);
        }
        if (randoms < 50) {
          curArray.push(walkable);
        }
      }
      else {
        curArray.push(walkable);
      }
    }
    output.push(curArray);
  }
  return output;
}

function displayGrid() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      if (grid[y][x] === walkable) {
        image(board, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall) {
        image(waller, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);

  console.log(x);
  console.log(y);

  toggleCell(x, y);
}

function toggleCell(x, y) {
  if (x >= 0 && x < rows && y >= 0 && y < cols) {
    if (grid[y][x] === wall) {
      grid[y][x] = walkable;
    }
    else if (grid[y][x] === walkable) {
      grid[y][x] = wall;
    }
  }
}

function draw() {
  background(220);

  displayGrid();
  displayPlayer();
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols, rows);
  }
  if (key === "e") {
    grid = generateRandomGrid(cols, rows, false);
  }
  if (key === "s") {
    movePlayer(newFriendInANewWorld.x, newFriendInANewWorld.y + 1);
  }
  if (key === "w") {
    movePlayer(newFriendInANewWorld.x, newFriendInANewWorld.y - 1);
  }
  if (key === "a") {
    movePlayer(newFriendInANewWorld.x - 1, newFriendInANewWorld.y);
  }
  if (key === "d") {
    movePlayer(newFriendInANewWorld.x + 1, newFriendInANewWorld.y);
  }
}

function displayPlayer() {
  fill("red");
  image(play_sprite, newFriendInANewWorld.x * CELL_SIZE, newFriendInANewWorld.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function movePlayer(_x, _y) {
  if (_x >= 0 && _x < rows && _y >= 0 && _y < cols && grid[_y][_x] === walkable) {
    newFriendInANewWorld.x = _x;
    newFriendInANewWorld.y = _y;
  }
}