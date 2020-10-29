const canvasHeight = 720;

let container,
    pickerBackground, pickerSignage, pickerText1, pickerText2,
    sliderFontSize, sliderPadding, sliderLeading,
    sliderRow, sliderColumn,
    textInput1, textInput2;

let bodyBackground;

let font,
    cubaoRegular, cubaoNarrow, cubaoWide,
    quiapo;

let signage;


let signageMinWidth, signageMinHeight,
    signageWidth, signageHeight,
    t1bounds, t2bounds, tbounds = { w: [], h: [], x: [], y: [] },
    text1Arr, text2Arr,
    textColors,
    signageRowArr = [], signageColumnArr = [];


let newLine = [0];
let padding = 5;
let leading = 20;

let textwidth, textdescent;
let gtext;

let popInterval, pushInterval;

function preload() {
    cubaoRegular = loadFont("../fonts/CubaoRegular.otf");
    cubaoNarrow = loadFont("../fonts/CubaoNarrow.otf");
    cubaoWide = loadFont("../fonts/CubaoWide.otf");
    quiapo = loadFont("../fonts/Quiapo.otf");
    font = cubaoNarrow;
}

let graphics;

let sign;
function setup() {

    bodyBackground = select("#root");
    createCanvas(windowWidth, canvasHeight, WEBGL);
    frameRate(120);
    container = select('#defaultCanvas0');
    angleMode(DEGREES);

    //--SETUP-DESIGN-OPTIONS----------------------------
    let settingsContainer = createDiv().id("div-settings");
    let divSettingCol1 = createDiv().id("div-setting-column1").parent(settingsContainer);

    createP("Background").parent(divSettingCol1).style("margin", "3px");
    pickerBackground = createColorPicker('#878787').parent(divSettingCol1);

    createP("Signage").parent(divSettingCol1).style("margin", "3px");
    pickerSignage = createColorPicker('#0D0D0D').parent(divSettingCol1);

    createP("Text Color 1").parent(divSettingCol1).style("margin", "3px");
    pickerText1 = createColorPicker('#91FF47').parent(divSettingCol1);

    createP("Text Color 2").parent(divSettingCol1).style("margin", "3px");
    pickerText2 = createColorPicker('#EB5200').parent(divSettingCol1);

    textColors = [pickerText1.color(), pickerText2.color()];
    //--SETUP-INPUT--------------------------------------- 
    let divSettingCol2 = createDiv().id("div-setting-column1").parent(settingsContainer);
    fontSelector = createSelect().parent(divSettingCol2).id("font-picker").style('margin-bottom', '10px')
        .style('width', '100%').style('font-size', '11pt');
    fontSelector.option("Cubao Narrow");
    fontSelector.option("Cubao Regular");
    fontSelector.option("Cubao Wide");
    fontSelector.option("Quiapo");
    fontSelector.selected(0);
    fontSelector.changed(fontSelectEvent);

    createP("Text Size").parent(divSettingCol2).style("margin", "3px");
    sliderFontSize = createSlider(25, 40, 25, 1).parent(divSettingCol2)
        .input(inputEvent);

    createP("Text Leading").parent(divSettingCol2).style("margin", "3px");
    sliderLeading = createSlider(20, 30, 20, 1).parent(divSettingCol2)
        .input(inputEvent);

    createP("Padding").parent(divSettingCol2).style("margin", "3px");
    sliderPadding = createSlider(5, 20, 5, 1).parent(divSettingCol2)
        .input(inputEvent);

    let divSettingCol3 = createDiv().id("div-setting-column1").parent(settingsContainer);
    createP("Rows").parent(divSettingCol3).style("margin", "1px");
    sliderRow = createSlider(1, 5, 1, 1).parent(divSettingCol3);
    createP("Columns").parent(divSettingCol3).style("margin", "1px");
    sliderColumn = createSlider(1, 8, 3, 1).parent(divSettingCol3).input(sliderColumnEvent);

    let divSettingCol4 = createDiv().id("div-setting-column1").parent(settingsContainer);
    createP("Front").parent(divSettingCol4).style("margin", "1px");
    textInput1 = createElement("textarea", "Cubao \nIbabaw").parent(divSettingCol4).input(inputEvent);
    createP("Back").parent(divSettingCol4).style("margin", "1px");
    textInput2 = createElement("textarea", "Sucat \nBicutan").parent(divSettingCol4).input(inputEvent);

    let divSettingCol5 = createDiv().id("div-setting-column1").parent(settingsContainer);
    createA('https://www.behance.net/gallery/66665127/Cubao-Free-Display-Typeface',
        'Cubao Font link', '_blank').parent(divSettingCol5);
    createA('https://www.behance.net/gallery/64253003/Quiapo-Free-Brush-Typeface',
        'Quiapo Font link', '_blank').parent(divSettingCol5);


    //-SETUP-CANVAS-OBJECTS----------------------------------------
    determineBounds();
    // createPlacards();
}

let s = 0;

