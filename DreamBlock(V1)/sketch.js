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
var camera_constraints = [[200, 100], [300, 100]];

function setup() {
  const game = createCanvas(800,400);
  game.canvas.style = "";

  player_ig = createSprite(200, 200, 50, 50);
  player_ig.setCollider("rectangle", 0,0,50,50);
  player_ig.shapeColor = color(34, 56, 76);

  var platform = createSprite(400, 400, 1500, 100);
  var platform3 = createSprite(100, 200, 300, 50);
  platforms.push(platform);
  platforms.push(platform3);

  var platform2 = createSprite(600, 200, 300, 50);
  phase_platforms.push(platform2);
  
}

function draw() {
  background(150,150,150);

  fill(200);
  textAlign(CENTER);
  text("DreamBlock Test", width/2, 20);
  
  if (isOnPlatform) {
    player_ig.velocity.y = 0;
    player_ig.velocity.x = 0;
  }

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

  if (dashFrames < -2) {
    player_ig.velocity.y += GRAVITY;
    player_ig.shapeColor = colors[current_color];
  }
  else {
    player_ig.shapeColor = color(255, 255, 255);
    dashFrames -= 1;
  }
  
  if (storeJump > 0) {
    storeJump -= 1;
    if (CANJUMP) {
      player_ig.velocity.y = -JUMP;
      CANJUMP = false;
      isOnPlatform = false;
    }
  }

  isOnPlatform = false;
  
  if((keyWentDown("z") || keyWentDown("space"))){
    if (CANJUMP) {
      player_ig.velocity.y = -JUMP;
      CANJUMP = false;
    }
    else {
      storeJump = 10;
    }
  }
  
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


  camera.zoom = 0.5;
  
  camera.position.x = lerp(camera.position.x, player_ig.position.x+(100), 0.2);
  if (camera.position.x <= camera_constraints[0][0]) {
    camera.position.x = camera_constraints[0][0];
  }
  else if (camera.position.x >= camera_constraints[1][0]) {
    camera.position.x = camera_constraints[1][0];
  }

  camera.position.y = lerp(camera.position.y, player_ig.position.y-(25), 0.2);
  if (camera.position.y <= camera_constraints[0][1]) {
    camera.position.y = camera_constraints[0][1];
  }
  else if (camera.position.y >= camera_constraints[1][1]) {
    camera.position.y = camera_constraints[1][1];
  }
  
  drawSprites();

}