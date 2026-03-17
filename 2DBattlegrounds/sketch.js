// forgot the header last timee,,,,, oops,,,,,

let my, guests, shared;
let spawn_cords = {x: 550, y: 100}
let platforms = [];
let buddy;
let images = [
  "sprite/idle.png",
  "sprite/propel.png",
  "sprite/light.png",
  "sprite/hit.png",
  "sprite/dead.png"
  ]
let sprites = [];
let sprite_offsets = {x: -15, y: -30};
let data = JSON.parse(localStorage.getItem("personal_data"));

function preload() {
  // connect to a p5party server

  partyConnect("wss://demoserver.p5party.org", data["server"]);
  my = partyLoadMyShared();
  guests = partyLoadGuestShareds();
  shared = partyLoadShared("shared", {
    players_total : 0,
    hitboxs : []
  });

  for (i of images) {
    sprites.push(loadImage(i));
  }
}

function setup() {
  createCanvas(2000, 720);

  for (let guest of guests) {
    if (guest.name == data["username"]) {
      data["username"] = "copycat";
      break
    }
  }

  my.player = new pal(spawn_cords.x, spawn_cords.y);
  console.log("am i host?", partyIsHost());
  console.log("me", JSON.stringify(my));
  console.log("guests", JSON.stringify(guests));
  stroke(0);
  strokeWeight(2);
  camera.zoom = 1.6;

  createPlatform(0,670,5000,50);
}

function onInput() {
  clear();
  text("Write in the input box to change the text", 10, 20);
  fill("green");
  strokeWeight(10);
  rect(0, 80, 600, 100);

  // Get the text entered
  fill("black");
  text(this.value(), 20, 120);
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

  for (let hitbox of shared.hitboxs) {
    fill(color(255,0,0,150));
    rect(hitbox.x,hitbox.y,hitbox.width,hitbox.height);
  }

  for (let guest of guests) {

    fill("red");
    rect(guest.player.x, guest.player.y - 20, 52, 10);
    fill(color(0, 255, 33));
    if (guest.player.health < 0) {
      fill(color(81, 3, 0));
    }
    rect(guest.player.x, guest.player.y - 20, 52 * (guest.player.health / 100), 10);

    textSize(8);
    fill(255);
    textAlign(CENTER);
    text(guest.player.name, guest.player.x + 3, guest.player.y - 25, 50);

    tint(guest.player.color.r, guest.player.color.g, guest.player.color.b);
    push();
    scale(guest.player.last_direction, 1);
    noSmooth();
    // i tried to not do this like this but... it had a weird offset when flipped </3
    if (guest.player.last_direction == -1) {
      image(sprites[guest.player.status], (guest.player.x+sprite_offsets.x)*guest.player.last_direction - 80, guest.player.y+sprite_offsets.y); 
    }
    else {
      image(sprites[guest.player.status], guest.player.x+sprite_offsets.x, guest.player.y+sprite_offsets.y); 
    }
    pop();
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

function mouseClicked() {
  if (my.player.status < 2) {
    my.player.status = 2;
    let removal = shared.hitboxs.length;
    let x_pos = (my.player.x + my.player.width) - 7;
    if (my.player.last_direction == -1) {
      x_pos = (my.player.x - my.player.width) + 32;
    }
    shared.hitboxs.push({x: x_pos, y: my.player.y, width: 25, height: 50, "instigator": my.player.name});
    setTimeout(() => {
      shared.hitboxs.splice(removal, 1);
    }, 140);
    setTimeout(() => {
      my.player.status = 0;
    }, 160);
  }
}

class pal {
  constructor(x = 0, y = 0) {
    shared.players_total += 1;
    this.canJump = true;
    this.isOnPlatform = false;
    this.speed = 7;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.color = {r: Math.floor(Math.floor(Math.random() * 256)), g: Math.floor(Math.floor(Math.random() * 256)), b: Math.floor(Math.floor(Math.random() * 256))}
    this.velocity = {x: 0, y: 0};
    this.name = "unnamed fool";
    if (data["username"] != "" && data["username"] != undefined) {
      this.name = data["username"];
      if (this.name == "copycat") {
        this.name = "copycat" + shared.players_total;
      }
    }
    this.last_direction = 1;
    this.status = 0; // this just determines what to set the animation to
    this.health = 100;
  }

  update() {

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.velocity.x = 0;

    if (this.status != 4) {

      if ((keyIsDown("68") || keyIsDown("39"))) {
        this.velocity.x += this.speed;
        this.last_direction = 1
      }
      if ((keyIsDown("65") || keyIsDown("37"))) {
        this.velocity.x -= this.speed;
        this.last_direction = -1
      }

      if (this.health >= 100) {
        this.health = 100;
      }
      if (this.health < 0) {
        this.status = 4;
      }

    }

  }
    
  collisionManager() {

    if (this.isOnPlatform) {
      if (my.player.status < 2) {
        this.status = 0
      }
      this.velocity.y = 0;
      this.canJump = true;
    }
    else {
      this.velocity.y += 1.5;
    }

    this.isOnPlatform = false;

    for (let i = 0; i < platforms.length; i++) {
      if (((this.y + this.height >= platforms[i].y)) && (this.x >= platforms[i].x && this.x <= platforms[i].x + platforms[i].width)) {
        this.isOnPlatform = true;
        this.velocity.y = 0;
        this.y = platforms[i].y - this.height;
      }
    }

    if (this.status != 4) {
      if (keyIsDown("32") && this.canJump) {
        if (my.player.status < 2) {
          this.status = 1
        }
        this.canJump = false;
        this.velocity.y -= 15;
        this.y -= 1;
      }

      for (let hitbox of shared.hitboxs) {
        if (((hitbox.x <= this.x + this.width) && (this.x <= hitbox.x + hitbox.width)) && ((hitbox.y <= this.y + this.height) && (this.y <= hitbox.y + hitbox.height))) {
          if (hitbox["instigator"] != this.name && this.status != 3) {
            this.status = 3;
            this.health -= 5;
            this.velocity.x += (10 * -this.last_direction)
            this.velocity.y -= 14;
            setTimeout(() => {
              this.status = 0;
            }, 175);
          }
        }
      }

      /*for (let guest of guests) {
        if ((this.y + this.height >= guest.y)) {
          this.velocity.y = 0;
          this.velocity.x = 0;
          this.y = guest.y - this.height;
        }
      }*/
    }
  }
  
  cameraFunctions() {
    let camera_constraints = {x_left: 200, x_right: -3330, y: -120};
    let camera_y = 0;
    let camera_x = 0;

    if (height / 2 - this.y < camera_constraints.y) {
      camera_y = camera_constraints.y;
    }
    else {
      camera_y = height / 2 - this.y;
    }

    if (width / 2 - this.x > camera_constraints.x_left) {
      camera_x = camera_constraints.x_left;
    }
    else if (width / 2 - this.x < camera_constraints.x_right) {
      camera_x = camera_constraints.x_right;
    }
    else {
      camera_x = width / 2 - this.x;
    }

    translate(camera_x, camera_y);
  }

}