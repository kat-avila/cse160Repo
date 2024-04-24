// modifed for asg2.html Katia Avila Pinedo 4-2024

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() { 
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_GlobalRotateMatrix;

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

    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
      console.log('Failed to get the storage location of u_GlobalRotateMatrix');
      return;
    }

  //set an initial value for this matrix indentity
  var indentityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, indentityM.elements);
}

// Globals related to UI elments
let g_globalAngle = 0; // camera angle
let g_rightTopAngle = 0; // angle top right arm
let g_rightBottomAngle = 0; // angle bottom right
let g_leftTopAngle = 0; // angle top left arm
let g_leftBottomAngle = 0; // angle bottom left
// animations
let g_thrustAnimation = false;

function addActionsForHTMLUI() {  
  // Perspective Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); })
  
  // Right Arm Slider Events
  document.getElementById('rightTopSlide').addEventListener('mousemove', function () { g_rightTopAngle = this.value; renderAllShapes(); })
  document.getElementById('rightBottomSlide').addEventListener('mousemove', function () { g_rightBottomAngle = this.value; renderAllShapes(); })
  // Left Arm Slider Events
  document.getElementById('leftTopSlide').addEventListener('mousemove', function () { g_leftTopAngle = this.value; renderAllShapes(); })
  document.getElementById('leftBottomSlide').addEventListener('mousemove', function () { g_leftBottomAngle = this.value; renderAllShapes(); })

  // Thrust buttons
  document.getElementById('thrustStart').onclick = function () {g_thrustAnimation = true; };
  document.getElementById('thrustStop').onclick = function () {g_thrustAnimation = false; };

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

var g_startTime = performance.now()/1000.0;
var g_seconds = (performance.now()/1000.0) - g_startTime;
function tick() {
  // Save the current time
  g_seconds = (performance.now() / 1000.0 )- g_startTime;
  console.log(g_seconds);
  // Draw everthing
  renderAllShapes();

  // tell the browser to update again when it has time
  requestAnimationFrame(tick);
}


// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Pass matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);


  // main body    torso.color = [0.91, 0.8, 0.69, 1.0];
  // tan body    pecR.color = [0.83, 0.71, 0.59, 1.0];
  // dark skin    [0.66, 0.52, 0.37, 1.0]

  // TORSO
  var torso = new Cube();
  torso.color = [0.91, 0.8, 0.69, 1.0];
  torso.matrix.translate(-0.1, 0.0, 0.0);
  var torsoCoordMatrix = new Matrix4(torso.matrix);
  torso.matrix.scale(0.75, 1.36, .2);
  torso.render();

  // COLLARBONE cube
  var collar = new Cube();
  collar.color = [0.37, 0.63, 0.5, 1];
  collar.matrix.set(torsoCoordMatrix);
  collar.matrix.translate(-0.09, 0.34, 0.0);
  collar.matrix.scale(1.5, 0.4, .2);
  collar.render();

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
  armRB.color =[0.37, 0.63, 0.5, 1];
  armRB.matrix.set(rightArmCoordMart);
  armRB.matrix.translate(0.23, 0.05, 0.0001);
  if (g_thrustAnimation) {
    armRB.matrix.rotate(-35 * Math.sin(g_seconds), 0, 0, 1);
  } else { 
    armRB.matrix.rotate(-g_rightBottomAngle, 0, 0, 1);
  }
  console.log(Math.sin(g_seconds));
  armRB.matrix.scale(0.2, 1.1, 0.2);
  armRB.render();

  
  // left arm, top section
  var armLT = new Cube();
  armLT.color = [0.24, 0.33, 0.29, 1.0];
  armLT.matrix.set(torsoCoordMatrix);
  armLT.matrix.translate(-0.041, 0.34, 0.001);
  armLT.matrix.rotate( 90, 0, 0, 1);
  armLT.matrix.rotate(g_leftTopAngle, 0, 0, 1);
  var leftArmCoordMart = new Matrix4(armLT.matrix);
  armLT.matrix.scale(0.2, 1.1, 0.2);
  armLT.render();
  // left arm, bottom section 
  var armLB = new Cube();
  armLB.color =[0.37, 0.63, 0.5, 1];
  armLB.matrix.set(leftArmCoordMart);
  armLB.matrix.translate(0, 0.27, 0.0001);
  armLB.matrix.rotate( -90, 0, 0, 1);
  armLB.matrix.rotate(g_leftBottomAngle, 0, 0, 1);
  armLB.matrix.scale(0.2, 1.2, 0.2);
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
  pecNipL.color =  [0.66, 0.52, 0.37, 1.0];
  pecNipL.matrix.set(leftPecMatrix);
  pecNipL.matrix.translate(0.1, 0.05, -0.25);
  pecNipL.matrix.rotate(45, 0 ,0 ,1);
  pecNipL.matrix.scale(0.3, 0.3, 0.25);
  pecNipL.render();
  // right pec nip
  var pecNipR = new Cube();
  pecNipR.color = [0.66, 0.52, 0.37, 1.0];
  pecNipR.matrix.set(rightPecMatrix);
  pecNipR.matrix.translate(0.15, 0.05, -0.25);
  pecNipR.matrix.rotate(45, 0 ,0 ,1);
  pecNipR.matrix.scale(0.3, 0.3, 0.25);
  pecNipR.render();
   
  
}