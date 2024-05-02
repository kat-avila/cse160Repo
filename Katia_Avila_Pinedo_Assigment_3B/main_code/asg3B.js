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
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_XRotateMatrix * u_YRotateMatrix * u_ZRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;  // uniform
  uniform sampler2D u_Sampler0;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) { // color
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) { //uv
      gl_FragColor = vec4(v_UV, 1.0,1.0);

    } else if (u_whichTexture == 0){ //use texture 0
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else {
      gl_FragColor = vec4(1, .2, .2, 1);
    }
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
let u_Sampler0;
let u_whichTexture;
let u_ProjectionMatrix;
let u_ViewMatrix;


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
  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  // Get the storage location of u_Sampler
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return false;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return false;
  }

  //set an initial value for this matrix indentity
  var indentityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, indentityM.elements);
}

// Globals related to UI elments
let g_angleX = 25; // camera angle
let g_angleY = 0; // camera angle
let g_angleZ = 0; // camera angle
function addActionsForHTMLUI() {
  // Perspective Slider Events
  document.getElementById('angleXslide').addEventListener('mousemove', function () { g_angleX = this.value; renderAllShapes(); })
  document.getElementById('angleYslide').addEventListener('mousemove', function () { g_angleY = this.value; renderAllShapes(); })
  document.getElementById('angleZslide').addEventListener('mousemove', function () { g_angleZ = this.value; renderAllShapes(); })
}

function initTextures() {
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function () { sendTextureToGLSL(image); };
  // Tell the browser to load an image
  image.src = '../lib/floopytree1.jpg';

  return true;
}

function sendTextureToGLSL(image) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);

  // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}


function main() {
  // Set up canvas and gl variables
  setupWebGL();
  // Set up GLSL shade programs and connect glsl variables
  connectVariablesToGLSL();
  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();

  // initialize textures
  initTextures();

  document.onkeydown = keydown;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // renderAllShapes();

  requestAnimationFrame(tick);
}

function keydown(ev) {
  if (ev.keyCode == 39) { // right arrow
    g_eye[0] += 0.2;
  } else if (ev.keyCode == 37) { // left arrow
    g_eye[0] -= 0.2;
  }

   renderAllShapes();
   console.log(ev.keyCode);
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

}


// Draw every shape that is supposed to be in the canvas
var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];
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

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]); // eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(90, canvas.width / canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);


  // TORSO
  var torso = new Cube();
  torso.textureNum = 0;
  torso.color = [0.92, 0.8, 0.6, 1.0];
  torso.matrix.translate(-0.1, 0.0, 0);
  var torsoCoordMatrix = new Matrix4(torso.matrix);
  torso.matrix.scale(0.75, 0.36, .2);
  torso.render();

  //
  var block1 = new Cube();
  block1.matrix.set(torsoCoordMatrix);
  block1.textureNum = -1;
  block1.matrix.translate(0, 0.5, 0);
  block1.render();


}