function draw() {
    background(pickerBackground.color());
    bodyBackground.style('background', pickerBackground.color());

    // let tbounds = font.textBounds(textInput1.value(),-150, -200,sliderFontSize.value());
    // rect(tbounds.x, tbounds.y, tbounds.w, tbounds.h, 5,5,5,5);


    //translateX();
    translate(sliderColumn.value() * 30 + (sliderFontSize.value() * 5)
        * (sliderColumn.value() * 0.2), 0, 0);

    for (let i = 0; i < signageColumnArr.length; i++) {
        translate(-100 * (sliderFontSize.value() * 0.04), 0, 0);

        if (signageColumnArr[i].translated.x > windowWidth) {
            resetX();
        }
        push();
        rotateY(millis() / 20);
        //signageColumnArr[i].update();
        signageColumnArr[i].show();
        pop();
        // else{
        // console.log(signageColumnArr[i].translated.x);
        // }
    }
    // if(placardColumnArr[0].position.x>width){
    //     console.log("pop!");
    // }
    // console.log(placardColumnArr[0]);

    // for( let i = 0 ; i < signageColumnArr.length; i++){
    //     push();
    //     signageColumnArr[i].show();
    //     signageColumnArr[i].update();
    //     pop();
    //    // if(signageColumnArr[i])
    //    if( signageColumnArr[i].position.x>windowWidth){
    //     signageColumnArr[i].resetPosition();
    //    }
    // }

}

function keyPressed(){
    if(keyCode===LEFT_ARROW){
        signageColumnArr.pop();
        console.log("unshift!");
    }
    else if(keyCode===RIGHT_ARROW){
        signageColumnArr.unshift(new Signage());
        console.log("pushed!");
    }
}

function translateX() {
    signageColumnArr.forEach(e => {
       e.update();
      //console.log(e.translated.x)FIX - magkakaparehas nga pala inital X pos ng lahat ng placard even when adjacent with translate
    });
    translate(millis() / 10, 0, 0);
}

function resetX(){
    translate(-100,0,0);
    console.log("rest");
    signageColumnArr.forEach(e => {
       // e.translated.x = 0;
    });
}



function mousePressed() {
    // signageColumnArr.forEach(e => {
    //     e.update();
    // });
}


function sliderColumnEvent() {
    clear();
    inputEvent();
}

function inputEvent() {
    padding = sliderPadding.value();
    leading = sliderLeading.value();

    determineBounds();
}

function fontSelectEvent() {
    let item = fontSelector.value();
    if (item == "Cubao Regular") {
        font = cubaoRegular;
    }
    else if (item == "Cubao Narrow") {
        font = cubaoNarrow;
    }
    else if (item == "Cubao Wide") {
        font = cubaoWide;
    }
    else if (item == "Quiapo") {
        font = quiapo;
    }
    determineBounds();
}

function determineBounds() {
    signageColumnArr = [];
    tbounds = { w: [], h: [], x: [], y: [] };
    newLine = [0];
    text1Arr = textInput1.value().split("\n");
    text2Arr = textInput2.value().split("\n");

    textAlign(CENTER, BASELINE);
    textLeading(leading - 16);

    t1bounds = font.textBounds(textInput1.value(), 0, 0, 25);
    pushBounds(t1bounds.x, t1bounds.y, t1bounds.w, t1bounds.h);

    t2bounds = font.textBounds(textInput2.value(), 0, 0, 25);
    pushBounds(t2bounds.x, t2bounds.y, t2bounds.w, t2bounds.h);

    let match1 = (textInput1.value().match(/\r|\n/g) || []).length;
    let match2 = (textInput2.value().match(/\r|\n/g) || []).length;
    if (match1 || match2) {
        //console.log(match);
        if (match1 > 0)
            newLine.push(match1 + (match1 * 0.1));
        if (match2 > 0)
            newLine.push(match2 + (match2 * 0.1));
    }
    else {
        newLine = [0];
    }
    createSignages();
}


function pushBounds(x, y, w, h) {
    if (isNaN(x) || x == 0)
        tbounds.x.push(0);
    else if (!tbounds.x.find(height => height == x))
        tbounds.x.push(x);

    if (y == Infinity || y == 0)
        tbounds.y.push(0);
    else if (!tbounds.y.find(height => height == y))
        tbounds.y.push(y);

    if (!tbounds.w.find(width => width == w))
        tbounds.w.push(w);

    if (h == -Infinity || h == 0)
        tbounds.h.push(0);
    else if (!tbounds.h.find(height => height == h))
        tbounds.h.push(h);
}
//-READ DIS BOBO 
//-IF DIS SIGNAGE IS OUT OF CANVAS JUST RESET ITS INITIAL POSITION
function createSignages() {
    for (let i = 0; i < sliderColumn.value(); i++) {
        signageColumnArr.push(new Signage());
    }

    //  popInterval = setInterval(function () {
    // //     if(placardColumnArr.length>5){
    // //     placardColumnArr.shift();}
    // placardColumnArr[0].clear();
    //  }, 2000);
    // pushInterval = setInterval(function () {
    //     if (placardColumnArr.length < 6) {
    //         placardColumnArr.push(new Placard());
    //         console.log(placardColumnArr[0]);
    //     }
    //     // if (placardColumnArr[0].position.x == width / 2) {
    //     //     placardColumnArr.shift();
    //     //     console.log("shift!");
    //     // }
    // }, 1000);
    console.log("hey im called!");
}


