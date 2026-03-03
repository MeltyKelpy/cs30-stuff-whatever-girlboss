var asterisk;
var ghost;
var platform;

var GRAVITY = 1;
var SPEED = 5;
var JUMP = 15;
var CANJUMP = true;
var CANDASH = true;
var dasher = false;
var storeJump = 0;
var dashFrames = 0;
var current_color = 0;
var colors = ["red", "green", "blue", "yellow"]
var platforms = []
var phase_platforms = []
var isOnPlatform = false;
var camera_constraints = [[100, 0], [2500, 150]];
var dashFramers = [];
var dashFramersSprites = [];
var camXOffset = 100;
var camYOffset = -25;

// found this thing for p5.js called p5.play.js, just adds an easier collision detector and "sprites" (which are just shapes as i can tell right now lmao)
// basically changes everything to make my life EASIER!!!!!!!!!!!!! i know how to do all this in normal p5.js though (i tried it out and made decent progress 
// and then found out about this) thumbs up emoji!

function setup() {
  const game = createCanvas(800,400);
  // makes it so it can scale in the window
  game.canvas.style = "";

  // guess
  player_ig = createSprite(0, 200, 50, 50);
  player_ig.setCollider("rectangle", 0,0,50,50);
  player_ig.shapeColor = color(34, 56, 76);

  // ground + wall
  createPlatform(1000, 400, 4000, 100);
  createPlatform(-400, 100, 300, 700);

  // first hurdles
  createPlatform(1150, 300, 300, 100);
  createPlatform(1750, 275, 600, 300);
  createPlatform(2150, 200, 300, 500);

  // phase platform 1
  createPlatform(1850, -25, 300, 50, true);
  
  // guess who added no other ones.

  // guess
  // it seems bad to make these not variables, but i tried it made the camera freeze in place cuz it needs to check these everytime i update the camera, so it seemed
  // pointless to use variables here and not there when it wouldn't change anything
  camera.position.x = player_ig.position.y+camXOffset;
  camera.position.y = player_ig.position.y+camYOffset;

  // just made this show up for a few frames so that it wouldn't move the camera weirdly at the beginning of the stage when setting the player position
  load = createSprite(0, 0, 1500, 1000);
  load.shapeColor = "black";
  load.position = camera.position;
  setTimeout(kill_load, 200);

  // this didnt rly work idk why, maybe the scaling i did?
  noSmooth();
}

function createPlatform(x = 0, y = 0, width = 10, height = 10, phase = false) {
  var platform = createSprite(x,y,width,height);
  if (phase) {
    phase_platforms.push(platform);
  }
  if (!phase) {
    platforms.push(platform);
  }
}

function kill_load() {
  // guess
  load.remove();
}

function draw() {
  background(150,150,150);

  textAlign(CENTER);
  textSize(25);
  fill(0);
  text("Welcome to DREAMBLOCK\n(demo showcase)\n(movement: WASD or arrow keys)", 100, 30);
  text("Space or Z to jump", 750, 200);
  text("Shift or X to dash\n(dashes in your\nmoving direction)", 1250, 175);
  text("Some Platforms can\nbe Phased Through\non the bottom.", 1850, 40);
  text("Theres also no fall damage\n      because its fun", 2550, -25);
  
  // is this needed? no, i did it right after i finished the code
  // did i feel like doing it? hell yeah i did
  collisionManagement();
  jumperGeometryDash();
  colorSwapper();
  dashItUpBuddy();
  cameraFunctions();

  drawSprites();

}

// i love organization

function jumperGeometryDash() {
  // guess
  if (storeJump > 0) {
    storeJump -= 1;
    if (CANJUMP) {
      player_ig.velocity.y = -JUMP;
      CANJUMP = false;
      isOnPlatform = false;
    }
  }
  
  if((keyWentDown("z") || keyWentDown("space"))){
    if (CANJUMP) {
      player_ig.velocity.y = -JUMP;
      CANJUMP = false;
    }
    else {
      storeJump = 10;
    }
  }
}

