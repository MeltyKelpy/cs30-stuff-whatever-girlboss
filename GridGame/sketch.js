// Gird Based Game
// Aurora Gurel
// March 23rd 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const CELL_SIZE = 75;
let grid;
let rows;
let cols;
const walkable = 0;
const wall = 1;
// let player = 9;
let play_sprite;
let walk_sprite;
let doc_sprite;
let board;
let waller;
let canChangeDir = true;
let desiredX = 0;
let desiredY = 0;
let newFriendInANewWorld;
let documentt;
let anim_state = 0;
let anims = [play_sprite, walk_sprite];

function preload() {
  board = loadImage("images/board.png");
  waller = loadImage("images/wall.png");
  play_sprite = loadImage("images/spade.png");
  walk_sprite = loadImage("images/spade_walk.png");
  doc_sprite = loadImage("images/document.png");
}

function setup() {
  createCanvas(1280, 720);
  cols = Math.floor(height / CELL_SIZE);
  rows = Math.floor(width / CELL_SIZE);
  grid = generateRandomGrid(cols, rows, false);
  newFriendInANewWorld = new DTSpade(0,0);
  documentt = new Document(1,5);
  documentt.update();
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
  return output
}

function displayGrid() {
  // guess
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
  // the toggle cell code from the old example
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
  newFriendInANewWorld.displayPlayer();
  documentt.update();
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

  if ((desiredX !== 0 || desiredY !== 0) && canChangeDir) {
    newFriendInANewWorld.movePlayer(newFriendInANewWorld.x + desiredX, newFriendInANewWorld.y + desiredY);
  }
}

function keyPressed() {
}

class DTSpade {
  constructor(_x = 0, _y = 0) {
    this.x = _x;
    this.y = _y;
    this.dx = 0;
    this.dy = 0;
  }

  movePlayer(_x, _y) {
    if (_x >= 0 && _x < rows && _y >= 0 && _y < cols && grid[Math.floor(_y)][Math.floor(_x)] === walkable) {
      canChangeDir = false;
      this.dx = _x;
      this.dy = _y;
      let tween_time = 375;
      if (_x !== this.x && _y !== this.y) {
        tween_time = 500;
      }
      p5.tween.manager
        .addTween(this, 'tween1')
        .addMotions([{ key: 'x', target: _x},{ key: 'y', target: _y}], tween_time, 'easeInLinear')
        .startTween()
        .onEnd(() => this.ender());
      keyPutters();
    }
  }

  async ender() {
    await wait(200);
    canChangeDir = true;
  }

  displayPlayer() {
    fill("red");
    image(anims[anim_state], newFriendInANewWorld.x * CELL_SIZE, newFriendInANewWorld.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
}

class Document {
  constructor(_x = 0, _y = 0) {
    this.x = _x;
    this.orig_y = _y * CELL_SIZE;
    this.y = _y * CELL_SIZE;
    this.in_anim = false;
  }

  update() {
    image(doc_sprite, this.x * CELL_SIZE, this.y, CELL_SIZE, CELL_SIZE);
    console.log(this.y);
    if (this.in_anim === false) {
      this.in_anim = true;
      if (this.y === this.orig_y) {
        p5.tween.manager
          .addTween(this, 'tween1')
          .addMotions([{ key: 'x', target: this.x},{ key: 'y', target: this.y - 10}], 500, 'easeOutQuart')
          .startTween()
          .onEnd(() => this.in_anim = false);
      }
      else if (this.y === this.orig_y + -10) {
        p5.tween.manager
          .addTween(this, 'tween2')
          .addMotions([{ key: 'x', target: this.x},{ key: 'y', target: this.y + 10}], 500, 'easeInQuart')
          .startTween()
          .onEnd(() => this.in_anim = false);
      }
    }
  }
}