class Signage {
    constructor() {
        this.body;
        this.dimension = { w: Math.max(...tbounds.w) + padding, h: Math.max(...tbounds.h) + (15 * Math.max(...newLine)) + padding };
        this.position = { x: Math.min(...tbounds.x) - (padding / 2), y: Math.min(...tbounds.y) - (padding / 2), z: 0 };
        this.rotation = 0;
        this.translated = { x: this.position.x };
        //this.index = index;
    }

    update() {
        // this.dimension.w = Math.max(...tbounds.w) + padding;
        // this.dimension.h = Math.max(...tbounds.h) + (15 * Math.max(...newLine)) + padding;
        //this.position.x += 10;
        //this.position.y = Math.min(...tbounds.y) - (padding / 2);
        //this.position.z = 0;
        //this.rotation+=1;
        this.translated.x += 1;
    }

    resetPosition() {
        this.position.x = -this.dimension.w;
        console.log("reset!");
    }

    show() {
        //rotateY(this.rotation);
        //translate(0, 0, 0);
        noStroke();
        scale(sliderFontSize.value() / 25);
        let match1 = (textInput1.value().match(/\r|\n/g) || []).length;
        let match2 = (textInput2.value().match(/\r|\n/g) || []).length;
        if (match1 || match2) {
            //console.log(match);
            if (match1 > 0)
                newLine.push(match1 + (match1 * 0.1));
            if (match2 > 0)
                newLine.push(match2 + (match2 * 0.1));
        }
        else {
            newLine = [0];
        }

        //translate(-(width / 2), 0, 0);
        //push();

        textAlign(CENTER, BASELINE);

        push();
        translate(0, 0, -1);
        fill(pickerSignage.color())
        this.body = rect(this.position.x, this.position.y, this.dimension.w, this.dimension.h, 5, 5, 5, 5);
        pop();

        push();
        fill(pickerText1.color());
        textFont(font);
        textSize(25);
        textLeading(leading);
        //translate(0, 0, 0);
        for (let i = 0; i < text1Arr.length; i++) {
            let color;
            if ((i) % 2 == 0) {
                color = pickerText1.color();
            }
            else {
                color = pickerText2.color();
            }
            fill(color)
            text(text1Arr[i], this.position.x + this.dimension.w / 2, i * leading);
        }
        pop();

        push();
        fill(pickerText2.color());
        textFont(font);
        textSize(25);
        textLeading(leading);
        rotateY(180);
        translate(0, 0, 1.5);
        for (let i = 0; i < text2Arr.length; i++) {
            let color;
            if ((i) % 2 == 0) {
                color = pickerText2.color();
            }
            else {
                color = pickerText1.color();
            }
            fill(color)
            text(text2Arr[i], -(this.position.x + this.dimension.w / 2), i * leading);
        }
        pop();
        //pop();
    }
}




//BASURA-----------------------------------------------------

// show2() {
//     //rotateY(mouseX / 180);
//     //beginShape(TRIANGLE_STRIP);
//     push();
//     graphics.fill("red")
//     graphics.textLeading(mouseY);
//     graphics.textFont(font);
//     graphics.textSize(sliderFontSize.value());
//     //graphics.textAlign(CENTER, CENTER);
//     graphics.background("green");
//     gtext = graphics.text(textInput1.value(), padding,
//         (placardHeight / 2) + (sliderFontSize.value() / 2.75));
//     textwidth = graphics.textWidth(gtext);
//     textdescent = textDescent() * 9;
//     //console.log(textw);
//     graphics.line(padding + (textwidth - 15), 0, padding + (textwidth - 15), 50);
//     graphics.line(0, textdescent, graphics.width, textdescent);
//     texture(graphics);
//     //rect(-150, -120, 300, 240);
//     //strokeWeight(10);
//     // point(-150, -120, 0);
//     // point(150, -120, 0);
//     // point(-150, 120, 0);
//     // point(150, 120, 0);
//     strokeWeight(3);
//     translate(0, 0, 1);
//     //scale(sliderFontSize.value() / 25, sliderFontSize.value() / 25);
//     noStroke();
//     placard = rect(-150, -100, placardWidth, placardHeight);
//     let text = textInput1.value();
//     //CHECK NUMBER OF LINE BREAKS
//     let match = (text.match(/\r|\n/g) || []).length;
//     if (match) {
//         console.log(match);
//     }
//     // vertex(-150, -120, 0, 0, 0);
//     // vertex(150, -120, 0, 600, 0);
//     // vertex(-150, 120, 0, 0, 240);
//     // vertex(150, 120, 0, 600, 240);
//     //endShape(CLOSE);
//     pop();
// }