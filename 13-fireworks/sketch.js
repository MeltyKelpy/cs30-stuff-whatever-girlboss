// tried to do this in a cooler way and it bugged out so. whatever!

class Particle {
  constructor(x, y, size = 5, minVel = -5, maxVel = 5, id = "null") {
    this.x = x;
    this.y = y;
    this.dx = random(minVel, maxVel);
    this.dy = random(minVel, maxVel);
    this.size = size;
    this.r = 255;
    this.g = 200;
    this.b = 150;
    this.alpha = 255;
    this.id = id;
  }

  move() {
    console.log(this.alpha);
    if (this.alpha > 70) {
      this.x += this.dx;
      this.y += this.dy;
      
      if (this.b >= 3) {
        this.b-=3;
      }
      if (this.b >= 3) {
        this.g-=3;
      }
      this.alpha--;
      this.alpha--;
    }
    else {
      if (this.id !== "null") {
        delete particles[this.id];
      }
    }
  }

  display() {
    if (this.alpha > 50) {
      noStroke();
      fill(this.r, this.g, this.b, this.alpha);
      circle(this.x, this.y, this.size);
    }
  }
}

let particles = {};
let total_particle_count = 0;
let particle_count_per_click = 47;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  for (let particle of Object.keys(particles)) {
    if (particle in particles && particles[particle] !== undefined) {
      particles[particle].display();
      particles[particle].move();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < particle_count_per_click; i++) {
    total_particle_count += 1;
    particles[""+total_particle_count] = new Particle(mouseX, mouseY, 5, -5, 5, ""+total_particle_count);
  }
}