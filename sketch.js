// var Engine = Matter.Engine,
//   Render = Matter.Render,
//   Runner = Matter.Runner,
//   Body = Matter.Body,
//   Composites = Matter.Composites,
//   MouseConstraint = Matter.MouseConstraint,
//   Mouse = Matter.Mouse,
//   World = Matter.World;

const { Engine, Render, Runner, World, Body, Bodies, Mouse, MouseConstraint, Constraint, Composite, Composites } = Matter;

let world;
let runner;

const canvasHeight = 720;

let container,
  colorPicker1,
  colorPicker2,
  colorPicker3,
  canvasColorPicker,
  cradleHeightSlider,
  gravityScaleSlider,
  ballSizeSlider,
  ballColorCheckBox,
  constraintsCheckBox,
  textInput,
  fontSelector;


let texts;
let chars;
let dancingScriptFont,
  codystarFont,
  ubuntuBoldFont;
let font;

let engine
let cradle;
let cradleCount;


let timerId;

let ellipses = [];
let constraints = [];

let ellipseSize = 25;
let mouse;

let capturer;
let isCaptureCanvas = false;

function preload() {
  dancingScriptFont = loadFont("fonts/DancingScript.ttf");
  codystarFont = loadFont("fonts/Codystar.ttf");
  ubuntuBoldFont = loadFont("fonts/UbuntuBold.ttf");
  font = ubuntuBoldFont;
}

function setup() {

  capturer = null;

  createCanvas(windowWidth, canvasHeight);
  frameRate(120);
  container = select('#defaultCanvas0');

  //--SETUP-DESIGN-OPTIONS----------------------------
  let toolContainer = createDiv().id("div-settings");
  let divRow1 = createDiv().id("div-row1");
  divRow1.parent(toolContainer);


  fontSelector = createSelect().parent(divRow1);
  fontSelector.option("Ubuntu Bold");
  fontSelector.option("DancingScript");
  fontSelector.option("Codystar");
  fontSelector.selected(0);
  fontSelector.changed(fontSelectEvent);


  createP('Ball').parent(divRow1).style("margin-left","25px");
  colorPicker1 = createColorPicker('#E0F1FF').parent(divRow1);
  createP('Text').parent(divRow1).style("margin-left", "25px");
  colorPicker2 = createColorPicker('#404040').parent(divRow1);
  createP('Background').parent(divRow1).style("margin-left", "25px");
  colorPicker3 = createColorPicker('#404040').parent(divRow1);
  ballColorCheckBox = createCheckbox("", true).parent(divRow1).style("margin-left", "40px");
  createP('Show Ball').parent(divRow1);
  constraintsCheckBox = createCheckbox("", true).parent(divRow1).style("margin-left", "20px");
  createP('Show Constriants').parent(divRow1);

  let divRow2 = createDiv().id("div-row2");
  divRow2.parent(toolContainer);
  createP("Text Size").parent(divRow2);
  textSizeSlider = createSlider(20, 90, 40, 1).parent(divRow2);
  textSizeSlider.style('width', '100px');
  createP("Ball Size").parent(divRow2);
  ballSizeSlider = createSlider(10, 90, 40, 1).parent(divRow2);
  ballSizeSlider.style('width', '100px');
  ballSizeSlider.input(updateCradle);
  createP("Cradle Height").parent(divRow2);
  cradleHeightSlider = createSlider(0, 250, 210, 1).parent(divRow2);
  cradleHeightSlider.style('width', '100px');
  cradleHeightSlider.input(updateCradle);
  createP("Gravity Scale").parent(divRow2);
  gravityScaleSlider = createSlider(0, 0.001, 0.001, 0.0001).parent(divRow2);
  gravityScaleSlider.style('width', '100px');
  gravityScaleSlider.input(setGravityScale);


  //--SETUP-INPUT---------------------------------------  
  let divRow3 = createDiv().id("div-row3");
  divRow3.parent(toolContainer);
  textInput = createInput('Inertia').parent(divRow3);
  textInput.style('height', '25px');
  textInput.input(textInputEvent);




  let saveBtn = createButton("Save as Gif").parent(divRow3);
  saveBtn.style("margin", "10px");
  saveBtn.mousePressed(captureCanvas);

  texts = textInput.value();

  setupMatterWorld();

  visualizeCradle();
}

function setupMatterWorld() {

  //--MATTER-SETUP------------------------------------
  engine = Engine.create();
  world = engine.world;

  //--DEFINE-MOUSE----------------------------------
  mouse = Mouse.create(canvas.elt);

  //--SET-PARAMS-----------------------------------
  mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  //--CREATE-MOUSECONSTRAINT----------------------
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();

  //--ADD-BODIES--------------------------------------------------
  createCradle(world);


  World.add(world, mouseConstraint);

  //--RUN-ENGINE-------------------------------------------------
  runner = Engine.run(engine);

  //--WORLD-&-ENGINE-SETTINGS-----------------------------------

}

