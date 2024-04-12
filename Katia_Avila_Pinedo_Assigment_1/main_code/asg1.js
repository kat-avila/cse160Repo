// ColoredPoint.js (c) 2012 matsuda
// modifed for asg1.html Katia Avila Pinedo 4-2024

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() { 
    gl_Position = a_Position;
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

// Setup WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elments
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; // default color
let g_selectedSize = 5; // set with initial value
let g_selectedType = POINT; // default shape
let g_selectedSegment = 10; // default num of seg in circ
let g_selectedTriangleType = 0; //RIGHT
let g_selectedTriangleFace = 0; //RIGHT
let g_selectedTriangleImg = 0; // True img
let g_selectedShowDrawing = 0; // do not show drawing default


function addActionsForHTMLUI() {
  // Button Events (Shape Type)
  document.getElementById('clear').onclick = function () { g_shapesList = []; g_drawingList = []; renderAllShapes(); };
  document.getElementById('showDrawingButton').onclick = function () {
    console.log("Pushing to your list");
    let tri1 = new Triangle();
    tri1.position = [];
    tri1.color = [0.85, 0.7, 0.6];
    tri1.drawing = true;
    tri1.drawingCoord = [[-0.2, 0.9], [-2, 6], [1, 6]];
    g_drawingList.push(tri1);

    renderAllShapes();
  };

  document.getElementById('triFaceChoices').onclick = function () { g_selectedTriangleFace = document.getElementById('triFaceChoices').selectedIndex; };
  document.getElementById('triChoices').onclick = function () { g_selectedTriangleType = document.getElementById('triChoices').selectedIndex; };
  document.getElementById('triImgChoices').onclick = function () { g_selectedTriangleImg = document.getElementById('triImgChoices').selectedIndex; };

  document.getElementById('pointButton').onclick = function () { g_selectedType = POINT };
  document.getElementById('triButton').onclick = function () { g_selectedType = TRIANGLE };
  document.getElementById('circleButton').onclick = function () { g_selectedType = CIRCLE };

  // Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function () { g_selectedColor[0] = this.value / 100 })
  document.getElementById('greenSlide').addEventListener('mouseup', function () { g_selectedColor[1] = this.value / 100 })
  document.getElementById('blueSlide').addEventListener('mouseup', function () { g_selectedColor[2] = this.value / 100 })
  document.getElementById('alphaSlide').addEventListener('mouseup', function () { g_selectedColor[3] = this.value / 100 })

  // Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function () { g_selectedSize = this.value })
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
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
var g_drawingList = [];
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
  point.triType = g_selectedTriangleType;
  point.triFace = g_selectedTriangleFace;
  point.triFlip = g_selectedTriangleImg;

  g_shapesList.push(point);

  // Draw every shape that is supposed to be in the canvas
  renderAllShapes();
}

// Load the personal drawing 
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
  gl.clear(gl.COLOR_BUFFER_BIT);

  // render all drawing shapes
  var len = g_drawingList.length;
  for (var i = 0; i < len; i++) {
    g_drawingList[i].render();
  }

  // render all user drawn shapes
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }

}