// Grid Demo
// 2D array type it

let grid =[];
let size = 50;
let columms = 4;
let rows = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  grid = createGrid(columms, rows);
}

function createGrid() {
  let output = [];
  for (let i = 0; i < columms; i++) {
    let curArray = [];
    for (let e = 0; e < rows; e++) {
      let randoms = random(100);
      if (randoms > 50) {
        curArray.push(1);
      }
      if (randoms < 50) {
        curArray.push(0);
      }
    }
    output.push(curArray);
  }
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
        textSize(8);
        fill(255);
        textAlign(CENTER);
        text(size*x+", "+size*y+", "+(size*x+size)+", "+(size*y+size), size*x+size/2, size*y+size/2);
      }
    }
  }
}

function mousePressed() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (((mouseX <= x * size + size) && (mouseX >= x * size)) && ((mouseY <= y * size + size) && (mouseY >= y * size))) {
        console.log(mouseX, mouseY, grid[y][x] * size, y * size);
        if (grid[y][x] === 0) {
          grid[y][x] = 1;
        }
        else if (grid[y][x] === 1) {
          grid[y][x] = 0;
        }
        break
      }
    }
  }
}