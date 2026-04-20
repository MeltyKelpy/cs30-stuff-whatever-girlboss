let arrayOfBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  for (let point of arrayOfBalls) {
    point.update();
    for (let otherPoint of arrayOfBalls) {
      if (otherPoint !== point) {
        point.ballBounceCheck(otherPoint);
      }
    }
  }
  for (let point of arrayOfBalls) {
    point.display();
  }
}

function mousePressed() {
  arrayOfBalls.push(new MovingPoint(mouseX, mouseY));
}

class MovingPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.origRadius = 15;
    this.maxRadius = 30;
    this.radius = 15;
    this.xTime = random(1000);
    this.yTime = random(1000);
    this.deltaTime = 0.05;
    this.speed = 5;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.dx = 0;
    this.dy = 0;
  }
  
  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.radius*2);
  }

  update() {
    this.move();
    this.teleporter();
    this.mouser();
  }

  mouser() {
    let mausDist = dist(this.x, this.y, mouseX, mouseY);
    if (mausDist < 90) {
      this.radius = map(mausDist, 0, 90, this.maxRadius, this.origRadius);
    }
    else {
      this.radius = this.origRadius;
    }
  }

  teleporter() {
    if (this.x + this.radius < 0) {
      this.x += width;
    }
    if (this.x - this.radius > width) {
      this.x -= width;
    }
    if (this.y + this.radius < 0) {
      this.y += height;
    }
    if (this.y - this.radius > height) {
      this.y -= height;
    }
  }

  move() {
    this.dx = noise(this.xTime);
    this.dy = noise(this.yTime);

    this.dx = map(this.dx, 0, 1, -this.speed, this.speed);
    this.dy = map(this.dy, 0, 1, -this.speed, this.speed);

    this.x += this.dx;
    this.y += this.dy;

    this.xTime += this.deltaTime;
    this.yTime += this.deltaTime;
  }

  ballBounceCheck(otherBall) {
    let seperation = dist(this.x, this.y, otherBall.x, otherBall.y);
    if (90 > seperation) {
      push();
      this.x += otherBall.dx/2;
      this.y += otherBall.dy/2;
      otherBall.x += this.dx/2;
      otherBall.y += this.dy/2;
      strokeWeight(7);
      stroke(this.r, this.g, this.b);
      line(this.x, this.y, otherBall.x, otherBall.y);
      pop();
    }
  }
}
