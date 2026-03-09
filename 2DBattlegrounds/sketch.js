// forgot the header last timee,,,,, oops,,,,,

let my, guests, shared;
let spawn_cords = {x: 500, y: 100}
let platforms = [];
let buddy;

function preload() {
  // connect to a p5party server
  partyConnect("wss://demoserver.p5party.org", "2DBattle");
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared", {
    player_sprites : [],
  });
}

function setup() {
  createCanvas(5000, 720);

  my.me = new pal(spawn_cords.x, spawn_cords.y);
  console.log("am i host?", partyIsHost());

  createPlatform(150,700,width,50);
}

function createPlatform(x = 0, y = 0, width = 10, height = 10) {
  let platform = createSprite(x,y,width,height);
  platform.shapeColor = color(255);
  platforms.push(platform);
}


function draw() {
  background(50);

  my.me.collisionManager();
  my.me.cameraFunctions();
  my.me.update();

  for (let i = 0; i < shared.player_sprites.length; i++) {
    rect(shared.player_sprites[i].x,shared.player_sprites[i].x,shared.player_sprites[i].width,shared.player_sprites[i].height);
  }

  drawSprites();
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
    shared.player_sprites.push({x: x, y: y, width: 50, height: 50});
    this.velocity = {x: 0, y: 0};
  }

  update() {
    this.position += this.velocity;

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
      this.velocity.x = 0;
    }
    else {
      this.velocity.y += 10;
    }
  
    // for (let i = 0; i < platforms.length; i++) {
    //   if (this.collide(platforms[i])) {
    //     let noGo = platforms[i].position.y + (platforms[i].height);
    //     if (this.position.y <= platforms[i].position.y && my.me.guy.position.y < noGo) {
    //       this.velocity.y = 0;
    //       this.velocity.x = 0;
    //       this.canJump = true;
    //     }
    //   }
    // }
  }
  
  cameraFunctions() {
    camera.zoom = 1.1;
    
    camera.position.x = lerp(camera.position.x, my.me.x, 0.1);
    if (camera.position.x <= 100) {
      camera.position.x = 100;
    }
    else if (camera.position.x >= 1000) {
      camera.position.x = 1000;
    }
  }

}