function dashItUpBuddy() {

  // just makes it so the gravity doesnt apply when dashing
  if (dashFrames < -2) {
    player_ig.velocity.y += GRAVITY;
    player_ig.shapeColor = colors[current_color];
  }
  else {
    player_ig.shapeColor = color(255, 255, 255);
    dashFrames -= 1;
  }

  // i know, i know, its atrocious....... i know......
  if (dashFrames <= 0) {
    player_ig.velocity.x = 0;
    if ((keyIsDown("68") || keyIsDown("39")) && CANJUMP) {
      player_ig.velocity.x += SPEED;
    }
    if ((keyIsDown("65") || keyIsDown("37")) && CANJUMP) {
      player_ig.velocity.x -= SPEED;
    }
    if ((keyIsDown("68") || keyIsDown("39")) && !CANJUMP) {
      player_ig.velocity.x += SPEED;
      if (dashFrames < 0) {
        player_ig.velocity.x * 1.2;
      }
    }
    if ((keyIsDown("65") || keyIsDown("37")) && !CANJUMP) {
      player_ig.velocity.x -= SPEED;
      if (dashFrames < 1) {
        player_ig.velocity.x * 3;
      }
    }
  }

  // i know, i know... its.... deja vu
  if (dasher == true || dashFrames >= 11) {
      CANDASH = false;
      dasher = false;
      let dashers = 0;
      let jumpAfter = true;
      player_ig.velocity.x = 0;
      player_ig.velocity.y = 0;
      if (dashFrames <= 0) {
        dashFrames = 12;
      }
      if (keyIsDown("65") || keyIsDown("37")) {
        dashers += 1;
        jumpAfter = false;
        player_ig.velocity.x = -9;
      }
      if (keyIsDown("68") || keyIsDown("39")) {
        dashers += 1;
        jumpAfter = false;
        player_ig.velocity.x = 9;
      }
      if (keyIsDown("87") || keyIsDown("38")) {
        dashers += 1;
        jumpAfter = false;
        player_ig.velocity.y = -9;
      }
      if (keyIsDown("83") || keyIsDown("40")) {
        dashers += 1;
        jumpAfter = false;
        player_ig.velocity.y = 10.5;
      }
      if (dashers == 2) {
        player_ig.velocity.y /= 1.2;
        player_ig.velocity.x /= 1.2;
      }
      if (jumpAfter) {
        CANJUMP = true;
      }
  }
  
  if ((keyWentDown("shift") || keyWentDown("x")) && CANDASH) {
    dasher = true;
  }

  // i already had this idea, but i was inspired to actually do it when my GOAT sitting
  // beside me did it too, so whatever its fun and i had the idea anyway
  if (dashFrames > -2) {
    console.log(dashFramers);
    if (dashFramers.length >= 10) {
      // dont wanna type this over and over
      var lastFrame = dashFramers[dashFramers.length-1];
      // p5.js has a dist function!!!!! im so glad.
      if (dist(player_ig.position.x, player_ig.position.y, lastFrame[0], lastFrame[1]) > 10) {
        // push previous frames to the dashFramers array if far enough
        dashFramers.push([player_ig.position.x, player_ig.position.y]);
      }
    }
    else {
      // push previous frames to the dashFramers array if there is too little
      dashFramers.push([player_ig.position.x, player_ig.position.y]);
    }

    if (dashFramers.length > 5) {
      dashFramers.shift();
      dashFramersSprites[0].remove();
      dashFramersSprites.shift();
    }

    let alpha = 255 * ((dashFramers.length-1)/dashFramers.length-1/2);
    let dumbSprite = createSprite(dashFramers[dashFramers.length-1][0], dashFramers[dashFramers.length-1][1], 50, 50);
    let colore = color(255,255,255,alpha);
    dumbSprite.shapeColor = colore;
    dashFramersSprites.push(dumbSprite);
  }

  else {
    if (dashFramersSprites.length > 0) {
      console.log("hello");
      dashFramers.shift();
      dashFramersSprites[0].remove();
      dashFramersSprites.shift();
    }
    dashFramers = [];
  }
  

}

function collisionManagement() {

  // this exists so the player doesnt gain insane speed when falling off of platforms,
  // it just makes it run for one extra frame.
  if (isOnPlatform) {
    player_ig.velocity.y = 0;
    player_ig.velocity.x = 0;
  }

  // normal platform collision
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].shapeColor = "#2D2F3C";
    if (player_ig.collide(platforms[i])) {
      let noGo = platforms[i].position.y + (platforms[i].height);
      if (player_ig.position.y <= platforms[i].position.y && player_ig.position.y < noGo) {
        isOnPlatform = true;
        if (dashFrames <= 0) {
          player_ig.velocity.y = 0;
          player_ig.velocity.x = 0;
        }
        CANJUMP = true;
        CANDASH = true;
      }
    }
  }

  // the platforms you can phase under
  for (let i = 0; i < phase_platforms.length; i++) {
    phase_platforms[i].shapeColor = "#7C4323";
    // why does +20 and -5 work? I DONT KNOW!!!!!
    if (player_ig.position.y+(player_ig.height-5) <= (phase_platforms[i].position.y+20)) {
      isOnPlatform = true;
      phase_platforms[i].physicsType = 'DYNAMIC';
      if (player_ig.collide(phase_platforms[i])) {
        if (dashFrames <= 0) {
          player_ig.velocity.y = 0;
          player_ig.velocity.x = 0;
        }
        CANJUMP = true;
        CANDASH = true;
      }
    }
  }

  isOnPlatform = false;
  
}

function colorSwapper() {
  if (keyWentDown("q")) {
    current_color -= 1;
  }
  if (keyWentDown("e")) {
    current_color += 1;
  }
  if (current_color >= colors.length) {
    current_color = 0;
  }
  if (current_color < 0) {
    current_color = colors.length-1;
  }
}

function cameraFunctions() {
  camera.zoom = 0.75;
  
  camera.position.x = lerp(camera.position.x, player_ig.position.x+camXOffset, 0.1);
  if (camera.position.x <= camera_constraints[0][0]) {
    camera.position.x = camera_constraints[0][0];
  }
  else if (camera.position.x >= camera_constraints[1][0]) {
    camera.position.x = camera_constraints[1][0];
  }

  camera.position.y = lerp(camera.position.y, player_ig.position.y+camYOffset, 0.1);
  if (camera.position.y <= camera_constraints[0][1]) {
    camera.position.y = camera_constraints[0][1];
  }
  else if (camera.position.y >= camera_constraints[1][1]) {
    camera.position.y = camera_constraints[1][1];
  }
}