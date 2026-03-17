function setup() {

  createCanvas(1280, 720);  

  opener = createElement('h3', 'Welcome to...');
  opener.position((width / 2) - 185, (height / 2) - 140);
  opener.style("font-family", "verdana");

  title = createElement('h1', 'UNNAMED JS FIGHTING GAME!');
  title.position(((width / 2) - 100) - title.width / 2, (height / 2) - 125);
  title.style("font-family", "verdana");

  user = createElement('h2', 'Set a Username:');
  user.position((width / 2) - 35, (height / 2) - 50);
  user.style("font-family", "verdana");

  input1 = createInput();
  input1.position((width / 2) - 12, (height / 2));

  server = createElement('h2', 'Choose a ServerID:');
  server.position((width / 2) - 48, (height / 2) + 10);
  server.style("font-family", "verdana");

  input2 = createInput();
  input2.position((width / 2) - 10, (height / 2) + 60);

  button = createButton('PLAY!');
  button.position((width / 2) + 50, 475);
  button.mousePressed(load);

}

function draw() {
  background(50);
}

function load() {
  let data = {"username":input1.value(), "server":input2.value()};
  localStorage.setItem('personal_data', JSON.stringify(data));
  console.log(localStorage.getItem("personal_data"));
  window.location.href = "game.html";
}