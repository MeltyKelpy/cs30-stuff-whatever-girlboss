// Gird Based Game
// Aurora Gurel
// March 23rd 2026
//
// Extra for Experts:
// - Use of classes! Spade and Documents are done through classes, I think that's cool. Added before the class demo! But,
//   Considering I used classes last time, that's probably not a surprise.
// - Use of Promises! Made a sort of wait function using promises and async functions.
// - Used some other libraries! I suppose that's not new with me, but I did some tweening this time.
// - Camera System
// - Interaction System a little
// - Multiple Rooms! wow!
// - Remembered to add *this* this time

// - wait function thing using promises
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// guess
const CELL_SIZE = 75;
// my wonderful tiles
const nuthin = 0;
const walkable = 1;
const wall = 2;
const wall_l = 3;
const wall_r = 4;
const wall_d = 6;
const wall_dr = 7;
const wall_dl = 8;
const wall_drd = 9;
const wall_dld = 10;
// the plethera of unassigned variables
let grid,rows,cols,play_sprite,walk_sprite,play_spriteF,walk_spriteF,doorT_sprite,doorB_sprite,doorTF_sprite,doorBF_sprite,doc_sprite,board,waller,_wall_l,_wall_r,_wall_d,_wall_dr,_wall_dl,_wall_drd,_wall_dld;

// this should've been in the spade class but i forgot and it's too late now
let canChangeDir = true;

// im not gonna keep labeling every random variable even though its rly funny
let desiredX = 0;
let desiredY = 0;
let newFriendInANewWorld;
let documentt;
let anim_state = 0;
let anims = [];

// list of items and stuff in the rooms and stuff generally related to rooms
let items = {
  "room1":[{"x":10, "y":3, "flipped":false, "type":"door", "end_spot":["room2", 1, 4]},{"document_x":5, "document_y":4, "collected":false, "type":"document"}, {"x":415, "y":175, "text":"Welcome to DT SPADE'S Document Fetch Quest!\nPress [SPACE] on this document to grab it.", "type":"text"},{"x":400, "y":475, "text":"Once you've done so,\nexit through the door to collect more!", "type":"text"}],
  "room2":[{"x":0, "y":3, "flipped":true, "type":"door", "end_spot":["room1", 9, 4]},{"document_x":10, "document_y":6, "collected":false, "type":"document"},{"x":16, "y":1, "flipped":false, "type":"door", "end_spot":["room3", 1, 4]}],
  "room3":[{"x":0, "y":3, "flipped":true, "type":"door", "end_spot":["room2", 15, 2]},{"document_x":10, "document_y":9, "collected":false, "type":"document"},{"x":7, "y":1, "flipped":true, "type":"door", "end_spot":["room4", 1, 9]}],
  "room4":[{"x":0, "y":8, "flipped":true, "type":"door", "end_spot":["room3", 8, 2]},{"document_x":9, "document_y":7, "collected":false, "type":"document"}, {"x":515, "y":175, "text":"That's the game that's it that's the game\nthat took me 2 weeks and it wasnt even fun\ndamn", "type":"text"},],
};
let existing_documents = [];
let current_room = "room1";
let documents_collected = 0;
let document_count = 0;

// just used to position certain stuff. also used for stuff, to position it. the x tells where the x should be. The painting depicts rice farmers farming rice in their rice farm to provide the general public with rice farmed from their rice farm RICE
// do you like it my comment do you like it
let translation = {
  x:0,
  y:0,
};

let room_transfered = false;

// janky code, but im getting tired.. im also getting bired, but thats up to your binterperatation what that means....
let room1json;
let room2json;
let room3json;
let room4json;

