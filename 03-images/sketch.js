// Image Demo BlegghghH!!!!!

let mariobrother;

function preload() {
  mariobrother = loadImage("shrilowBase.png");
}

function setup() {
  createCanvas(500, 500);
  imageMode(CENTER);
}

function draw() {
  background(220);
  image(mariobrother, mouseX, mouseY, mariobrother.width * 0.10, mariobrother.height * 0.10);
}