// forgot the header last timee,,,,, oops,,,,,

let my, guests, shared;
let spawn_cords = {x: 550, y: 100}
let platforms = [];
let buddy;

function preload() {
  // connect to a p5party server
  partyConnect("wss://demoserver.p5party.org", "2DBattle");
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared", {
    player_sprites : [],
    players_total : 0,
  });
}

function setup() {
  createCanvas(5000, 720);

  my.player = new pal(spawn_cords.x, spawn_cords.y);
  console.log("am i host?", partyIsHost());
  console.log("me", JSON.stringify(my));
  console.log("guests", JSON.stringify(guests));

  createPlatform(150,600,width,50);
}

function reset() {
  my.player = new pal(spawn_cords.x, spawn_cords.y);
}

function createPlatform(_x = 0, _y = 0, _width = 10, _height = 10, _color = 255) {
  platforms.push({x : _x,y : _y,width : _width,height : _height,color : _color});
}


function draw() {
  background(50);
  
  if (my.player != null) {
    my.player.collisionManager();
    my.player.cameraFunctions();
    my.player.update();
  }
  else {
    reset();
  }

  for (let guest of guests) {
    fill(255,0,0);
    rect(guest.player.x, guest.player.y, guest.player.width, guest.player.height);
  }

  for (let platform of platforms) {
    fill(platform.color);
    rect(platform.x,platform.y,platform.width,platform.height);
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
  constructor(x = 0, y = 0) {
    this.canJump = true;
    this.isOnPlatform = false;
    this.speed = 10;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.velocity = {x: 0, y: 0};
    shared.players_total += 1;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.velocity.x = 0;
    if ((keyIsDown("68") || keyIsDown("39")) && this.canJump) {
      this.velocity.x += this.speed;
    }
    if ((keyIsDown("65") || keyIsDown("37")) && this.canJump) {
      this.velocity.x -= this.speed;
    }
    if ((keyIsDown("68") || keyIsDown("39")) && !this.canJump) {
      this.velocity.x += this.speed;
    }
    if ((keyIsDown("65") || keyIsDown("37")) && !this.canJump) {
      this.velocity.x -= this.speed;
    }
  }
    
  collisionManager() {

    if (this.isOnPlatform) {
      this.velocity.y = 0;
      this.canJump = true;
    }
    else {
      this.velocity.y += 3;
    }

    this.isOnPlatform = false;

    if (keyIsDown("32") && this.canJump) {
      this.canJump = false;
      this.velocity.y -= 25;
      this.y -= 1;
    }

    for (let i = 0; i < platforms.length; i++) {
      if ((this.y + this.height >= platforms[i].y) && (this.x >= platforms[i].x && this.x <= platforms[i].x + platforms[i].width)) {
        this.isOnPlatform = true;
        this.velocity.y = 0;
        this.y = platforms[i].y - this.height;
      }
    }
  }
  
  cameraFunctions() {
  }

}