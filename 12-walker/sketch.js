class Walker {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.diameter = 2;
    this.color = color;
    this.speed = 5;
  }

  display() {
    fill(this.color);
    stroke(this.color);
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.y -= this.speed;
    }
    else if (choice < 50) {
      this.y += this.speed;
    }
    else if (choice < 75) {
      this.x -= this.speed;
    }
    else {
      this.x += this.speed;
    }
  }
}

let theWalkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  for (let myPal of theWalkers) {
    myPal.move();
    myPal.display();
  }
}

function mousePressed() {
  theWalkers.push(new Walker(mouseX, mouseY, color(random(255),random(255),random(255))));
}