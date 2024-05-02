// modifed for asg2.html Katia Avila Pinedo 4-2024

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_XRotateMatrix;
  uniform mat4 u_YRotateMatrix;
  uniform mat4 u_ZRotateMatrix;
  void main() { 
    gl_Position = u_XRotateMatrix * u_YRotateMatrix * u_ZRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;  // uniform
  void main() {
    gl_FragColor = u_FragColor;
    gl_FragColor = vec4(v_UV, 1.0,1.0);
  }`

// Define global variablesm, UI elements or shader variables
let canvas;
let gl;
let a_Position;
let a_UV;
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
  
  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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
// right arm
let g_rightTopAngle = 25;
let g_rightBottomAngle = 0;
// right leg
let g_rightThighAngle = -90;
let g_rightCalfAngle = 0;
// left arm
let g_leftTopAngle = -25;
let g_leftBottomAngle = 0;
// left leg
let g_leftThighAngle = 160;
let g_leftCalfAngle = 0;
// z- axis
let g_rightArmZAngle = 45;
let g_leftArmZAngle = 45;
// animations
let g_thrustAngle = 0; // thrust angle
let g_thrustAnimation = false;

function addActionsForHTMLUI() {
  // Perspective Slider Events
  document.getElementById('angleXslide').addEventListener('mousemove', function () { g_angleX = this.value; renderAllShapes(); })
  document.getElementById('angleYslide').addEventListener('mousemove', function () { g_angleY = this.value; renderAllShapes(); })
  document.getElementById('angleZslide').addEventListener('mousemove', function () { g_angleZ = this.value; renderAllShapes(); })

  // Right Arm Slider Events
  document.getElementById('rightArmZSlide').addEventListener('mousemove', function () { g_rightArmZAngle = this.value; renderAllShapes(); })
  document.getElementById('rightTopSlide').addEventListener('mousemove', function () { g_rightTopAngle = this.value; renderAllShapes(); })
  document.getElementById('rightBottomSlide').addEventListener('mousemove', function () { g_rightBottomAngle = this.value; renderAllShapes(); })
  // Left Arm Slider Events
  document.getElementById('leftArmZSlide').addEventListener('mousemove', function () { g_leftArmZAngle = this.value; renderAllShapes(); })
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

    // z axis 
    g_leftArmZAngle = -45;
    document.getElementById("leftArmZSlide").value = -45;
    g_rightArmZAngle = -45;
    document.getElementById("rightArmZSlide").value = -45;

  };

  document.getElementById('thrustStop').onclick = function () {
    g_thrustAnimation = false;
    // right arm
    g_rightTopAngle = 25;
    document.getElementById('rightTopSlide').value = 25;
    g_rightBottomAngle = 0;
    document.getElementById('rightBottomSlide').value = 0;
    // right leg
    g_rightThighAngle = -90;
    document.getElementById('rightThighSlide').value = -90;
    g_rightCalfAngle = 0;
    document.getElementById('rightCalfSlide').value = 0;

    // left arm
    g_leftTopAngle = -25;
    document.getElementById('leftTopSlide').value = -25;
    g_leftBottomAngle = 0;
    document.getElementById('leftBottomSlide').value = 0;
    // left leg
    g_leftThighAngle = 160;
    document.getElementById('leftThighSlide').value = 160;
    g_leftCalfAngle = 0;
    document.getElementById('rightBottomSlide').value = 0;

    // z- axis
    g_rightArmZAngle = 45;
    document.getElementById("rightArmZSlide").value = 45;
    g_leftArmZAngle = 45;
    document.getElementById("leftArmZSlide").value = 45;

    // animations
    g_thrustAngle = 0; // thrust angle
    document.getElementById("thrustSlide").value = 0;


  };

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

  // main body    torso.color = [0.92, 0.8, 0.6, 1.0];
  // tan body    pecR.color = [0.83, 0.71, 0.59, 1.0];
  // light body  [0.95, 0.87, 0.76, 1.0];
  // dark skin    [0.66, 0.52, 0.37, 1.0]
  // fish         [0.67, 0.49, 0.31];
  // underpands  [0.71, 0.21, 0.16, 1.0];
  // aqua light [0.4, 0.68, 0.49, 1.0]
  // aqua dark [0.24, 0.33, 0.29, 1.0];
  // light green    [0.88, 0.94, 0.61]
  // hair light [0.4, 0.52, 0.55]
  // hair dark  [0.24, 0.33, 0.4, 1.0];

  // TORSO
  var torso = new Cube();
  torso.color = [0.92, 0.8, 0.6, 1.0];
  torso.matrix.translate(-0.1, 0.0, 0);
  var torsoCoordMatrix = new Matrix4(torso.matrix);
  torso.matrix.scale(0.75, 1.36, .2);
  torso.render();

  // left pec
  var pecL = new Cube();
  pecL.color = [0.95, 0.87, 0.76, 1.0];
  pecL.matrix.set(torsoCoordMatrix);
  pecL.matrix.translate(0.0, 0.3, -0.05);
  pecL.matrix.scale(0.38, 0.3, 0.15);
  var leftPecMatrix = new Matrix4(pecL.matrix);
  pecL.render();
  // left pec nip
  var pecNipL = new Cube();
  pecNipL.color = [0.66, 0.52, 0.37, 1.0];
  pecNipL.matrix.set(leftPecMatrix);
  pecNipL.matrix.translate(0.1, 0.05, -0.25);
  pecNipL.matrix.rotate(45, 0, 0, 1);
  pecNipL.matrix.scale(0.3, 0.3, 0.25);
  pecNipL.render();
  // right pec
  var pecR = new Cube();
  pecR.color = [0.95, 0.87, 0.76, 1.0];
  pecL.matrix.set(torsoCoordMatrix);
  pecR.matrix.translate(-0.01, 0.3, -0.05);
  pecR.matrix.scale(0.38, 0.3, 0.15);
  var rightPecMatrix = new Matrix4(pecR.matrix);
  pecR.render();
  // right pec nip
  var pecNipR = new Cube();
  pecNipR.color = [0.66, 0.52, 0.37, 1.0];
  pecNipR.matrix.set(rightPecMatrix);
  pecNipR.matrix.translate(0.15, 0.05, -0.25);
  pecNipR.matrix.rotate(45, 0, 0, 1);
  pecNipR.matrix.scale(0.3, 0.3, 0.25);
  pecNipR.render();

  // ABS LEFT
  var ab1L = new Cube();
  ab1L.color = [0.95, 0.87, 0.76, 1.0];
  ab1L.matrix.set(torsoCoordMatrix);
  ab1L.matrix.translate(0.04, 0.18, -0.025);
  ab1L.matrix.scale(0.2, 0.2, 0.15);
  ab1L.render();
  var ab2L = new Cube();
  ab2L.color = [0.95, 0.87, 0.76, 1.0];
  ab2L.matrix.set(torsoCoordMatrix);
  ab2L.matrix.translate(0.04, 0.12, -0.025);
  ab2L.matrix.scale(0.2, 0.2, 0.15);
  ab2L.render();
  var ab3L = new Cube();
  ab3L.color = [0.95, 0.87, 0.76, 1.0];
  ab3L.matrix.set(torsoCoordMatrix);
  ab3L.matrix.translate(0.04, 0.06, -0.025);
  ab3L.matrix.scale(0.2, 0.2, 0.15);
  ab3L.render();
  // ABS RIGHT
  var ab1R = new Cube();
  ab1R.color = [0.95, 0.87, 0.76, 1.0];
  ab1R.matrix.set(torsoCoordMatrix);
  ab1R.matrix.translate(0.1, 0.18, -0.025);
  ab1R.matrix.scale(0.2, 0.2, 0.15);
  ab1R.render();
  var ab2R = new Cube();
  ab2R.color = [0.95, 0.87, 0.76, 1.0];
  ab2R.matrix.set(torsoCoordMatrix);
  ab2R.matrix.translate(0.1, 0.12, -0.025);
  ab2R.matrix.scale(0.2, 0.2, 0.15);
  ab2R.render();
  var ab3R = new Cube();
  ab3R.color = [0.95, 0.87, 0.76, 1.0];
  ab3R.matrix.set(torsoCoordMatrix);
  ab3R.matrix.translate(0.1, 0.06, -0.025);
  ab3R.matrix.scale(0.2, 0.18, 0.15);
  ab3R.render();

  // FISH LEFT SIDES
  var fishAbL1 = new Cube();
  fishAbL1.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbL1.matrix.set(torsoCoordMatrix);
  fishAbL1.matrix.translate(-0.012, 0.16, 0);
  fishAbL1.matrix.scale(0.05, 0.15, 0.2);
  fishAbL1.render();
  var fishAbL1A = new Cube();
  fishAbL1A.color = [0.92, 0.8, 0.6, 1.0];
  fishAbL1A.colorSplit = [0.67, 0.49, 0.31, 1.0];
  fishAbL1A.matrix.set(torsoCoordMatrix);
  fishAbL1A.matrix.rotate(90, 0,0,1);
  fishAbL1A.matrix.translate(0.16, -0.025, -0.001);
  fishAbL1A.matrix.scale(0.15, 0.1, 0.2);
  fishAbL1A.renderSplitRect2();

  var fishAbL2 = new Cube();
  fishAbL2.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbL2.matrix.set(torsoCoordMatrix);
  fishAbL2.matrix.translate(-0.012, 0.1, 0);
  fishAbL2.matrix.scale(0.05, 0.15, 0.2);
  fishAbL2.render();
  var fishAbL2A = new Cube();
  fishAbL2A.color = [0.92, 0.8, 0.6, 1.0];
  fishAbL2A.colorSplit = [0.67, 0.49, 0.31, 1.0];
  fishAbL2A.matrix.set(torsoCoordMatrix);
  fishAbL2A.matrix.rotate(90, 0,0,1);
  fishAbL2A.matrix.translate(0.1, -0.025, -0.001);
  fishAbL2A.matrix.scale(0.15, 0.1, 0.2);
  fishAbL2A.renderSplitRect2();

  var fishAbL3 = new Cube();
  fishAbL3.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbL3.matrix.set(torsoCoordMatrix);
  fishAbL3.matrix.translate(-0.012, 0.04, 0);
  fishAbL3.matrix.scale(0.05, 0.15, 0.2);
  fishAbL3.render();
  var fishAbL3A = new Cube();
  fishAbL3A.color = [0.92, 0.8, 0.6, 1.0];
  fishAbL3A.colorSplit = [0.67, 0.49, 0.31, 1.0];
  fishAbL3A.matrix.set(torsoCoordMatrix);
  fishAbL3A.matrix.rotate(90, 0,0,1);
  fishAbL3A.matrix.translate(0.04, -0.025, -0.001);
  fishAbL3A.matrix.scale(0.15, 0.1, 0.2);
  fishAbL3A.renderSplitRect2();
  
  // FISH RIGHT SIDES
  var fishAbR1 = new Cube();
  fishAbR1.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbR1.matrix.set(torsoCoordMatrix);
  fishAbR1.matrix.translate(0.188, 0.16, 0);
  fishAbR1.matrix.scale(0.05, 0.15, 0.2);
  fishAbR1.render();
  var fishAbR1A = new Cube();
  fishAbR1A.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbR1A.colorSplit = [0.92, 0.8, 0.6, 1.0];
  fishAbR1A.matrix.set(torsoCoordMatrix);
  fishAbR1A.matrix.translate(0.165, 0.16, -0.01);
  fishAbR1A.matrix.scale(0.1, 0.15, 0.2);
  fishAbR1A.renderSplitRect2();

  var fishAbR2 = new Cube();
  fishAbR2.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbR2.matrix.set(torsoCoordMatrix);
  fishAbR2.matrix.translate(0.188, 0.1, 0);
  fishAbR2.matrix.scale(0.05, 0.15, 0.2);
  fishAbR2.render();
  var fishAbR2A = new Cube();
  fishAbR2A.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbR2A.colorSplit = [0.92, 0.8, 0.6, 1.0];
  fishAbR2A.matrix.set(torsoCoordMatrix);
  fishAbR2A.matrix.translate(0.165, 0.1, -0.01);
  fishAbR2A.matrix.scale(0.1, 0.15, 0.2);
  fishAbR2A.renderSplitRect2();

  var fishAbR3 = new Cube();
  fishAbR3.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbR3.matrix.set(torsoCoordMatrix);
  fishAbR3.matrix.translate(0.188, 0.04, 0);
  fishAbR3.matrix.scale(0.05, 0.15, 0.2);
  fishAbR3.render();
  var fishAbR3A = new Cube();
  fishAbR3A.color = [0.67, 0.49, 0.31, 1.0]; 
  fishAbR3A.colorSplit = [0.92, 0.8, 0.6, 1.0];
  fishAbR3A.matrix.set(torsoCoordMatrix);
  fishAbR3A.matrix.translate(0.165, 0.04, -0.01);
  fishAbR3A.matrix.scale(0.1, 0.15, 0.2);
  fishAbR3A.renderSplitRect2();

  // COLLARBONE cube
  var collar = new Cube();
  collar.color = [0.92, 0.8, 0.6, 1.0];
  collar.colorSplit = [0.37, 0.63, 0.5, 1]
  collar.matrix.set(torsoCoordMatrix);
  collar.matrix.translate(-0.09, 0.34, 0.0);
  var collarCoordMatrix = new Matrix4(collar.matrix);
  collar.matrix.scale(1.5, 0.4, .2);
  collar.renderSplitRect2();
  // NECK
  var neck = new Cube();
  neck.color = [0.92, 0.8, 0.6, 1.0];
  neck.matrix.set(collarCoordMatrix);
  neck.matrix.translate(0.15, 0.1, 0, 0);
  var neckCoordMatrix = new Matrix4(neck.matrix);
  neck.matrix.scale(0.3, 0.4, 0.25);
  neck.render();

  // HEAD
  var head = new Cube();
  head.color = [0.92, 0.8, 0.6, 1.0];
  head.matrix.set(neckCoordMatrix);
  head.matrix.translate(-0.06, 0.05, 0);
  head.matrix.scale(0.8, 1.2, 0.5);
  var headCoordMatrix = new Matrix4(head.matrix);
  head.render();
  // MOUTH
  var mouth = new Cube();
  mouth.color = [0.4, 0.52, 0.55, 1.0];
  mouth.matrix.set(headCoordMatrix);
  mouth.matrix.translate(0.08, 0.05, -0.25);
  mouth.matrix.scale(0.4, 0.15, 0.2);
  mouth.render();

  // HAIR left
  var hairL = new Cube();
  hairL.color = [0.24, 0.33, 0.4, 1.0];
  hairL.matrix.set(headCoordMatrix);
  hairL.matrix.translate(-0.075, 0.0, 0);
  hairL.matrix.scale(0.3, 1, 1);
  hairL.render();
  // HAIR right
  var hairR = new Cube();
  hairR.color = [0.24, 0.33, 0.4, 1.0];
  hairR.matrix.set(headCoordMatrix);
  hairR.matrix.translate(0.25, 0.0, 0);
  hairR.matrix.scale(0.3, 1, 1);
  hairR.render();
  // HAIR top left
  var hairTL = new Cube();
  hairTL.color = [0.24, 0.33, 0.4, 1.0];
  hairTL.colorSplit = [0.4, 0.52, 0.55, 1.0];
  hairTL.matrix.set(headCoordMatrix);
  hairTL.matrix.translate(0, 0.25, 0);
  hairTL.matrix.scale(0.5, 0.3, 1);
  hairTL.renderSplitRect3();
  // HAIR top right
  var hairTR = new Cube();
  hairTR.color = [0.24, 0.33, 0.4, 1.0];
  hairTR.colorSplit = [0.4, 0.52, 0.55, 1.0];
  hairTR.matrix.set(headCoordMatrix);
  hairTR.matrix.translate(0.125, 0.25, 0);
  hairTR.matrix.scale(0.5, 0.3, 1);
  hairTR.renderSplitRect3();
  // HAIR back
  var headB = new Cube();
  headB.color = [0.24, 0.33, 0.4, 1.0];
  headB.matrix.set(headCoordMatrix);
  headB.matrix.translate(0, 0, 0.05);
  headB.matrix.scale(1, 1, 0.3);
  var headBackCoordMatrix = new Matrix4(headB.matrix);
  headB.render();
  // HAIR back bottom
  var headBB = new Cube();
  headBB.color = [0.4, 0.52, 0.55, 1.0];
  headBB.colorSplit = [0.24, 0.33, 0.4, 1.0];
  headBB.matrix.set(headBackCoordMatrix);
  headBB.matrix.translate(0, 0, 0.3);
  headBB.matrix.scale(1, 0.3, 1.4);
  headBB.renderSplitRect3();

  // EYE LEFT
  var eyeGL = new Cube();
  eyeGL.color = [0.37, 0.63, 0.5, 1];
  eyeGL.matrix.set(headCoordMatrix);
  eyeGL.matrix.translate(0.04, 0.15, -0.25);
  eyeGL.matrix.scale(0.25, 0.2, 0.1);
  var eyeGLCoordMatrix = new Matrix4(eyeGL.matrix);
  eyeGL.render();
  var eyeYL = new Cube();
  eyeYL.color = [0.88, 0.94, 0.61, 1.0]
  eyeYL.matrix.set(eyeGLCoordMatrix);
  eyeYL.matrix.translate(0.125, 0, -0.01);
  eyeYL.matrix.rotate(45, 0,0, 1);
  eyeYL.matrix.scale(0.7, 0.7, 1);
  var eyeYLCoordMatrix = new Matrix4(eyeYL.matrix);
  eyeYL.render();
  var eyeRL = new Cube();
  eyeRL.color =  [0.67, 0.49, 0.31, 1.0]; 
  eyeRL.matrix.set(eyeYLCoordMatrix);
  eyeRL.matrix.rotate(45, 0,0, 1);
  eyeRL.matrix.translate(0.14, -0.03, -0.01)
  eyeRL.matrix.scale(0.3, 0.3, 1);
  eyeRL.render();
  // EYEBROW LEFT
  var browL = new Cube();
  browL.color =  [0.92, 0.8, 0.6, 1.0];
  browL.colorSplit = [0.24, 0.33, 0.4, 1.0];
  browL.matrix.set(eyeGLCoordMatrix);
  browL.matrix.scale(1.2, 0.4, 1);
  browL.matrix.translate(0.25, 0.9, 0);
  browL.matrix.rotate(180,0,0, 1);
  browL.renderSplitRect3();

  // EYE RIGHT
  var eyeGR = new Cube();
  eyeGR.color = [0.37, 0.63, 0.5, 1];
  eyeGR.matrix.set(headCoordMatrix);
  eyeGR.matrix.translate(0.15, 0.15, -0.25);
  eyeGR.matrix.scale(0.25, 0.2, 0.1);
  var eyeGRCoordMatrix = new Matrix4(eyeGR.matrix);
  eyeGR.render();
  var eyeYR = new Cube();
  eyeYR.color = [0.88, 0.94, 0.61, 1.0]
  eyeYR.matrix.set(eyeGRCoordMatrix);
  eyeYR.matrix.translate(0.125, 0, -0.01);
  eyeYR.matrix.rotate(45, 0,0, 1);
  eyeYR.matrix.scale(0.7, 0.7, 1);
  var eyeYRCoordMatrix = new Matrix4(eyeYR.matrix);
  eyeYR.render();
  var eyeRR = new Cube();
  eyeRR.color =  [0.67, 0.49, 0.31, 1.0]; 
  eyeRR.matrix.set(eyeYRCoordMatrix);
  eyeRR.matrix.rotate(45, 0,0, 1);
  eyeRR.matrix.translate(0.14, -0.03, -0.01)
  eyeRR.matrix.scale(0.3, 0.3, 1);
  eyeRR.render();
  // EYEBROW RIGHT
  var browR = new Cube();
  browR.color =  [0.92, 0.8, 0.6, 1.0];
  browR.colorSplit = [0.24, 0.33, 0.4, 1.0];
  browR.matrix.set(eyeGRCoordMatrix);
  browR.matrix.scale(1.2, 0.4, 1);
  browR.matrix.translate(0.25, 0.9, 0);
  browR.matrix.rotate(180,0,0, 1);
  browR.renderSplitRect3();




  // right arm, top section cube
  var armRT = new Cube();
  armRT.color = [0.92, 0.8, 0.6, 1.0];
  armRT.matrix.set(torsoCoordMatrix);
  armRT.matrix.translate(0.236, 0.34, 0.001);
  armRT.matrix.rotate(g_rightTopAngle, 0, 0, 1);
  armRT.matrix.rotate(g_rightArmZAngle, 0, 1, 0);
  var rightArmCoordMart = new Matrix4(armRT.matrix);
  armRT.matrix.scale(1.1, 0.2, 0.2);
  armRT.render();
  // right arm, bottom section 
  var armRB = new Cube();
  armRB.color = [0.37, 0.63, 0.5, 1];
  armRB.matrix.set(rightArmCoordMart);
  armRB.matrix.translate(0.22, 0.05, 0.0001);
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
  armLT.matrix.rotate(-g_leftArmZAngle, 1, 0, 0);
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
  buttWhole.color = [0.92, 0.8, 0.6, 1.0];
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
  thighL.color = [0.92, 0.8, 0.6, 1.0];
  thighL.matrix.set(beltCoordMatrix);
  thighL.matrix.translate(0.1, -0.2, 0.0251);
  thighL.matrix.rotate(g_leftThighAngle, 0, 0, 1);
  var thighLCoordMatrix = new Matrix4(thighL.matrix);
  thighL.matrix.scale(0.4, 1.4, 0.4);
  thighL.render();
  // left leg
  var legL = new Cube();
  legL.color = [0.92, 0.8, 0.6, 1.0];
  legL.matrix.set(thighLCoordMatrix);
  legL.matrix.translate(0, 0.25, -0.0001);
  legL.matrix.rotate(g_leftCalfAngle, 0, 0, 1);
  legL.matrix.scale(0.4, 1, 0.4);
  legL.render();

  // right leg thigh
  var thighR = new Cube();
  thighR.color = [0.92, 0.8, 0.6, 1.0];
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
  rightL.matrix.translate(0.25, 0, -0.001);
  rightL.matrix.rotate(g_rightCalfAngle, 0, 0, 1);
  rightL.matrix.scale(1, 0.4, 0.4);
  rightL.render();


}