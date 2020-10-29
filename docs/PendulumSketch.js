const { Engine, Events, Render, Runner, World, Body, Bodies, Mouse, MouseConstraint, Constraint, Composite, Composites, Vector } = Matter;

let world;
let runner;

const canvasHeight = 720;

let container,
    colorPicker1, colorPicker2;

let bodyBackground, hueVal;

let engine, mouse, mouseConstraint, render;

let pendulum;

let height1 = 90, width1 = 50;


function setup() {

    capturer = null;
    bodyBackground = select("#root");
    //createCanvas(windowWidth, canvasHeight);
    frameRate(120);
    //container = select('#defaultCanvas0');

    //--SETUP-DESIGN-OPTIONS----------------------------
    let settingsContainer = createDiv().id("div-settings");
    let divSettingCol1 = createDiv().id("div-setting-column1");
    divSettingCol1.parent(settingsContainer);

    createP('Ball').parent(divSettingCol1);
    colorPicker1 = createColorPicker('#747474').parent(divSettingCol1);
    colorPicker2 = createColorPicker('purple').parent(divSettingCol1);
    hueVal = hue(colorPicker2.color());

    setupMatterWorld();
}


function setupMatterWorld() {

    //--MATTER-SETUP------------------------------------
    engine = Engine.create();
    world = engine.world;

    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            background: 'argb(255,255,255,0)'
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    //--DEFINE-MOUSE----------------------------------
    mouse = Mouse.create(canvas.elt);

    //--SET-PARAMS-----------------------------------
    mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05, angularStiffness: 0 }
    }
    //--CREATE-MOUSECONSTRAINT----------------------

    //--ADD-BODIES--------------------------------------------------
    var group = Body.nextGroup(true),
        length = height1,
        width = width1;

    pendulum = Composites.stack(350, 160, 2, 1, -20, 0, function (x, y) {
        return Bodies.rectangle(x, y, length, width, {
            collisionFilter: { group: group },
            frictionAir: 0,
            chamfer: 5,
            render: {
                fillStyle: 'red',
                strokeStyle: 'blue',
                lineWidth: 3
            }
        });
    });

    pendulum.bodies[0].render.strokeStyle = '#4a485b';
    pendulum.bodies[1].render.strokeStyle = '#4a485b';

    Composites.chain(pendulum, 0.45, 0, -0.45, 0, {
        stiffness: 0.9,
        length: 0,
        angularStiffness: 0.7
    });

    Composite.add(pendulum, Constraint.create({
        bodyB: pendulum.bodies[0],
        pointB: { x: -length * 0.42, y: 0 },
        pointA: { x: pendulum.bodies[0].position.x - length * 0.42, y: pendulum.bodies[0].position.y },
        stiffness: 0.9,
        length: 0,
    }));

    var lowerArm = pendulum.bodies[1];

    Body.rotate(lowerArm, -Math.PI * 0.3, {
        x: lowerArm.position.x - 100,
        y: lowerArm.position.y
    });

    World.add(world, pendulum);

    //--RUN-ENGINE-------------------------------------------------
    //runner = Engine.run(engine);

    var trail = [];

    Events.on(render, 'afterRender', function () {
        trail.unshift({
            position: Vector.clone(lowerArm.position),
            speed: lowerArm.speed
        });

        Render.startViewTransform(render);
        render.context.globalAlpha = 0.7;

        let lowerArmDegAngle = -180/PI*lowerArm.angle,
        angleVal = lowerArmDegAngle-(360*(lowerArmDegAngle/360));
        

        for (var i = 0; i < trail.length; i++) {
            let point = trail[i].position,
                speed = trail[i].speed;
                
        console.log(hueVal);
                //let polarCoord = trail[i].position.x+height1;

            var hue = hueVal-150 + Math.round((1 - Math.min(1, speed / 10)) * 170);
            render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
            render.context.fillRect(point.x, point.y, 2, 2);
        }
        //console.log(lowerArm.angle,angleVal);
        render.context.globalAlpha = 1;
        Render.endViewTransform(render);

        if (trail.length > 150) {
            trail.pop();
        }
    });

    // add mouse control
    var mouse = Mouse.create(render.canvas);
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        mouseConstraint.mouse.pixelRatio = pixelDensity();

    World.add(world, mouseConstraint);
    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 700, y: 600 }
    });

    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
    //--WORLD-&-ENGINE-SETTINGS------------------------------------
}

function draw() {
    //background(colorPicker1.color());
    bodyBackground.style('background', colorPicker1.color());
    hueVal = hue(colorPicker2.color());

    drawMouse(mouseConstraint);
}

function mousePressed() {

}

function drawMouse(mouseConstraint) {
    if (mouseConstraint.body) {
        var pos = mouseConstraint.body.position;
        var offset = mouseConstraint.constraint.pointB;
        var m = mouseConstraint.mouse.position;
        fill("green");
        line(pos.x + offset.x, pos.y + offset.y, m.x - offset.x, m.y - offset.y);
    }
}

class Pendulum {
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