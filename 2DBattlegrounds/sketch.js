// forgot the header last timee,,,,, oops,,,,,

let my, guests, shared;
let spawn_cords = {x: 500, y: 100}

function preload() {
  // connect to a p5party server
  partyConnect("wss://demoserver.p5party.org", "2DBattle");
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared", {
    platforms : [],
  });
}

function createPlatform(x = 0, y = 0, width = 10, height = 10) {
  var platform = createSprite(x,y,width,height);
  platform.shapeColor = color(255);
  shared.platforms.push(platform);
}

function setup() {
  createCanvas(5000, 720);

  my.me = new pal(spawn_cords.x, spawn_cords.y);

  createPlatform(150,700,width,50);
}

function draw() {
  background(50);

  collisionManagement();
  cameraFunctions();
  playerMover();

  drawSprites();
}

function playerMover() {
  my.me.guy.velocity.x = 0;
  if ((keyIsDown("68") || keyIsDown("39")) && CANJUMP) {
    my.me.guy.velocity.x += SPEED;
  }
  if ((keyIsDown("65") || keyIsDown("37")) && CANJUMP) {
    my.me.guy.velocity.x -= SPEED;
  }
  if ((keyIsDown("68") || keyIsDown("39")) && !CANJUMP) {
    my.me.guy.velocity.x += SPEED;
  }
  if ((keyIsDown("65") || keyIsDown("37")) && !CANJUMP) {
    my.me.guy.velocity.x -= SPEED;
  }
}

function collisionManagement() {
  // taken from dream block <3
  // why in the hell would i code it again

  if (my.me.isOnPlatform) {
    my.me.guy.velocity.y = 0;
    my.me.guy.velocity.x = 0;
  }

  for (let i = 0; i < shared.platforms.length; i++) {
    if (my.me.guy.collide(shared.platforms[i])) {
      let noGo = shared.platforms[i].position.y + (shared.platforms[i].height);
      if (my.me.y <= shared.platforms[i].position.y && my.me.y < noGo) {
        my.me.guy.velocity.y = 0;
        my.me.guy.velocity.x = 0;
        my.me.canJump = true;
      }
    }
  }
}

function cameraFunctions() {
  camera.zoom = 1.1;
  
  camera.position.x = lerp(camera.position.x, my.me.x, 0.1);
  if (camera.position.x <= 100) {
    camera.position.x = 100;
  }
  else if (camera.position.x >= 1000) {
    camera.position.x = 1000;
  }

}

  // camera.position.y = lerp(camera.position.y, my.me.y, 0.1);
  // if (camera.position.y <= camera_constraints[0][1]) {
  //   camera.position.y = camera_constraints[0][1];
  // }
  // else if (camera.position.y >= camera_constraints[1][1]) {
  //   camera.position.y = camera_constraints[1][1];
  // }

class pal {
  constructor(x = 0, y = 0, dir = 0) {
    this.canJump = true;
    this.isOnPlatform = false;
    this.guy = createSprite(x, y, 50, 50);
    this.guy.setCollider("rectangle", 0,0,50,50);
    this.guy.shapeColor = color(34, 56, 76);
  }

  update() {
    console.log("hi i exist");
  }
}