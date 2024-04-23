// ColoredPoint.js (c) 2012 matsuda
// modifed for asg1.html Katia Avila Pinedo 4-2024

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() { 
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_PointSize = u_Size;
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
let u_Size;
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
  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
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

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elments
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; // default color
let g_selectedSize = 5; // set with initial value
let g_selectedType = POINT; // default shape
let g_selectedSegment = 10; // default num of seg in circle
let g_globalAngle = 5; // camera angle

function addActionsForHTMLUI() {
  // Button Events (Shape Type)
  document.getElementById('clear').onclick = function () { g_shapesList = []; renderAllShapes(); };

  document.getElementById('pointButton').onclick = function () { g_selectedType = POINT };
  document.getElementById('triButton').onclick = function () { g_selectedType = TRIANGLE };
  document.getElementById('circleButton').onclick = function () { g_selectedType = CIRCLE };

  // Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100 })
  document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100 })
  document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100 })
  document.getElementById('alphaSlide').addEventListener('mouseup', function () { g_selectedColor[3] = this.value / 100 })

  // Size Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function () { g_globalAngle = this.value; renderAllShapes(); })
  document.getElementById('segmentSlide').addEventListener('mouseup', function () { g_selectedSegment = this.value })
}


function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shade programs and connect glsl variables
  connectVariablesToGLSL();
  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function (ev) { click(ev) };
  canvas.onmousemove = function (ev) { if (ev.buttons == 1) { click(ev) } };
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderAllShapes();
}

var g_shapesList = [];
function click(ev) {

  // Extract the event click and return it in WebGL coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);

  // Create and store the new shape
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position = [x, y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  point.segments = g_selectedSegment;

  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return ([x, y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Pass matrix to u_ModelMatrix attribute
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // render all user drawn shapes
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

  // main body    torso.color = [0.91, 0.8, 0.69, 1.0];
  // tan body    pecR.color = [0.83, 0.71, 0.59, 1.0];
  // dark skin    [0.66, 0.52, 0.37, 1.0]

  // TORSO
  var torso = new Cube();
  torso.color = [0.91, 0.8, 0.69, 1.0];
  torso.matrix.translate(-0.35, -0.35, 0.0);
  torso.matrix.scale(0.75, 0.65, .1);
  torso.render();

  // COLLARBONE cube
  var collar = new Cube();
  collar.color = [0.37, 0.63, 0.5, 1];
  collar.matrix.translate(-0.45, 0.3, 0.0);
  collar.matrix.scale(0.95, 0.15, .1);
  collar.render();

  // left arm, top section cube
  var armLT = new Cube();
  armLT.color = [0.91, 0.8, 0.69, 1.0];
  armLT.matrix.translate(-.7, -0.01, 0.0);
  armLT.matrix.rotate(45, 0 ,0 ,1);
  armLT.matrix.scale(0.4, 0.1, 0.1);
  armLT.render();

  // left pec
  var pecL = new Cube();
  pecL.color = [0.83, 0.71, 0.59, 1.0];
  pecL.matrix.translate(-.26, 0.2, -0.1);
  pecL.matrix.scale(0.25, 0.1, 0.04);
  pecL.render();
  // right pec
  var pecR = new Cube();
  pecR.color = [0.83, 0.71, 0.59, 1.0];
  pecR.matrix.translate(0.05, 0.2, -0.1);
  pecR.matrix.scale(0.25, 0.1, 0.04);
  pecR.render();
  // left pec nip
  var pecNipL = new Cube();
  pecNipL.color =  [0.66, 0.52, 0.37, 1.0];
  pecNipL.matrix.translate(-.14, 0.2, -0.12);
  pecNipL.matrix.rotate(45, 0 ,0 ,1);
  pecNipL.matrix.scale(0.05, 0.05, 0.025);
  pecNipL.render();
  // right pec nip
  var pecNipR = new Cube();
  pecNipR.color = [0.66, 0.52, 0.37, 1.0];
  pecNipR.matrix.translate(0.17, 0.2, -0.12);
  pecNipR.matrix.rotate(45, 0 ,0 ,1);
  pecNipR.matrix.scale(0.05, 0.05, 0.025);
  pecNipR.render();
   
  
}