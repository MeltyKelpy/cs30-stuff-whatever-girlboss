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
let play_spriteF;
let walk_spriteF;
let doc_sprite;
let board;
let waller;
let canChangeDir = true;
let desiredX = 0;
let desiredY = 0;
let newFriendInANewWorld;
let documentt;
let anim_state = 0;
let anims = [];

function preload() {
  board = loadImage("images/board.png");
  waller = loadImage("images/wall.png");
  play_sprite = loadImage("images/spade.png");
  walk_sprite = loadImage("images/spade_walk.png");
  play_spriteF = loadImage("images/spadeF.png");
  walk_spriteF = loadImage("images/spade_walkF.png");
  doc_sprite = loadImage("images/document.png");
  anims = [play_sprite, walk_sprite, play_spriteF, walk_spriteF];
}

function setup() {
  createCanvas(1280, 720);
  cols = Math.floor(height*6 / CELL_SIZE);
  rows = Math.floor(width*6 / CELL_SIZE);
  grid = generateRandomGrid(cols, rows, false);
  newFriendInANewWorld = new DTSpade(0,0);
  documentt = new Document(1,5);
  documentt.update();
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
  // let x = Math.floor(mouseX/CELL_SIZE);
  // let y = Math.floor(mouseY/CELL_SIZE);

  // toggleCell(x, y);
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
  noStroke();
  background(220);
  newFriendInANewWorld.cameraFunctions();
  displayGrid();
  newFriendInANewWorld.displayPlayer();
  documentt.update();
  keyPutters();
}

function keyPutters() {
  desiredX = 0;
  desiredY = 0;
  if (keyIsDown(83) && canChangeDir) {
    desiredY = 1;
    if (anim_state === 2) {
      anim_state = 3;
    }
    if (anim_state === 0) {
      anim_state = 1;
    }
  }
  if (keyIsDown(87) && canChangeDir) {
    desiredY = -1;
    if (anim_state === 2) {
      anim_state = 3;
    }
    if (anim_state === 0) {
      anim_state = 1;
    }
  }
  if (keyIsDown(65) && canChangeDir) {
    desiredX = -1;
    anim_state = 3;
  }
  if (keyIsDown(68) && canChangeDir) {
    desiredX = 1;
    anim_state = 1;
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
    this.facing_dir = 1;
  }

  movePlayer(_x, _y) {
    if (_x >= 0 && _x < rows && _y >= 0 && _y < cols && grid[Math.floor(_y)][Math.floor(_x)] === walkable) {
      canChangeDir = false;
      this.dx = _x;
      this.dy = _y;
      let tween_time = 275;
      if (_x !== this.x && _y !== this.y) {
        tween_time = 350;
      }
      p5.tween.manager
        .addTween(this, 'tween1')
        .addMotions([{ key: 'x', target: _x},{ key: 'y', target: _y}], tween_time, 'easeOutQuart')
        .startTween()
        .onEnd(() => this.ender());
      keyPutters();
    }
  }

  async ender() {
    if (anim_state === 3) {
      anim_state = 2;
    }
    if (anim_state === 1) {
      anim_state = 0;
    }
    await wait(250);
    canChangeDir = true;
  }

  displayPlayer() {
    image(anims[anim_state], newFriendInANewWorld.x * CELL_SIZE - CELL_SIZE/2, newFriendInANewWorld.y * CELL_SIZE - CELL_SIZE, CELL_SIZE*2, CELL_SIZE*2);
  }

  cameraFunctions() {
    // caaammera
    let camera_constraints = {x_left: 100, x_right: -1000, y: -100};
    let camera_y = 0;
    let camera_x = 0;
    let our_x = newFriendInANewWorld.x * CELL_SIZE - CELL_SIZE/2;
    let our_y = newFriendInANewWorld.y * CELL_SIZE - CELL_SIZE;

    if (height / 2 - our_y < camera_constraints.y) {
      camera_y = camera_constraints.y;
    }
    else {
      camera_y = height / 2 - our_y;
    }

    if (width / 2 - our_x > camera_constraints.x_left) {
      camera_x = camera_constraints.x_left;
    }
    else if (width / 2 - our_x < camera_constraints.x_right) {
      camera_x = camera_constraints.x_right;
    }
    else {
      camera_x = width / 2 - our_x;
    }

    translate(camera_x-75, camera_y);
  }
}

class Document {
  constructor(_x = 0, _y = 0) {
    this.x = _x;
    this.orig_y = _y * CELL_SIZE;
    this.y = _y * CELL_SIZE;
    this.in_anim = false;
    this.isAlive = true;
  }

  update() {
    if (this.isAlive === true) {
      image(doc_sprite, this.x * CELL_SIZE - CELL_SIZE/3, this.y, CELL_SIZE*1.4, CELL_SIZE*1.4);
      let dister = dist(newFriendInANewWorld.x, newFriendInANewWorld.y, this.x, this.orig_y/CELL_SIZE);
      if (dister < 1) {
        textAlign(CENTER);
        strokeWeight(5);
        stroke(0);
        fill("white");
        text("Collect\n[SPACE]", this.x * CELL_SIZE + 25, this.orig_y + 100);
        if (keyIsDown(32)) {
          console.log("collect!");
          this.isAlive = false;
        }
      }
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
}