function preload() {
  // lots of loading haha GULP in memories of... asym called outwoods........ thank you!!! ill say goodbye soon!!! though its the end of the world!!!
  board = loadImage("images/board.png");
  waller = loadImage("images/wall.png");
  _wall_l = loadImage("images/wall_l.png");
  _wall_r = loadImage("images/wall_r.png");
  _wall_d = loadImage("images/wall_d.png");
  _wall_dr = loadImage("images/wall_dr.png");
  _wall_dl = loadImage("images/wall_dl.png");
  _wall_drd = loadImage("images/wall_drd.png");
  _wall_dld = loadImage("images/wall_dld.png");
  play_sprite = loadImage("images/spade.png");
  walk_sprite = loadImage("images/spade_walk.png");
  play_spriteF = loadImage("images/spadeF.png");
  walk_spriteF = loadImage("images/spade_walkF.png");
  doorT_sprite = loadImage("images/door_top.png");
  doorB_sprite = loadImage("images/door_bottom.png");
  doorTF_sprite = loadImage("images/door_topF.png");
  doorBF_sprite = loadImage("images/door_bottomF.png");
  doc_sprite = loadImage("images/document.png");

  // guess
  anims = [play_sprite, walk_sprite, play_spriteF, walk_spriteF];

  // guess
  room1json = loadJSON("levels/room1.json");
  room2json = loadJSON("levels/room2.json");
  room3json = loadJSON("levels/room3.json");
  room4json = loadJSON("levels/room4.json");
}

function setup() {
  // guess
  createCanvas(1280, 720);
  noSmooth();
  
  // makes my grid hi hello neighbour WHAT
  cols = Math.floor(height*3 / CELL_SIZE);
  rows = Math.floor(width*3 / CELL_SIZE);
  grid = room1json;
  
  // makes the pal
  newFriendInANewWorld = new DTSpade(1,5);

  // roomer
  current_room = "room1";
  createDocuments();
  cacheDocuments();
}

function createDocuments() {
  // creates the documents
  for (let e = 0; e < Object.keys(items).length; e++) {
    // gets all the keys, used to set the assosciated room for a given item
    let key = Object.keys(items)[e];
    for (let i = 0; i < items[key].length; i++) {
      if (items[key][i]["type"] === "document") {
        // just makes this code only run if collected
        if (items[key][i]["collected"] === false) {
          let documix = {"type":"document", "item":new Document(items[key][i]["document_x"],items[key][i]["document_y"],key,i)};
          documix["item"].update();
          existing_documents.push(documix);
        }
      }
      if (items[key][i]["type"] === "door") {
        // make my door
        let documix = {"type":"document", "item":new Door(items[key][i]["x"],items[key][i]["y"],items[key][i]["flipped"],items[key][i]["end_spot"],key)};
        documix["item"].update();
        existing_documents.push(documix);
      }
      else if (items[key][i]["type"] === "text") {
        // make my text
        // plewaase
        let text = {"type":"text", "item":[items[key][i]["text"],items[key][i]["x"],items[key][i]["y"],key]};
        existing_documents.push(text);
      }
    }
  }
}

function cacheDocuments() {
  // this one is setting the values of the full document count
  // and currently collected, cuz. i wanted to count that
  document_count = 0;
  documents_collected = 0;
  for (let e = 0; e < Object.keys(items).length; e++) {
    let key = Object.keys(items)[e];
    for (let i = 0; i < items[key].length; i++) {
      if (items[key][i]["type"] === "document") {
        document_count += 1;
        if (items[key][i]["collected"] !== false) {
          documents_collected += 1;
        }
      }
    }
  }
}

function generateEmptyGrid(cols, rows) {
  // uhhh i just used this for testing ngl
  let output = [];
  for (let i = 0; i < cols; i++) {
    let curArray = [];
    for (let e = 0; e < rows; e++) {
      curArray.push(nuthin);
    }
    output.push(curArray);
  }
  return output;
}

