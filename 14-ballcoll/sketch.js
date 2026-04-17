class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = random(15, 30);
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }
  
  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.radius*2);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  wallBounceCheck() {
    if (this.y - this.radius <= 0 || this.y + this.radius > height) {
      this.dy *= -1;
    }
    if (this.x - this.radius <= 0 || this.x + this.radius > width) {
      this.dx *= -1;
    }
  }

  ballBounceCheck(otherBall) {
    let radii = this.radius + otherBall.radius;
    let seperation = dist(this.x, this.y, otherBall.x, otherBall.y);
    if (radii > seperation) {
      let dxStore = otherBall.dx;
      let dyStore = otherBall.dy;
      otherBall.dx = this.dx;
      otherBall.dy = this.dy;
      this.dx = dxStore;
      this.dy = dyStore;
    }
  }
}

let arrayOfBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let ball of arrayOfBalls) {
    ball.display();
    ball.move();
    ball.wallBounceCheck();
    for (let otherBall of arrayOfBalls) {
      if (otherBall !== ball) {
        ball.ballBounceCheck(otherBall);
      }
    }
  }

}

function mousePressed() {
  arrayOfBalls.push(new Ball(mouseX, mouseY));
}
