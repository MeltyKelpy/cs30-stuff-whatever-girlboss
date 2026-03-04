// Ball Array Bruh

let BallArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let ball of BallArray) {
    ball.x += ball.dx;
    ball.y += ball.dy;
    if (ball.x > windowWidth + ball.radius) {
      ball.x = 0 - ball.radius;
      ball.dx += 0.1;
    }
    if (ball.x < 0 - ball.radius) {
      ball.x = windowWidth + ball.radius;
      ball.dy -= 0.1;
    }
    if (ball.y > windowHeight + ball.radius) {
      ball.y = 0 - ball.radius;
      ball.dy += 0.1;
    }
    if (ball.y < 0 - ball.radius) {
      ball.y = windowHeight + ball.radius;
      ball.dy += 0.1;
    }

    fill(ball.r, ball.g, ball.b);
    ellipse(ball.x, ball.y, ball.radius*2);
  }
}

function mousePressed() {
  spawnBall(mouseX, mouseY);
}

function spawnBall(_x, _y) {
  let someBall = {
    x: _x,
    y: _y,
    dx: random(-10, 10),
    dy: random(-10, 10),
    radius: random(10, 30),
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255),
  };
  BallArray.push(someBall);
}