function displayGrid() {
  // guess
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      // holy if statement. i tried using switch but it broke so. yeah!
      if (grid[y][x] === walkable) {
        image(board, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall) {
        image(waller, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall_l) {
        image(_wall_l, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall_r) {
        image(_wall_r, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall_d) {
        image(_wall_d, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall_dr) {
        image(_wall_dr, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall_dl) {
        image(_wall_dl, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall_drd) {
        image(_wall_drd, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === wall_dld) {
        image(_wall_dld, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function mousePressed() {
  // code i used to make the mapssssssss

  // let x = Math.floor(mouseX/CELL_SIZE-translation.x/CELL_SIZE);
  // let y = Math.floor(mouseY/CELL_SIZE-translation.y/CELL_SIZE);

 // toggleCell(x, y);
}

// im not gonna comment this cuz im not using it but u
// can prolly tell whats going on. if statement hell again.
function toggleCell(x, y) {
  if (grid[y][x] === nuthin) {
    grid[y][x] = walkable;
  }
  else if (grid[y][x] === walkable) {
    grid[y][x] = wall;
  }
  else if (grid[y][x] === wall) {
    grid[y][x] = wall_l;
  }
  else if (grid[y][x] === wall_l) {
    grid[y][x] = wall_r;
  }
  else if (grid[y][x] === wall_r) {
    grid[y][x] = wall_d;
  }
  else if (grid[y][x] === wall_d) {
    grid[y][x] = wall_dr;
  }
  else if (grid[y][x] === wall_dr) {
    grid[y][x] = wall_dl;
  }
  else if (grid[y][x] === wall_dl) {
    grid[y][x] = wall_drd;
  }
  else if (grid[y][x] === wall_drd) {
    grid[y][x] = wall_dld;
  }
  else if (grid[y][x] === wall_dld) {
    grid[y][x] = nuthin;
  }
  // just used to reset the tile faster
  if (mouseButton === CENTER) {
    grid[y][x] = nuthin;
  }
}

function draw() {
  noStroke();
  background(0);
  newFriendInANewWorld.cameraFunctions();
  displayGrid();
  strokeWeight(7);
  stroke(0);
  fill("white");
  textFont('Verdana');
  textSize(16);
  textAlign(CENTER);
  for (let i = 0; i < existing_documents.length; i++) {
    if (existing_documents[i]["type"] === "document" || existing_documents[i]["type"] === "door") {
      if (existing_documents[i]["item"].room === current_room) {
        existing_documents[i]["item"].update();
      }
    }
    else if (existing_documents[i]["type"] == "text") {
      if (existing_documents[i]["item"][3] === current_room) {
        text(existing_documents[i]["item"][0], existing_documents[i]["item"][1], existing_documents[i]["item"][2]);
      }
    }
  }
  newFriendInANewWorld.displayPlayer();
  
  // beautiful text that doesn't change based off the camera position
  text("Dectective Spade Document-Collection-Detector-9000tm || Documents Collected: "+documents_collected+"/"+document_count, width/2-translation.x, 25-translation.y);
  
  // uhhhmmmmmmmmmmmmmmmmmmmm
  // yeah
  keyPutters();
}

function keyPutters() {
  // bad animationssss ughghghfhhh
  // i DONT LIKE THIS CODE i want to PRETEND IT'S NOT HERE
  // i will not be commenting it cuz i hate it
  // pretend it's fake
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

function loadRoom(room, x, y) {
  current_room = room;
  // IM SORRY FOR MY CRIMES AGAINST CODING
  if (room === "room1") {
    grid = room1json;
  }
  if (room === "room2") {
    grid = room2json;
  }
  if (room === "room3") {
    grid = room3json;
  }
  if (room === "room4") {
    grid = room4json;
  }
  newFriendInANewWorld.x = x;
  newFriendInANewWorld.y = y;
}


//////////////
//
//  CLASSES
//  i like to put them at the bottom
//
//////////////

class DTSpade {
  constructor(_x = 0, _y = 0) {
    this.x = _x;
    this.y = _y;
    this.dx = 0;
    this.dy = 0;
    this.facing_dir = 1;
  }

  movePlayer(_x, _y) {
    // moves player with tween!
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
    // restarts to standing animation
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
    // guess
    image(anims[anim_state], newFriendInANewWorld.x * CELL_SIZE - CELL_SIZE/2, newFriendInANewWorld.y * CELL_SIZE - CELL_SIZE, CELL_SIZE*2, CELL_SIZE*2);
  }

  cameraFunctions() {

    // camera!
    // in hindsight, i didnt need to do this.
    // oh well

    let camera_constraints = {x_left: 100, x_right: -1000, y_top: 200, y_bottom: -500};
    let camera_y = 0;
    let camera_x = 0;
    let our_x = newFriendInANewWorld.x * CELL_SIZE - CELL_SIZE/2;
    let our_y = newFriendInANewWorld.y * CELL_SIZE - CELL_SIZE;

    if (height / 2 - our_y < camera_constraints.y_bottom) {
      camera_y = camera_constraints.y_bottom;
    }
    else if (height / 2 - our_y > camera_constraints.y_top) {
      camera_y = camera_constraints.y_top;
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

    // i could've made a proper offset but it also felt redundant

    translation.x = camera_x-75;
    translation.y = camera_y;
    translate(camera_x-75, camera_y);
  }
}

class Door {
  constructor(x = 0, y = 0, flipped = false, end_spot = ["room1", 1, 5], room = "room1") {
    this.x = x;
    this.y = y;
    this.room = room;
    this.flipped = flipped;
    this.end_spot = end_spot;
  }

  update() {
    if (this.room === current_room) {
      // door texture hi
      if (!this.flipped) {
        image(doorT_sprite, this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        image(doorB_sprite, this.x * CELL_SIZE, this.y * CELL_SIZE + CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else {
        image(doorTF_sprite, this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        image(doorBF_sprite, this.x * CELL_SIZE, this.y * CELL_SIZE + CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      // interaction shit
      let dister = dist(newFriendInANewWorld.x, newFriendInANewWorld.y, this.x, this.y);
      if (dister < 2) {
        textAlign(CENTER);
        strokeWeight(5);
        stroke(0);
        fill("white");
        if (!this.flipped) {
          text("Walk through\n[SPACE]", this.x * CELL_SIZE - 40, this.y * CELL_SIZE + 175);
        }
        else {
          text("Walk through\n[SPACE]", this.x * CELL_SIZE + 110, this.y * CELL_SIZE + 175);
        }
        if (keyIsDown(32)) {
          // i didnt wanna use keyPressed so i just added this in
          if (room_transfered === false) {
            room_transfered = true;
            loadRoom(this.end_spot[0], this.end_spot[1], this.end_spot[2]);
            setTimeout(() => {
              room_transfered = false;
            }, 100);
          }
        }
      }
    }
  }
}

class Document {
  constructor(_x = 0, _y = 0, room = "room1", roomArrayPlacement = 0) {
    this.x = _x;
    this.orig_y = _y * CELL_SIZE;
    this.y = _y * CELL_SIZE;
    this.in_anim = false;
    this.isAlive = true;
    this.room = room;
    this.roomArrayPlacement = roomArrayPlacement;
  }

  update() {
    if (this.isAlive === true) {

      // sets image and stuff and also interaction IM SO TIRED
      image(doc_sprite, this.x * CELL_SIZE - CELL_SIZE/3, this.y, CELL_SIZE*1.4, CELL_SIZE*1.4);
      let dister = dist(newFriendInANewWorld.x, newFriendInANewWorld.y, this.x, this.orig_y/CELL_SIZE);
      if (dister < 1) {
        textAlign(CENTER);
        strokeWeight(5);
        stroke(0);
        fill("white");
        text("Collect\n[SPACE]", this.x * CELL_SIZE + 25, this.orig_y + 100);
        if (keyIsDown(32)) {
          items[this.room][this.roomArrayPlacement]["collected"] = true;
          this.isAlive = false;
          cacheDocuments();
        }
      }

      // float animation! with tweens!
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