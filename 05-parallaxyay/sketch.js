// they call this one parallax scrolling if you're awesome B")

let theTiles = [];
const CONSTS_ARE_USELESS = 10; // i will forever preach my truth....

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let x = CONSTS_ARE_USELESS/2; x < width; x += CONSTS_ARE_USELESS) {
    for (let y = CONSTS_ARE_USELESS/2; y < height; y += CONSTS_ARE_USELESS) {
      let theGoat = spawnTile(x,y, CONSTS_ARE_USELESS);
      theTiles.push(theGoat);
    }
  }
}

function draw() {
  background(220);
  for (let tile of theTiles) {
    line(tile.point1.x,tile.point1.y,tile.point2.x,tile.point2.y);
  }
}

function spawnTile(x, y, tileSize) {
  let chance = random(100);
  let tile;
  if (chance < 50) {
    tile = {point1:{x: x - tileSize/2, y: y + tileSize/2}, point2:{x: x + tileSize/2, y: y - tileSize/2}} // dictionary... my beautiful baby... i love dictionaries....
  }
  else {
    tile = {point1:{x: x - tileSize/2, y: y - tileSize/2}, point2:{x: x + tileSize/2, y: y + tileSize/2}}
  }
  return tile;
}