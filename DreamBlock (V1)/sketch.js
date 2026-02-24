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

function setup() {
  const game = createCanvas(800,400);
  game.canvas.style = "";

  player_ig = createSprite(200, 200, 50, 50);
  player_ig.setCollider("rectangle", 0,0,50,50);
  player_ig.shapeColor = color(34, 56, 76);

  platform = createSprite(400, 400, 1500, 100);
  platforms.push(platform);
  platform2 = createSprite(600, 200, 300, 50);
  phase_platforms.push(platform2);
  
}

function draw() {
  background(150,150,150);  
  
  fill(200);
  textAlign(CENTER);
  text("DreamBlock V1", width/2, 20);
  
  if (dashFrames <= 0) {
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
    }
  }
  
  // console.log(player_ig.velocity.x + ", " + player_ig.velocity.y);
  
  for (let i = 0; i < platforms.length; i++) {
    if(player_ig.collide(platforms[i])) {
      player_ig.velocity.y = 0;
      let noGo = platforms[i].position.y + (platforms[i].height/2);
      if (player_ig.position.y <= platforms[i].position.y && player_ig.position.y < noGo) {
        player_ig.velocity.x = 0;
        CANJUMP = true;
        CANDASH = true;
      }
    }
  }

  for (let i = 0; i < phase_platforms.length; i++) {
    if(player_ig.collide(phase_platforms[i])) {
      console.log(phase_platforms[i].position.y);
      console.log(player_ig.position.y);
      if (player_ig.position.y <= phase_platforms[i].position.y) {
        player_ig.velocity.y = 0;
        player_ig.velocity.x = 0;
        CANJUMP = true;
        CANDASH = true;
      }
    }
  }
  
  if ((keyIsDown("68")) && CANJUMP) {
    player_ig.velocity.x += SPEED;
  }
  if ((keyIsDown("65")) && CANJUMP) {
    player_ig.velocity.x -= SPEED;
  }

  if ((keyIsDown("68")) && !CANJUMP) {
    player_ig.velocity.x += 0.1;
  }
  if ((keyIsDown("65")) && !CANJUMP) {
    player_ig.velocity.x -= 0.1;
  }
  
  if((keyWentDown("up") || keyWentDown("space"))){
    if (CANJUMP) {
      player_ig.velocity.y = -JUMP;
      CANJUMP = false;
    }
    else {
      storeJump = 10;
    }
  }
  
  if (dasher == true) {
      CANDASH = false;
      dasher = false;
      dashFrames = 12;
      player_ig.velocity.y = 0;
      player_ig.velocity.x = 0;
      if (keyIsDown("65")) {
        player_ig.velocity.x = -7.5;
      }
      if (keyIsDown("68")) {
        player_ig.velocity.x = 7.5;
      }
      if (keyIsDown("87")) {
        player_ig.velocity.y = -10.5;
      }
      if (keyIsDown("83")) {
        player_ig.velocity.y = 10.5;
      }
  }
  
  if (keyWentDown("shift") && CANDASH) {
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
  
  drawSprites();
}