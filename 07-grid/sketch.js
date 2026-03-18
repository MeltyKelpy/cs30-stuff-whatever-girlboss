// Grid Demo
// 2D array type it

let grid =[
  [1,0,0,1,1],
  [1,0,0,1,1],
  [1,0,0,1,0],
  [1,1,1,1,1],
  [1,1,1,1,1],
  [1,0,0,1,1],
  [1,0,0,1,1],
  [1,0,0,1,1,1],
  ];
let size = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  showGridyBuddy();
}

function showGridyBuddy() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== -1) {
        fill("white");
        if (grid[y][x] === 1) {
          fill("black");
        }
        square(size*x, size*y, size);
      }
    }
  }
}

function mouseClicked() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      console.log(mouseX, mouseY, grid[y][x] * size, y * size);
      if (((mouseX < grid[y][x] + size) && (mouseX > grid[y][x]) && (mouseY < y + size) && (mouseY > y))) {
        console.log("hi");
        if (grid[y][x] === 0) {
          grid[y][x] = 1;
        }
        if (grid[y][x] === 1) {
          grid[y][x] = 0;
        }
        break
      }
    }
  }
}