function setGravityScale() {
  world.gravity.scale = gravityScaleSlider.value();
}

function createCradle(world) {
  chars = texts.split("");
  cradleCount = chars.length;

  const nCradleX = (width - ((ballSizeSlider.value() * 1.75) * cradleCount)) / 2;
  cradle = Composites.newtonsCradle(nCradleX, canvasHeight / 2.5, cradleCount, ballSizeSlider.value(), cradleHeightSlider.value());
  World.add(world, cradle);
  Body.translate(cradle.bodies[0], { x: -(cradleHeightSlider.value()), y: -(cradleHeightSlider.value() + 10) });
}

function visualizeCradle() {
  ellipses.length = 0;
  constraints.length = 0;
  for (let i = 0; i < cradleCount; i++) {
    constraints.push(new Constraints(cradle.constraints[i].pointA.x, cradle.constraints[i].pointA.y,
      cradle.bodies[i].position.x, cradle.bodies[i].position.y));
    ellipses.push(new Ellipse(cradle.bodies[i].position.x, cradle.bodies[i].position.y, chars[i]));
  }
}

function updateCradle() {
  if (timerId != null || timerId != undefined) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(
    function () {
      Runner.stop(runner);
      World.remove(world, cradle);
      createCradle(world);
      runner = Engine.run(engine);
      //setupMatterWorld();
      visualizeCradle();
      timerId = undefined;
    }, 1000);

}

function fontSelectEvent() {
  let item = fontSelector.value();
  if(item=="DancingScript"){
    font = dancingScriptFont;
  }
  else if(item=="Codystar"){
    font = codystarFont;
  }
  else if(item=="Ubuntu Bold"){
    font = ubuntuBoldFont;
  }
}

function textInputEvent() {
  //console.log(ellipses.length,constraints.length);
  if (textInput.value().length > 0) {
    texts = textInput.value();
    updateCradle();
  }
  else {
    texts = "Don't leave me blank";
    updateCradle();
  }
}

function draw() {
  background(colorPicker3.color());
  //console.log(cradle.bodies[0].position.y);

  for (let i = 0; i < ellipses.length; i++) {

    let posX = cradle.bodies[i].position.x;
    let posY = cradle.bodies[i].position.y;

    let constraintPosX = cradle.constraints[i].pointA.x;
    let constraintPosY = cradle.constraints[i].pointA.y;

    constraints[i].update(constraintPosX, constraintPosY, posX, posY);
    constraints[i].show();

    ellipses[i].update(posX, posY);
    ellipses[i].show();

  }
  drawMouse(mouseConstraint);

  if (capturer && isCaptureCanvas == true) {
    capturer.capture(container.elt);
  }
}

function captureCanvas() {

  isCaptureCanvas = true;
  capturer = new CCapture({
    framerate: 120,
    verbose: false,
    format: 'gif',
    workersPath: 'lib/',
    framerate: 0,
    autoSaveTime: 0,
    timeLimit: 30,
  })
  capturer.start();
  console.log("Recording started");
  setTimeout(function () {
    console.log("Recording stopped!");
    capturer.stop();
    saveCapture().then((output) => { alert("puta" + output) });
    isCaptureCanvas = false;
    //loop();
  }, 5000);
}


function saveCapture() {
  const save = (new Promise(() => {
    const saveData = capturer.save();
    return saveData;
  })
    .then((res) => { alert("saved" + res) }));

  return save.then((output) => alert("success" + output));
}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    var pos = mouseConstraint.body.position;
    var offset = mouseConstraint.constraint.pointB;
    var m = mouseConstraint.mouse.position;
  }
}

class Constraints {
  constructor(x1, y1, x2, y2) {
    this.constraintPosition = { x: x1, y: y1 };
    this.ellipsePosition = { x: x2, y: y2 };
  }

  update(x1, y1, x2, y2) {
    this.constraintPosition.x = x1;
    this.constraintPosition.y = y1;
    this.ellipsePosition.x = x2;
    this.ellipsePosition.y = y2;
  }

  show() {
    if (constraintsCheckBox.checked()) {
      noStroke();
      textSize(25);
      textFont(font);
      fill("#98B0AF");
      ellipse(this.constraintPosition.x, this.constraintPosition.y, 15);
      stroke("white");
      line(this.constraintPosition.x, this.constraintPosition.y, this.ellipsePosition.x, this.ellipsePosition.y);
    }
  }
}


class Ellipse {
  constructor(x, y, char) {
    this.position = { x: x, y: y };
    this.char = char;
  }

  update(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  show() {
    noStroke();
    textSize(textSizeSlider.value());
    let tWidth = textWidth(this.char);
    if (ballColorCheckBox.checked()) {
      fill(colorPicker1.color());
      ellipse(this.position.x, this.position.y, (ballSizeSlider.value() * 2));
    }
    fill(colorPicker2.color());
    text(this.char, (this.position.x - (tWidth / 2)), (this.position.y + (ballSizeSlider.value() * 0.25)));
  }

}