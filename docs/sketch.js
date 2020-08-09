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
  fontSelector,
  saveBtn;

let bodyBackground;


let texts, chars;
let dancingScriptFont,
  codystarFont,
  ubuntuBoldFont;
let font;

let engine, cradle, cradleCount;


let timerId;
let progress_;

let ellipses = [];
let constraints = [];

let mouse;

let capturer;
let isCaptureCanvas = false;


function preload() {
  dancingScriptFont = loadFont("https://cloudywolf16.github.io/DesignAndTypeTest/fonts/DancingScript.ttf");
  codystarFont = loadFont("https://cloudywolf16.github.io/DesignAndTypeTest/fonts/Codystar.ttf");
  ubuntuBoldFont = loadFont("https://cloudywolf16.github.io/DesignAndTypeTest/fonts/UbuntuBold.ttf");
  font = ubuntuBoldFont;

}

function setup() {

  capturer = null;
  bodyBackground = select("#root");
  createCanvas(windowWidth, canvasHeight);
  frameRate(120);
  container = select('#defaultCanvas0');

  //--SETUP-DESIGN-OPTIONS----------------------------
  let settingsContainer = createDiv().id("div-settings");
  let divSettingCol1 = createDiv().id("div-setting-column1");
  divSettingCol1.parent(settingsContainer);

  createP("Text Size").parent(divSettingCol1).style('margin','2px 5px');
  textSizeSlider = createSlider(20, 90, 40, 1).parent(divSettingCol1).style('width', '100px').style('margin-bottom','5px');
  createP("Ball Size").parent(divSettingCol1).style('margin','2px 5px');
  ballSizeSlider = createSlider(10, 90, 40, 1).parent(divSettingCol1).style('width', '100px').style('margin-bottom','5px');
  ballSizeSlider.input(updateCradle);
  createP("Cradle Height").parent(divSettingCol1).style('margin','2px 5px');
  cradleHeightSlider = createSlider(0, 250, 210, 1).parent(divSettingCol1).style('width', '100px').style('margin-bottom','5px');
  cradleHeightSlider.input(updateCradle);
  createP("Gravity Scale").parent(divSettingCol1).style('margin','2px 5px');
  gravityScaleSlider = createSlider(0, 0.001, 0.001, 0.0001).parent(divSettingCol1).style('width', '100px').style('margin-bottom','5px');
  gravityScaleSlider.input(setGravityScale);


  let divSettingCol2 = createDiv().parent(settingsContainer).id("div-setting-column2");
  let divCol2Text = createDiv().parent(divSettingCol2).id("div-sett-col2-text");
  let divCol2Input = createDiv().parent(divSettingCol2).id("div-sett-col2-input");
  createP('Ball').parent(divCol2Text);
  colorPicker1 = createColorPicker('#24B6FF').parent(divCol2Input);
  createP('Text').parent(divCol2Text);
  colorPicker2 = createColorPicker('#4D58FF').parent(divCol2Input);
  createP('Background').parent(divCol2Text);
  colorPicker3 = createColorPicker('#303030').parent(divCol2Input);
  ballColorCheckBox = createCheckbox("", true).parent(divCol2Input);
  createP('Show Bead').parent(divCol2Text);
  constraintsCheckBox = createCheckbox("", true).parent(divCol2Input);
  createP('Show Constriants').parent(divCol2Text);



  //--SETUP-INPUT---------------------------------------  
  let divSettingCol3 = createDiv().id("div-setting-column3");
  divSettingCol3.parent(settingsContainer);

  
  fontSelector = createSelect().parent(divSettingCol3).id("font-picker").style('margin-bottom', '10px')
  .style('width','100%').style('font-size','11pt');
  fontSelector.option("Ubuntu Bold");
  fontSelector.option("DancingScript");
  fontSelector.option("Codystar");
  fontSelector.selected(0);
  fontSelector.changed(fontSelectEvent);

  textInput = createInput('Inertia').parent(divSettingCol3);
  textInput.style('height', '25px').style('margin-bottom', '10px').style('font-size','13pt');
  textInput.input(textInputEvent);


  saveBtn = createButton("Start Recording").parent(divSettingCol3).id("btnSave")
  saveBtn.style("min", "10px").style('margin-left','auto');
  saveBtn.mouseClicked(captureCanvas);

  let resetBtn = createButton("Reset").parent(divSettingCol3).style('margin-top', 'auto')
  .style('margin-left','auto');
  resetBtn.mouseClicked(updateCradle);

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
  if (item == "DancingScript") {
    font = dancingScriptFont;
  }
  else if (item == "Codystar") {
    font = codystarFont;
  }
  else if (item == "Ubuntu Bold") {
    font = ubuntuBoldFont;
  }
}

function textInputEvent() {
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
  bodyBackground.style('background',colorPicker3.color());
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
   document.getElementById("btnSave").textContent = "Stop Recording";
  }
  else {
    document.getElementById("btnSave").textContent = "Start Recording";
  }

  if (progress_ > 0) {
    document.getElementById("btnSave").textContent = "Progress " + floor((progress_ * 100)) + "%";
  }
}

function captureCanvas() {

  if (capturer && isCaptureCanvas == true) {
    setTimeout(function () {
      console.log("Recording stopped!");
      capturer.stop();
      document.getElementById("btnSave").disabled = true;
      saveCapture();
      isCaptureCanvas = false;
      //loop();
    }, 500);
  }
  else {
    isCaptureCanvas = true;
    capturer = new CCapture({
      framerate: 120,
      verbose: false,
      format: 'gif',
      workersPath: 'https://cloudywolf16.github.io/DesignAndTypeTest/lib/',
      framerate: 0,
      autoSaveTime: 0,
      timeLimit: 30,
      onProgress: function (saveProgress) {
        progress_ = saveProgress;
      }
    });
    capturer.start();
    console.log("Recording started");
  }
}


async function saveCapture() {
  const save_ = await capturer.save(function (outputData) {
    progress_ = null;
    document.getElementById("btnSave").disabled = false;
    ModalComponent(outputData);
    const modal =  document.getElementById("myModal");
    modal.style.display = "block";

    // FB.ui({
    //   display: 'popup',
    //   type: 'image',
    //   method: 'share',
    //   href: url.toString(),
    // }, function (response) {
    //   if (response && !response.error_message) {
    //     alert('Posting completed.');
    //   } else {
    //     alert('Error while posting.');
    //   }
    // });
  });
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
    textFont(font);
    fill(colorPicker2.color());
    text(this.char, (this.position.x - (tWidth / 2)), (this.position.y + (ballSizeSlider.value() * 0.25)));
  }

}

/*

<meta property="og:url"                content="http:" />
<meta property="og:type"               content="image" />
<meta property="og:image:type"               content="image/gif" />
<meta property="fb:app_id"               content="MYAPPID" />
*/
