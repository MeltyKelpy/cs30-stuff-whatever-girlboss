// forgot the header last timee,,,,, oops,,,,,
// Object Notation and Arrays Assignment
// Aurora Gurel
// March 5/26
//
// Extra for Experts:
//
// I presume the use of images counts, but also I have:
// - A Menu to set username and server to join
// - System to use multiple servers in the first place lol
// - A Class for Players
// - Multiplayer/untaught libraries
// - Not only using Arrays and Object Notations, but using them in tandem (arrays containing Object Notations)
//
// I intend to update this project in the future similarly to DreamBlock, but for now this is what I did.
// exceedingly simple, gets a good laugh between pals for a minute, and meets more than all the requirements
// (to my knowledge)

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
  noSmooth();

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
  my.player = new pal(spawn_cords.x, spawn_cords.y); // reset the pal if it bugs out
  // i thought i'd use this more ngl
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
    // i tried to not do this like this but... it had a weird offset when flipped </3
    if (guest.player.last_direction == -1) {
      image(sprites[guest.player.status], (guest.player.x+sprite_offsets.x)*guest.player.last_direction - 80, guest.player.y+sprite_offsets.y); 
    }
    else {
      image(sprites[guest.player.status], guest.player.x+sprite_offsets.x, guest.player.y+sprite_offsets.y); 
    }
    pop(); // i heard this push and pop usage makes this work better? trusting that
  }

  if (shared.hitboxs.length > 3) {
    shared.hitboxs = []; // if hitboxes get stuck, delete them! rudimentary solution, but it works well enough
    // and also keeps the humor of random hitboxes while not letting it get out of hand or anything, def wanna
    // find a better solution for this though
  }

  for (let platform of platforms) {
    // create platforms! i meant to use more but. eh its fine
    fill(platform.color);
    rect(platform.x,platform.y,platform.width,platform.height);
  }
}

function mouseClicked() {
  // hitboxing it out
  if (my.player.status < 2) {
    my.player.status = 2;
    let removal = shared.hitboxs.length;
    let x_pos = (my.player.x + my.player.width) - 7;
    my.player.speed = 2; // make this guy slow.
    if (my.player.last_direction == -1) {
      x_pos = (my.player.x - my.player.width) + 32;
    }
    shared.hitboxs.push({x: x_pos, y: my.player.y, width: 25, height: 50, "instigator": my.player.name});
    setTimeout(() => {
      shared.hitboxs.splice(removal, 1); // kill the hitbox after some time
    }, 140);
    setTimeout(() => {
      // return player to normal after some time
      my.player.speed = 7;
      my.player.status = 0;
    }, 160);
  }
}

class pal {
  constructor(x = 0, y = 0) {
    // my variables.... uougghh i love classes!
    shared.players_total += 1;
    this.canJump = true;
    this.isOnPlatform = false;
    this.speed = 7;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.color = {r: Math.floor(Math.floor(Math.random() * 256)), g: Math.floor(Math.floor(Math.random() * 256)), b: Math.floor(Math.floor(Math.random() * 256))} // random color
    this.velocity = {x: 0, y: 0};
    this.name = "unnamed fool";
    this.name = data["username"]; // tried to make a solution for same names, but it hated me so whatever
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

      // scrapped thing for being able to stand on peoples heads

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
    // caaammera
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