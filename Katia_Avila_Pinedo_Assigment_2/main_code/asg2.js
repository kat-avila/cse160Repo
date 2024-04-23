// Starter code from Assigment1 personal submission
// modifed for Assigment2 Katia Avila Pinedo 4-2024

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

function addActionsForHTMLUI() {
  // Button Events (Shape Type)
  document.getElementById('clear').onclick = function () { g_shapesList = []; g_drawingList = []; renderAllShapes(); };
  document.getElementById('showDrawingButton').onclick = function () { 
    if (g_drawingList.length == 0) { //if show triggered and list empty
      // head
      var tri1 = new Triangle();
      tri1.drawing = true;
      tri1.drawingCoord = [[-0.2, 0.99], [-0.2, 0.6], [0.2, 0.6]];
      tri1.color = [0.82, 0.7, 0.54, 1.0]; // tan
      var tri2 = new Triangle();
      tri2.drawing = true;
      tri2.drawingCoord = [[-0.2, 0.99], [0.2, 0.6], [0.2, 0.99]];
      tri2.color = [0.82, 0.7, 0.54, 1.0]; // tan

      // shoulders and neck
      var tri3 = new Triangle();
      tri3.drawing = true;
      tri3.drawingCoord = [[-0.8, 0.4], [-0.2, 0.4], [-0.4, 0.6]];
      tri3.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri4 = new Triangle();
      tri4.drawing = true;
      tri4.drawingCoord = [[-0.3, 0.3], [0.3, 0.3], [0, 0.6]];
      tri4.color = [0.99, 0.96, 0.75, 1.0]; // pale yellow
      var tri5 = new Triangle();
      tri5.drawing = true;
      tri5.drawingCoord = [[0.2, 0.4], [0.4, 0.6], [0.8, 0.4]];
      tri5.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue

      // wings
      var tri6 = new Triangle();
      tri6.drawing = true;
      tri6.drawingCoord = [[-0.8, 0.2], [-0.6, 0.2], [-0.6, 0.4]];
      tri6.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri7 = new Triangle();
      tri7.drawing = true;
      tri7.drawingCoord = [[-0.6, 0.4], [-0.6, 0.1], [-0.3, 0.4]];
      tri7.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri8 = new Triangle();
      tri8.drawing = true;
      tri8.drawingCoord = [[0.4, 0.4], [0.7, 0.4], [0.7, 0.1]];
      tri8.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri9 = new Triangle();
      tri9.drawing = true;
      tri9.drawingCoord = [[0.7, 0.4], [0.7, 0.2], [0.9, 0.2]];
      tri9.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri10 = new Triangle();
      tri10.drawing = true;
      tri10.drawingCoord = [[-0.8, 0.1], [-0.6, 0.1], [-0.6, 0.3]];
      tri10.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri11 = new Triangle();
      tri11.drawing = true;
      tri11.drawingCoord = [[-0.8, 0], [-0.6, 0], [-0.6, 0.2]];
      tri11.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri12 = new Triangle();
      tri12.drawing = true;
      tri12.drawingCoord = [[0.7, 0.3], [0.7, 0.1], [0.9, 0.1]];
      tri12.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue
      var tri13 = new Triangle();
      tri13.drawing = true;
      tri13.drawingCoord = [[0.7, 0], [0.7, 0.2], [0.9, 0]];
      tri13.color = [0.69, 0.79, 0.99, 1.0]; // angelic blue

      // torso
      var tri14 = new Triangle();
      tri14.drawing = true;
      tri14.drawingCoord = [[-0.3, 0.3], [0.3, 0.3], [0.3, -0.2]];
      tri14.color = [0.99, 0.96, 0.75, 1.0]; // pale yellow
      var tri15 = new Triangle();
      tri15.drawing = true;
      tri15.drawingCoord = [[-0.3, 0.3], [-0.3, -0.2], [0.3, -0.2]];
      tri15.color = [0.99, 0.96, 0.75, 1.0]; // pale yellow
      var tri16 = new Triangle();
      tri16.drawing = true;
      tri16.drawingCoord = [[-0.3, -0.2], [-0.3, -0.7], [0.3, -0.2]];
      tri16.color = [0.99, 0.96, 0.75, 1.0]; // pale yellow
      var tri17 = new Triangle();
      tri17.drawing = true;
      tri17.drawingCoord = [[-0.3, -0.7], [0.3, -0.7], [0.3, -0.2]];
      tri17.color = [0.99, 0.96, 0.75, 1.0]; // pale yellow

      // dress & frill
      var tri18 = new Triangle();
      tri18.drawing = true;
      tri18.drawingCoord = [[-0.7, -0.7], [-0.3, -0.7], [-0.3, -0.2]];
      tri18.color = [0.99, 0.96, 0.75, 1.0]; // pale yellow
      var tri19 = new Triangle();
      tri19.drawing = true;
      tri19.drawingCoord = [[0.3, -0.2], [0.3, -0.7], [0.7, -0.7]];
      tri19.color = [0.99, 0.96, 0.75, 1.0]; // pale yellow
      var tri20 = new Triangle();
      tri20.drawing = true;
      tri20.drawingCoord = [[-0.7, -0.7], [-0.5, -0.7], [-0.6, -0.9]];
      tri20.color = [0.99, 0.84, 0, 1.0]; // GOLD yellow
      var tri21 = new Triangle();
      tri21.drawing = true;
      tri21.drawingCoord = [[-0.5, -0.7], [-0.3, -0.7], [-0.4, -0.9]];
      tri21.color = [0.99, 0.84, 0, 1.0]; // GOLD yellow
      var tri22 = new Triangle();
      tri22.drawing = true;
      tri22.drawingCoord = [[-0.3, -0.7], [-0.1, -0.7], [-0.2, -0.9]];
      tri22.color = [0.99, 0.84, 0, 1.0]; // GOLD yellow
      var tri23 = new Triangle();
      tri23.drawing = true;
      tri23.drawingCoord = [[-0.1, -0.7], [0.1, -0.7], [0, -0.9]];
      tri23.color = [0.99, 0.84, 0, 1.0]; // GOLD yellow
      var tri24 = new Triangle();
      tri24.drawing = true;
      tri24.drawingCoord = [[0.1, -0.7], [0.3, -0.7], [0.2, -0.9]];
      tri24.color = [0.99, 0.84, 0, 1.0]; // GOLD yellow
      var tri25 = new Triangle();
      tri25.drawing = true;
      tri25.drawingCoord = [[0.3, -0.7], [0.5, -0.7], [0.4, -0.9]];
      tri25.color = [0.99, 0.84, 0, 1.0]; // GOLD yellow
      var tri26 = new Triangle();
      tri26.drawing = true;
      tri26.drawingCoord = [[0.5, -0.7], [0.7, -0.7], [0.6, -0.9]];
      tri26.color = [0.99, 0.84, 0, 1.0]; // GOLD yellow

      g_drawingList.push(tri1, tri2, tri3, tri4, tri5, tri6, tri7, tri8, tri9, tri10, tri11, tri12, tri13, tri14, tri15, tri16, tri17, tri18, tri19, tri20, tri21, tri22, tri23, tri24, tri25, tri26);
      renderAllShapes();
    } 
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

  // Render
  gl.clear(gl.COLOR_BUFFER_BIT);
  renderAllShapes();
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
  // render all drawing shapes
  var len = g_drawingList.length;
  for (var i = 0; i < len; i++) {
    g_drawingList[i].render();
  }

  // render all user drawn shapes
  // var len = g_shapesList.length;
  // for (var i = 0; i < len; i++) {
  //   g_shapesList[i].render();
  // }

  // test triangle
  // drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 1.0,0.0,0.0]);
  // Draw a cube
  var body = new Cube();
  body.color = [0.83, 0.71, 0.59, 1.0];
  body.render();
}