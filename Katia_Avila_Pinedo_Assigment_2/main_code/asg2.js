// modifed for asg2.html Katia Avila Pinedo 4-2024

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_XRotateMatrix;
  uniform mat4 u_YRotateMatrix;
  uniform mat4 u_ZRotateMatrix;
  void main() { 
    gl_Position = u_XRotateMatrix * u_YRotateMatrix * u_ZRotateMatrix * u_ModelMatrix * a_Position;
  }`
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;  // uniform
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Define global variablesm, UI elements or shader variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_XRotateMatrix;
let u_YRotateMatrix;
let u_ZRotateMatrix;


// Setup WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}

// Setup GLSL
function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_XRotateMatrix
  u_XRotateMatrix = gl.getUniformLocation(gl.program, 'u_XRotateMatrix');
  if (!u_XRotateMatrix) {
    console.log('Failed to get the storage location of u_XRotateMatrix');
    return;
  }
  // Get the storage location of u_YRotateMatrix
  u_YRotateMatrix = gl.getUniformLocation(gl.program, 'u_YRotateMatrix');
  if (!u_YRotateMatrix) {
    console.log('Failed to get the storage location of u_YRotateMatrix');
    return;
  }
  // Get the storage location of u_ZRotateMatrix
  u_ZRotateMatrix = gl.getUniformLocation(gl.program, 'u_ZRotateMatrix');
  if (!u_ZRotateMatrix) {
    console.log('Failed to get the storage location of u_ZRotateMatrix');
    return;
  }

  //set an initial value for this matrix indentity
  var indentityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, indentityM.elements);
}

// Globals related to UI elments
let g_angleX = 25; // camera angle
let g_angleY = 0; // camera angle
let g_angleZ = 0; // camera angle
let g_rightTopAngle = 45; // angle top right arm
let g_rightBottomAngle = 0; // angle bottom right
let g_leftTopAngle = -45; // angle top left arm
let g_leftBottomAngle = 0; // angle bottom left
let g_leftThighAngle = 160;
let g_leftCalfAngle = 0;
let g_rightThighAngle = -90;
let g_rightCalfAngle = 0;


// animations
let g_thrustAngle = 0; // thrust angle
let g_thrustAnimation = false;

function addActionsForHTMLUI() {
  // Perspective Slider Events
  document.getElementById('angleXslide').addEventListener('mousemove', function () { g_angleX = this.value; renderAllShapes(); })
  document.getElementById('angleYslide').addEventListener('mousemove', function () { g_angleY = this.value; renderAllShapes(); })
  document.getElementById('angleZslide').addEventListener('mousemove', function () { g_angleZ = this.value; renderAllShapes(); })

  // Right Arm Slider Events
  document.getElementById('rightTopSlide').addEventListener('mousemove', function () { g_rightTopAngle = this.value; renderAllShapes(); })
  document.getElementById('rightBottomSlide').addEventListener('mousemove', function () { g_rightBottomAngle = this.value; renderAllShapes(); })
  // Left Arm Slider Events
  document.getElementById('leftTopSlide').addEventListener('mousemove', function () { g_leftTopAngle = this.value; renderAllShapes(); })
  document.getElementById('leftBottomSlide').addEventListener('mousemove', function () { g_leftBottomAngle = this.value; renderAllShapes(); })

  // Left Leg Slider Events
  document.getElementById('leftThighSlide').addEventListener('mousemove', function () { g_leftThighAngle = this.value; renderAllShapes(); })
  document.getElementById('leftCalfSlide').addEventListener('mousemove', function () { g_leftCalfAngle = this.value; renderAllShapes(); })
  // Right Leg Slider Events
  document.getElementById('rightThighSlide').addEventListener('mousemove', function () { g_rightThighAngle = this.value; renderAllShapes(); })
  document.getElementById('rightCalfSlide').addEventListener('mousemove', function () { g_rightCalfAngle = this.value; renderAllShapes(); })

  // Thrust animation
  document.getElementById('thrustSlide').addEventListener('mousemove', function () { g_thrustAngle = this.value; renderAllShapes(); })

  // Thrust buttons
  document.getElementById('thrustStart').onclick = function () {
    g_thrustAnimation = true;
    // set arms down
    g_leftTopAngle = 90;
    document.getElementById('leftTopSlide').value = 90;
    g_leftBottomAngle = 90;
    document.getElementById('leftBottomSlide').value = 90;
    g_rightTopAngle = -90;
    document.getElementById('rightTopSlide').value = -90;
    g_rightBottomAngle = 90;
    document.getElementById('rightBottomSlide').value = 90;
    // spread legs
    g_leftThighAngle = 90;
    document.getElementById("leftThighSlide").value = 90;
    g_leftCalfAngle = 90;
    document.getElementById("leftCalfSlide").value = 90;
    g_rightThighAngle = 0;
    document.getElementById("rightThighSlide").value = 0;
    g_rightCalfAngle = -90;
    document.getElementById("rightCalfSlide").value = -90;

  };

  document.getElementById('thrustStop').onclick = function () { g_thrustAnimation = false; };

}


function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shade programs and connect glsl variables
  connectVariablesToGLSL();
  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // renderAllShapes();
  // console.log("HERE");
  requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = (performance.now() / 1000.0) - g_startTime;
function tick() {
  // Save the current time
  g_seconds = (performance.now() / 1000.0) - g_startTime;
  // Update animation angles
  updateAnimationAngles();

  // Draw everthing
  renderAllShapes();

  // tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_thrustAnimation) {
    g_thrustAngle = 35 * Math.sin(g_seconds * 2.5); // start animation thrust

  }
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Pass matrix to u_ModelMatrix attribute
  var xAngMat = new Matrix4().rotate(g_angleX, 0, 1, 0);
  gl.uniformMatrix4fv(u_XRotateMatrix, false, xAngMat.elements);
  var yAngMat = new Matrix4().rotate(g_angleY, 1, 0, 0);
  gl.uniformMatrix4fv(u_YRotateMatrix, false, yAngMat.elements);
  var zAngMat = new Matrix4().rotate(g_angleZ, 0, 0, 1);
  gl.uniformMatrix4fv(u_ZRotateMatrix, false, zAngMat.elements);

  // main body    torso.color = [0.91, 0.8, 0.69, 1.0];
  // tan body    pecR.color = [0.83, 0.71, 0.59, 1.0];
  // dark skin    [0.66, 0.52, 0.37, 1.0]
  // underpands  [0.71, 0.21, 0.16, 1.0];
  // aqua light [0.4, 0.68, 0.49, 1.0]
  // aqua dark [0.24, 0.33, 0.29, 1.0];

  // TORSO
  var torso = new Cube();
  torso.color = [0.91, 0.8, 0.69, 1.0];
  torso.matrix.translate(-0.1, 0.0, 0);
  var torsoCoordMatrix = new Matrix4(torso.matrix);
  torso.matrix.scale(0.75, 1.36, .2);
  torso.render();
  // BELT
  var belt = new Cube();
  belt.color = [0.84, 0.77, 0.38, 1.0];
  belt.matrix.set(torsoCoordMatrix);
  belt.matrix.translate(-0.03, -0.04, 0.01);
  belt.matrix.rotate(g_thrustAngle, 1, 0, 0);
  var beltCoordMatrix = new Matrix4(belt.matrix);
  belt.matrix.scale(1, 0.25, .3);
  belt.render();
  // BUTT ALL
  var buttWhole = new Cube();
  buttWhole.colorSplit = [0.75, 0.19, 0.16, 1.0];
  buttWhole.color = [0.91, 0.8, 0.69, 1.0];
  buttWhole.matrix.set(beltCoordMatrix);
  buttWhole.matrix.translate(0.0, -0.2, 0.025);
  buttWhole.matrix.scale(1, 0.8, 0.4);
  var buttWholeCoordMatrix = new Matrix4(buttWhole.matrix);
  buttWhole.renderSplitRect3();
  // BULDGE 
  var buldge = new Cube();
  buldge.color = [0.71, 0.21, 0.16, 1.0];
  buldge.matrix.set(buttWholeCoordMatrix);
  buldge.matrix.translate(0.09, 0, -0.25);
  buldge.matrix.scale(0.3, 0.7, 0.35);
  buldge.render();

  // left leg thigh
  var thighL = new Cube();
  thighL.color = [0.91, 0.8, 0.69, 1.0];
  thighL.matrix.set(beltCoordMatrix);
  thighL.matrix.translate(0.1, -0.2, 0.0251);
  thighL.matrix.rotate(g_leftThighAngle, 0, 0, 1);
  var thighLCoordMatrix = new Matrix4(thighL.matrix);
  thighL.matrix.scale(0.4, 1.4, 0.4);
  thighL.render();
  // left leg
  var legL = new Cube();
  legL.color = [0.24, 0.33, 0.29, 1.0];
  legL.matrix.set(thighLCoordMatrix);
  legL.matrix.translate(0, 0.25, -0.0001);
  legL.matrix.rotate(g_leftCalfAngle, 0, 0, 1);
  legL.matrix.scale(0.4, 1, 0.4);
  legL.render();

  // right leg thigh
  var thighR = new Cube();
  thighR.color = [0.91, 0.8, 0.69, 1.0];
  thighR.matrix.set(beltCoordMatrix);
  thighR.matrix.translate(0.15, -0.2, 0.0251);
  thighR.matrix.rotate(g_rightThighAngle, 0, 0, 1);
  var thighRCoordMatrix = new Matrix4(thighR.matrix);
  thighR.matrix.scale(1.4, 0.4, 0.4);
  thighR.render();
  // right leg
  var rightL = new Cube();
  rightL.color = [0.24, 0.33, 0.29, 1.0];
  rightL.matrix.set(thighRCoordMatrix);
  rightL.matrix.translate(0.25, 0, -0.0001);
  rightL.matrix.rotate(g_rightCalfAngle, 0, 0, 1);
  rightL.matrix.scale(1, 0.4, 0.4);
  rightL.render();

  // COLLARBONE cube
  var collar = new Cube();
  collar.color = [0.91, 0.8, 0.69, 1.0];
  collar.colorSplit = [0.37, 0.63, 0.5, 1]
  collar.matrix.set(torsoCoordMatrix);
  collar.matrix.translate(-0.09, 0.34, 0.0);
  var collarCoordMatrix = new Matrix4(collar.matrix);
  collar.matrix.scale(1.5, 0.4, .2);
  collar.renderSplitRect2();
  // NECK
  var neck = new Cube();
  neck.color = [0.91, 0.8, 0.69, 1.0];
  neck.matrix.set(collarCoordMatrix);
  neck.matrix.translate(0.15, 0.1, 0, 0);
  neck.matrix.scale(0.3,0.4,0.4);
  neck.render();

  // right arm, top section cube
  var armRT = new Cube();
  armRT.color = [0.91, 0.8, 0.69, 1.0];
  armRT.matrix.set(torsoCoordMatrix);
  armRT.matrix.translate(0.236, 0.34, 0.001);
  armRT.matrix.rotate(g_rightTopAngle, 0, 0, 1);
  var rightArmCoordMart = new Matrix4(armRT.matrix);
  armRT.matrix.scale(1.1, 0.2, 0.2);
  armRT.render();
  // right arm, bottom section 
  var armRB = new Cube();
  armRB.color = [0.37, 0.63, 0.5, 1];
  armRB.matrix.set(rightArmCoordMart);
  armRB.matrix.translate(0.23, 0.05, 0.0001);
  armRB.matrix.rotate(-g_rightBottomAngle, 0, 0, 1);
  armRB.matrix.scale(0.2, 1.2, 0.2);
  armRB.render();


  // left arm, top section
  var armLT = new Cube();
  armLT.color = [0.24, 0.33, 0.29, 1.0];
  armLT.matrix.set(torsoCoordMatrix);
  armLT.matrix.translate(-0.041, 0.34, 0.001);
  armLT.matrix.rotate(90, 0, 0, 1);
  armLT.matrix.rotate(g_leftTopAngle, 0, 0, 1);
  var leftArmCoordMart = new Matrix4(armLT.matrix);
  armLT.matrix.scale(0.2, 1.1, 0.2);
  armLT.render();
  // left arm, bottom section 
  var armLB = new Cube();
  armLB.color = [0.37, 0.63, 0.5, 1];
  armLB.matrix.set(leftArmCoordMart);
  armLB.matrix.translate(0, 0.27, 0.0001);
  armLB.matrix.rotate(-90, 0, 0, 1);
  armLB.matrix.rotate(g_leftBottomAngle, 0, 0, 1);
  armLB.matrix.scale(0.2, 1.1, 0.2);
  armLB.render();


  // left pec
  var pecL = new Cube();
  pecL.color = [0.83, 0.71, 0.59, 1.0];
  pecL.matrix.set(torsoCoordMatrix);
  pecL.matrix.translate(0.0, 0.3, -0.05);
  pecL.matrix.scale(0.38, 0.3, 0.15);
  var leftPecMatrix = new Matrix4(pecL.matrix);
  pecL.render();
  // right pec
  var pecR = new Cube();
  pecR.color = [0.83, 0.71, 0.59, 1.0];
  pecL.matrix.set(torsoCoordMatrix);
  pecR.matrix.translate(-0.01, 0.3, -0.05);
  pecR.matrix.scale(0.38, 0.3, 0.15);
  var rightPecMatrix = new Matrix4(pecR.matrix);
  pecR.render();

  // left pec nip
  var pecNipL = new Cube();
  pecNipL.color = [0.66, 0.52, 0.37, 1.0];
  pecNipL.matrix.set(leftPecMatrix);
  pecNipL.matrix.translate(0.1, 0.05, -0.25);
  pecNipL.matrix.rotate(45, 0, 0, 1);
  pecNipL.matrix.scale(0.3, 0.3, 0.25);
  pecNipL.render();
  // right pec nip
  var pecNipR = new Cube();
  pecNipR.color = [0.66, 0.52, 0.37, 1.0];
  pecNipR.matrix.set(rightPecMatrix);
  pecNipR.matrix.translate(0.15, 0.05, -0.25);
  pecNipR.matrix.rotate(45, 0, 0, 1);
  pecNipR.matrix.scale(0.3, 0.3, 0.25);
  pecNipR.render();


}