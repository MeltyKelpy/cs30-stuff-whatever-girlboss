// Gird Based Game
// Aurora Gurel
// March 23rd 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 75;
let grid;
let rows;
let cols;
let walkable = 0;
let wall = 1;
let player = 9;
let newFriendInANewWorld = {
  x: 0, // really
  y: 0,
  dx: 0, // where we WANT the x to be
  dy: 0, // where we WANT the y to be
};

let play_sprite;
let board;
let waller;
let canChangeDir = true;
let desiredX = 0;
let desiredY = 0;

function preload() {
  board = loadImage("images/board.png");
  waller = loadImage("images/wall.png");
  play_sprite = loadImage("images/mypal.png");
}

function setup() {
  createCanvas(1280, 720);
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
  keyPutters();
}

function keyPutters() {
  desiredX = 0;
  desiredY = 0;
  if (keyIsDown(83)) {
    desiredY = 1;
  }
  if (keyIsDown(87)) {
    desiredY = -1;
  }
  if (keyIsDown(65)) {
    desiredX = -1;
  }
  if (keyIsDown(68)) {
    desiredX = 1;
  }

  console.log(desiredX, desiredY);

  if (desiredX !== 0 && desiredY !== 0 && canChangeDir) {
    movePlayer(newFriendInANewWorld.x + desiredX, newFriendInANewWorld.y + desiredY);
  }
}

function keyPressed() {
}

function displayPlayer() {
  fill("red");
  image(play_sprite, newFriendInANewWorld.x * CELL_SIZE, newFriendInANewWorld.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function movePlayer(_x, _y) {
  if (_x >= 0 && _x < rows && _y >= 0 && _y < cols && grid[Math.floor(_y)][Math.floor(_x)] === walkable) {
    canChangeDir = false;
    newFriendInANewWorld.dx = _x;
    newFriendInANewWorld.dy = _y;
    let tween_time = 150;
    if (_x > newFriendInANewWorld.x && _y > newFriendInANewWorld.y) {
      tween_time = 250;
    }
    p5.tween.manager
      .addTween(newFriendInANewWorld, 'tween1')
      .addMotions([{ key: 'x', target: _x},{ key: 'y', target: _y}], tween_time, 'easeInLinear')
      .startTween()
      .onEnd(() => canChangeDir = true);
    keyPutters();
  }
}