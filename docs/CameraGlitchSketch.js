// Daniel Shiffman
// https://youtu.be/rNqaw8LT2ZU
// http://thecodingtrain.com

var video;

var vScale = 8;
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
  video.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      let index = (video.width - x + (y * video.width)) * 4;
      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let bright = (r + g + b) / 3;
      let w = map(bright, 0, 255, 0, vScale);
      let light = map(bright, 0, 255, 0.5, 1.5);

      let angleNinety = 90;
      //--RECTANGLE-1
      //noStroke();
      const rgb = [[255, 0, 0], [0, 255, 255], [255, 0, 255]];
      //rgb[floor(random(0,2))]
      //rectMode(CENTER);
      //rect(x * vScale, y * vScale, w);

      //--RECTANGLE-2
      // noStroke()
      // colorMode(HSB,100);
      // // if(w<=100){
      // // fill(bright);}
      // // else if(w<=150){
      // // fill(bright); }
      // // else if(w<150){
      // //  }
      // // else{
      // //  }
      // fill(100-light,100,100);
      // rectMode(CENTER);
      // rect(x * vScale, y * vScale+7, w);

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
      //fill(r,g,b);
      //stroke(r,g,b);
      // fill(255);
      // stroke(255);
      // strokeWeight(w * 0.10); 
      // quad(x * vScale - vScale, y * vScale - vScale, x * vScale - (vScale / 2) + (w*0.25), y * vScale - (vScale / 1.5), x * vScale + (vScale / 2), y * vScale + (vScale / 1.5), x * vScale + vScale, y * vScale + vScale);

      //--ZIGZAG--x+y+w


      //--ROTATING-SQUARES
      // noStroke();
      // push();
      // fill(bright);
      // translate(x * vScale - 8, y * vScale + 8);
      // rotate(light);
      // rectMode(CENTER);
      // rect(0,0, vScale*0.75);
      // pop();

      //--RANDOM-LETTERS
      // let chars = "ABCDEF00000000011111111";
      // colorMode(HSB,358,100,100);
      // fill(114,100,light);
      // stroke(114,100,light);
      // let letter = chars.charAt(Math.floor(Math.random() * chars.length));
      // text(letter, x * vScale, y * vScale + 12);

      //--TRIANGLE

      // //colorMode(HSB,100);
      // fill(100-light,100,100);
      // stroke(100-light,100,100);
      // fill(r,g,b);
      // stroke(r,g,b);
      // strokeWeight(light*0.065);
      // push();
      // rectMode(CENTER);
      // triangle(x * vScale + (vScale*0.25), y * vScale + vScale, x * vScale + (vScale/2), y * vScale + (vScale*0.5), x * vScale + (vScale*0.75), y * vScale + vScale)
      // pop();

      fill(255);
      stroke(255);
      //fill(r,g,b);
      //stroke(r,g,b);
      //angleMode(DEGREES);
      push();
      rectMode(CENTER);
      translate(x * vScale - 10, y * vScale + 8);
      scale(light);

      if (y % 2 != 0 && x % 2 != 0) {
        let p1x = vScale * 0.35; let p1y = vScale * 0.25;
        let p2x = vScale * 0.25; let p2y = vScale * 0.35;

        let p3x = vScale * 0.65; let p3y = vScale * 0.75;
        let p4x = vScale * 0.75; let p4y = vScale * 0.65;

        bezier(vScale * 0.75, vScale * 0.25, p1x, p1y, p2x, p2y, vScale * 0.25, vScale * 0.75);
        bezier(vScale * 0.75, vScale * 0.25, p3x, p3y, p4x, p4y, vScale * 0.25, vScale * 0.75);
      }
      else if (y % 2 != 0 && x % 2 == 0) {
        let p1x = vScale * 0.65; let p1y = vScale * 0.25;
        let p2x = vScale * 0.75; let p2y = vScale * 0.35;

        let p3x = vScale * 0.25; let p3y = vScale * 0.65;
        let p4x = vScale * 0.35; let p4y = vScale * 0.75;

        bezier(vScale * 0.25, vScale * 0.25, p1x, p1y, p2x, p2y, vScale * 0.75, vScale * 0.75);
        bezier(vScale * 0.25, vScale * 0.25, p3x, p3y, p4x, p4y, vScale * 0.75, vScale * 0.75);
      }
      else if (y % 2 == 0 && x % 2 != 0) {
        let p1x = vScale * 0.65; let p1y = vScale * 0.25;
        let p2x = vScale * 0.75; let p2y = vScale * 0.35;

        let p3x = vScale * 0.25; let p3y = vScale * 0.65;
        let p4x = vScale * 0.35; let p4y = vScale * 0.75;

        bezier(vScale * 0.25, vScale * 0.25, p1x, p1y, p2x, p2y, vScale * 0.75, vScale * 0.75);
        bezier(vScale * 0.25, vScale * 0.25, p3x, p3y, p4x, p4y, vScale * 0.75, vScale * 0.75);
      }
      else if (y % 2 == 0 && x % 2 == 0) {
        let p1x = vScale * 0.35; let p1y = vScale * 0.25;
        let p2x = vScale * 0.25; let p2y = vScale * 0.35;

        let p3x = vScale * 0.65; let p3y = vScale * 0.75;
        let p4x = vScale * 0.75; let p4y = vScale * 0.65;

        bezier(vScale * 0.75, vScale * 0.25, p1x, p1y, p2x, p2y, vScale * 0.25, vScale * 0.75);
        bezier(vScale * 0.75, vScale * 0.25, p3x, p3y, p4x, p4y, vScale * 0.25, vScale * 0.75);
      }

      pop();

      //noLoop();
    }
  }
  //fill("lime");
  //rect(0, 0, vScale);

  //let p1 = vScale*0.35;
  //let p2 = vScale*0.25;
  //let p3 = vScale*0.25;
  //let p4 = vScale*0.35;

  // beginShape();
  // rectMode(CENTER);
  // fill(255);
  // stroke("red")
  // bezier(vScale*0.75, vScale*0.25, vScale*0.35, vScale*0.25, vScale*0.25, vScale*0.35, vScale*0.25, vScale*0.75);
  // bezier(vScale*0.75, vScale*0.25, vScale*0.65, vScale*0.75, vScale*0.75, vScale*0.65, vScale*0.25, vScale*0.75);
  // //fill("blue");
  // //circle(p1, p2, 2);
  // //circle(p3, p4, 2);
  // endShape(CLOSE)
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
