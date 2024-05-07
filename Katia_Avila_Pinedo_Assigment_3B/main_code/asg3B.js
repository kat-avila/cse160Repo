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
  uniform sampler2D u_gndTexture;
  uniform sampler2D u_skyTexture;
  uniform sampler2D u_wallmushTexture;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) { // color
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) { //uv
      gl_FragColor = vec4(v_UV, 1.0,1.0);

    } else if (u_whichTexture == 0){ //use Ground Texture
      gl_FragColor = texture2D(u_gndTexture, v_UV);

    }  else if (u_whichTexture == 1){ //use Sky Texture
      gl_FragColor = texture2D(u_skyTexture, v_UV);

    } else if (u_whichTexture == 2){ //use Wall Forest Mushroom Texture
      gl_FragColor = texture2D(u_wallmushTexture, v_UV);

    } else {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  }`

// Define global variablesm, UI elements or shader variables
let canvas;
let gl;
let a_Position;
// textures
let COLOR = -2;
let UV = -1;
let GND = 0;
let SKY = 1;
let WALLMUSH = 2;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_XRotateMatrix;
let u_YRotateMatrix;
let u_ZRotateMatrix;
let u_gndTexture;
let u_skyTexture;
let u_whichTexture;
let u_ProjectionMatrix;
let u_ViewMatrix;
// Globals related to UI elments
let g_angleX = 25; // camera angle
let g_angleY = 0; // camera angle
let g_angleZ = 0; // camera angle
// tick time
// var g_startTime = performance.now() / 1000.0;
// var g_seconds = (performance.now() / 1000.0) - g_startTime;
// camera
let camera;
var g_eye = [0, 0, 3];
var g_at = [0, 0, -100];
var g_up = [0, 1, 0];


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
  u_gndTexture = gl.getUniformLocation(gl.program, 'u_gndTexture');
  if (!u_gndTexture) {
    console.log('Failed to get the storage location of u_gndTexture');
    return false;
  }
  // Get the storage location of u_skyTexture
  u_skyTexture = gl.getUniformLocation(gl.program, 'u_skyTexture');
  if (!u_skyTexture) {
    console.log('Failed to get the storage location of u_skyTexture');
    return false;
  }
 // Get the storage location of   u_wallmushTexture
 u_wallmushTexture = gl.getUniformLocation(gl.program, 'u_wallmushTexture');
 if (!u_wallmushTexture) {
   console.log('Failed to get the storage location of u_wallmushTexture');
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


function addActionsForHTMLUI() {
  // Perspective Slider Events
  document.getElementById('angleXslide').addEventListener('mousemove', function () { g_angleX = this.value; renderAllShapes(); })
  document.getElementById('angleYslide').addEventListener('mousemove', function () { g_angleY = this.value; renderAllShapes(); })
  document.getElementById('angleZslide').addEventListener('mousemove', function () { g_angleZ = this.value; renderAllShapes(); })
}

function initTextures() {
  // Create the GND object
  var imageGND = new Image();
  if (!imageGND) {
    console.log('Failed to create the imageGND object');
    return false;
  }
  // Tell the browser to load an imageGND
  imageGND.src = '../lib/textures/froppyGND.jpg';
  // Register the event handler to be called on loading an imageGND
  imageGND.onload = function () { sendTextureToGLSL(imageGND, GND); };

  // Create the SKY object
  var imageSKY = new Image();
  if (!imageSKY) {
    console.log('Failed to create the imageSKY object');
    return false;
  }
  // Tell the browser to load an imageSKY
  imageSKY.src = '../lib/textures/froppySky.png';
  // Register the event handler to be called on loading an imageSKY
  imageSKY.onload = function () { sendTextureToGLSL(imageSKY, SKY); };

   // Create the Wall forest Mushroom object
   var imageWALLMUSH = new Image();
   if (!imageWALLMUSH) {
     console.log('Failed to create the imageWALLMUSH object');
     return false;
   }
   // Tell the browser to load an imageWALLMUSH
   imageWALLMUSH.src = '../lib/textures/wallFlowers.png';
   // Register the event handler to be called on loading an imageSKY
   imageWALLMUSH.onload = function () { sendTextureToGLSL(imageWALLMUSH, WALLMUSH); };
 
  return true;
}

function sendTextureToGLSL(image, txtCode) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  // Set the texture unit 0 to the sampler
  if (txtCode == GND) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(gl.TEXTURE0);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_gndTexture, 0);

  } else if (txtCode == SKY) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit1
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_skyTexture, 1);

  } else if (txtCode == WALLMUSH) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit2
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_wallmushTexture, 2);
  }

}

function main() {
 fpsMeter();
  // instantaniate camera
  camera = new Camera();
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

  requestAnimationFrame(tick);
}

function keydown(ev) {
  // WSAQE
  if (ev.keyCode == 87) { // W moveForward
    // console.log("w pressed");
    camera.moveForward();
  } else if (ev.keyCode == 83) { // S move backwrds
    // console.log("s pressed");
    camera.moveBackwards();
  } else if (ev.keyCode == 65) { // A move left
    // console.log("a pressed");
    camera.moveLeft();
  } else if (ev.keyCode == 68) { // D move right
    // console.log("dq pressed");
    camera.moveRight();
  } else if (ev.keyCode == 81) { // Q pan left
    // console.log("q pressed");
    camera.panLeft();
  } else if (ev.keyCode == 69) { // E pan right
    // console.log("e pressed");
    camera.panRight();
  }

  // set x and y and z camera view to arrowkey press
  if (ev.keyCode == 39) { // right arrow
    // console.log("w pressed");
    g_angleX += 1;
  } else if (ev.keyCode == 37) { // left arrow
    // console.log("w pressed");
    g_angleX -= 1;
  } else if (ev.keyCode == 38) { // up arrow
    // console.log("w pressed");
    g_angleY -= 1;
  } else if (ev.keyCode == 40) { // down arrow
    // console.log("w pressed");
    g_angleY += 1;
  } 

  // console.log("eye", camera.eye.elements, "at", camera.at.elements, "up", camera.up.elements);

  renderAllShapes();
  // requestAnimationFrame(tick);
}
function  fpsMeter() {
  let prevTime = Date.now(),
      frames = 0;

  requestAnimationFrame(function loop() {
 
    requestAnimationFrame(loop);
  });
}

let prevTime = Date.now(),
frames = 0;
function tick() {
  const time = Date.now();
  frames++;
  if (time > prevTime + 1000) {
    let fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
    prevTime = time;
    frames = 0;
    console.info('FPS: ', fps);
  }

  // Save the current time
  // g_seconds = (performance.now() / 1000.0) - g_startTime;
  // Update animation angles
  // updateAnimationAngles();

  // Draw everthing
  renderAllShapes();

  // tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

// function updateAnimationAngles() {
// }

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1], // left-most column
  [1, 0, 0 ,1, 0, 1, 0, 0],
  [1, 0, 0 ,1, 0, 1, 0, 0],
  [1, 0, 0 ,1, 0, 1, 1, 1],
  [1, 0, 0 ,0, 0, 1, 0, 0],
  [1, 0, 0 ,1, 0, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1], // righ-most column
]

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

  // Pass the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
  ); // eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(90, canvas.width / canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);


  // GROUND
  var ground = new Cube();
  ground.textureNum = UV;
  // ground.color = [0.92, 0.8, 0.6, 1.0];
  ground.matrix.rotate(-20, 0, 1, 0);
  ground.matrix.translate(0, -0.8, 25);
  var gndCoordMatrix = new Matrix4(ground.matrix);
  ground.matrix.scale(50, 0, 50);
  ground.matrix.translate(-0.45, 0, -0 );
  ground.render();

  // SKY
  var sky = new Cube();
  sky.textureNum = SKY;
  sky.matrix.rotate(-20, 0, 1, 0);
  sky.matrix.scale(100, 100, 100);
  sky.matrix.translate(-0.45, -0.3, 0.5);
  sky.render();

  // MAP
  for (x=0; x<7; x++) {
    for (y=0; y<7; y++) {
      if (g_map[x][y] == 1) {
        var body = new Cube();
        body.textureNum = WALLMUSH;
        body.matrix.set(gndCoordMatrix);
        body.matrix.scale(5, 5, 5);

        body.matrix.translate(x-4, 0, y-8);
        // body.render();
        body.renderfast();

      }
    }
  }


}

