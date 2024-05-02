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
  torso.matrix.scale(0.75, 0.36, .2);
  torso.render();


}