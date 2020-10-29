


let fonts, font1, font2, font3, font4;
let texts = "Fuck that Shit!"

function preload() {
    fonts = [font1 = loadFont("../fonts/CubaoRegular.otf"),
    font2 = loadFont("../fonts/Quiapo.otf"), font3 = loadFont("../fonts/DancingScript.ttf"),
    font4 = loadFont("../fonts/Codystar.ttf")];

}

let textObj;
function setup() {
    frameRate(5);
    createCanvas(windowWidth, 680);
    textSize(40);
    textObj = new TextBlock();
    
}

let x, y;
let locked = false;

function draw() {
    background(240);
        textObj.show();

}

function mousePressed() {
    locked = true;
}

function mouseDragged() {
    if (locked) {
        x = mouseX; y = mouseY;
    }
}

function mouseReleased() {
    //if (locked) {
    locked = false;
    //}
}

class TextBlock {
    constructor() {
        this.text = "Fuck this shit!";
    }

    show() {
        for (let i = 0; i < this.text.length; i++) {
            fill(floor(random(255)), floor(random(255)), floor(random(255)));
            textFont(fonts[floor(random(0, 3))]);
            text(texts.charAt(i), x + (i * 25) || windowWidth / 3 + (i * 25), y || 680 / 2);
        }
    }
}