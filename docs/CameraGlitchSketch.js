// Daniel Shiffman
// https://youtu.be/rNqaw8LT2ZU
// http://thecodingtrain.com

var video;

var vScale = 16;
let font;

let canvasDimension = { w: undefined, h: undefined };

function preload() {
  console.log(window.devicePixelRatio * window.screen.width, window.devicePixelRatio * window.screen.height);
  console.log(screen.width, screen.height)
  checkOrientation();

  console.log(screen.orientation.angle);
  //font = loadFont("../fonts/UbuntuBold.ttf");
}

function checkOrientation() {
  if (screen.orientation.angle == 0 || 180) {
    canvasDimension.w = screen.width;
    canvasDimension.h = screen.height;
  }
  else {
    canvasDimension.w = screen.height;
    canvasDimension.h = screen.width;
  }
}

window.onorientationchange = function (event) {
  //console.log("the orientation of the device is now " + event.target.screen.orientation.angle);
  noLoop();
  checkOrientation();
  resizeCanvas(canvasDimension.w, canvasDimension.h);
  loop();
};


let bgColor = 50, strokeColor = 250;

function setup() {
  frameRate(60);
  createCanvas(canvasDimension.w, canvasDimension.h);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width / vScale, height / vScale);
  video.hide();
  //textFont(font);

  createButton("record");

  background(bgColor);
  stroke(strokeColor);
  //initInterval();
}

function initInterval() {
  setInterval(() => {
    if (bgColor == 50) {
      bgColor = 225; strokeColor = 50;
    }
    else if (bgColor != 50) {
      bgColor = 50; strokeColor = 250;
    }

  }, 1500);
}
//--RENAME DIS PROJ TO ALUCINARI
//
function draw() {
  background(bgColor);
  //stroke(strokeColor);
  push();
  video.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x + (y * video.width)) * 4;
      var r = video.pixels[index + 0];
      var g = video.pixels[index + 1];
      var b = video.pixels[index + 2];
      var bright = (r + g + b) / 3;
      var w = map(bright, 0, 255, 0, vScale);
      //--RECTANGLE
      //noStroke();
      const rgb = [[255, 0, 0], [0, 255, 255], [255, 0, 255]];
      //rgb[floor(random(0,2))]
      //rectMode(CENTER);
      //rect(x * vScale, y * vScale, w);

      //--LINES
      //stroke(250);
      //line(x * vScale, y * vScale,x * vScale + 6 , y * vScale + w);

      //--TEXTS
      // fill(255);
      // textSize(floor(w));
      // text("fuck", x * vScale, y * vScale + 15);


      //--CROSS-FIX DIS
      // stroke(250);
      // translate(0, 0);
      // push();
      // line(x * vScale -(width/2), y * vScale -(height/2), x * vScale + (vScale-2) -(width/2), y * vScale -(height/2));
      // pop();

      //--CUBE

      //--DIAGONAL-LINE
      //strokeWeight(w * 0.4);
      //line(x * vScale - vScale, y * vScale - vScale, x * vScale + vScale, y * vScale + vScale);


      //--JAGGED-DIAGONAL-LINE
      fill(r,g,b);
      stroke(r,g,b);
      strokeWeight(w * 0.25); 
      quad(x * vScale - vScale, y * vScale - vScale, x * vScale - (vScale / 2), y * vScale - (vScale / 1.5), x * vScale + (vScale / 2), y * vScale + (vScale / 1.5), x * vScale + vScale, y * vScale + vScale);


      //noLoop();
    }
  }
  pop();
}

//--Select Pixel Color
// let img;
// function preload() {
//   img = loadImage('../cyberpunk-2077-geralt-uhdpaper.com-4K-5.1345-wp.thumbnail.jpg');
// }
// function setup() {
//   createCanvas(480,320);
//   imageMode(CENTER);
//   image(img, 0, 0);
// }

// function draw(){
//   let c = get(mouseX, mouseY);
//   fill(c);
//   noStroke();
//   rect(25, 25, 50, 50);
// }
