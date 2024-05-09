// modifed for asg2.html Katia Avila Pinedo 4-2024

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;  // uniform
  uniform sampler2D u_gndTexture;
  uniform sampler2D u_skyTexture;
  uniform sampler2D u_wallGrassTexture;
  uniform sampler2D u_wallTreeTexture;
  uniform sampler2D u_wallCharTexture;
  uniform sampler2D u_kingTexture;
  uniform sampler2D u_rickTexture;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) { // color
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) { //uv
      gl_FragColor = vec4(v_UV, 0,0.5);

    } else if (u_whichTexture == 0){ //use Ground Texture
      gl_FragColor = texture2D(u_gndTexture, v_UV);

    }  else if (u_whichTexture == 1){ //use Sky Texture
      gl_FragColor = texture2D(u_skyTexture, v_UV);

    } else if (u_whichTexture == 2){ //use Wall Grass Texture
      gl_FragColor = texture2D(u_wallGrassTexture, v_UV);

    }  else if (u_whichTexture == 3) { // wall tree
      gl_FragColor = texture2D(u_wallTreeTexture, v_UV);

    } else if (u_whichTexture == 4) { // wall char
      gl_FragColor = texture2D(u_wallCharTexture, v_UV);

    } else if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_kingTexture, v_UV);

    } else if (u_whichTexture == 6) {
      gl_FragColor = texture2D(u_rickTexture, v_UV);
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
let WALLGRASS = 2;
let WALLTREE = 3;
let WALLCHAR = 4;
let KING = 5;
let RICK =6;
let u_gndTexture;
let u_skyTexture;
let u_wallGrassTexture;
let u_wallTreeTexture;
let u_wallCharTexture;
let u_kingTexture;
let u_rickTexture;
let u_whichTexture;
// skin
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
// Globals related to UI elments
// tick time
let prevTime = Date.now(), frames = 0;
// var g_startTime = performance.now() / 1000.0;
// var g_seconds = (performance.now() / 1000.0) - g_startTime;
// camera
let camera = new Camera();
let startX, startY, endX, endY;
// mouse drag
let isMouseDown = false;




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

  // Get the storage location of u_gndTexture
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
  // Get the storage location of   u_wallGrassTexture
  u_wallGrassTexture = gl.getUniformLocation(gl.program, 'u_wallGrassTexture');
  if (!u_wallGrassTexture) {
    console.log('Failed to get the storage location of u_wallGrassTexture');
    return false;
  }
  // Get the storage location of   u_wallTreeTexture
  u_wallTreeTexture = gl.getUniformLocation(gl.program, 'u_wallTreeTexture');
  if (!u_wallTreeTexture) {
    console.log('Failed to get the storage location of u_wallTreeTexture');
    return false;
  }

  // Get the storage location of   u_wallCharTexture
  u_wallCharTexture = gl.getUniformLocation(gl.program, 'u_wallCharTexture');
  if (!u_wallCharTexture) {
    console.log('Failed to get the storage location of u_wallCharTexture');
    return false;
  }
  
  // Get the storage location of   u_kingTexture
  u_kingTexture = gl.getUniformLocation(gl.program, 'u_kingTexture');
  if (!u_kingTexture) {
    console.log('Failed to get the storage location of u_kingTexture');
    return false;
  }

    // Get the storage location of   u_rickTexture
    u_rickTexture = gl.getUniformLocation(gl.program, 'u_rickTexture');
    if (!u_rickTexture) {
      console.log('Failed to get the storage location of u_rickTexture');
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

  // Create the Wall Grass object
  var imageWallGrass = new Image();
  if (!imageWallGrass) {
    console.log('Failed to create the imagewallGrass object');
    return false;
  }
  // Tell the browser to load an imagewallGrass
  imageWallGrass.src = '../lib/textures/froppyGrass.png';
  // Register the event handler to be called on loading an imageSKY
  imageWallGrass.onload = function () { sendTextureToGLSL(imageWallGrass, WALLGRASS); };


  // Create the Wall Tree object
  var imageWallTree = new Image();
  if (!imageWallTree) {
    console.log('Failed to create the imagewallTree object');
    return false;
  }
  // Tell the browser to load an imagewallTree
  imageWallTree.src = '../lib/textures/froppyTrees.png';
  // Register the event handler to be called on loading an imageSKY
  imageWallTree.onload = function () { sendTextureToGLSL(imageWallTree, WALLTREE); };

  // Create the Wall Grass object
  var imageWallChar = new Image();
  if (!imageWallChar) {
    console.log('Failed to create the imageWallChar object');
    return false;
  }
  // Tell the browser to load an imageWallChar
  imageWallChar.src = '../lib/textures/froppyChar.png';
  // Register the event handler to be called on loading an imageSKY
  imageWallChar.onload = function () { sendTextureToGLSL(imageWallChar, WALLCHAR); };

    // Create the King object
    var imageKing = new Image();
    if (!imageKing) {
      console.log('Failed to create the imageKing object');
      return false;
    }
    // Tell the browser to load an imageKing
    imageKing.src = '../lib/textures/froppyKing.png';
    // Register the event handler to be called on loading an imageKing
    imageKing.onload = function () { sendTextureToGLSL(imageKing, KING); };
  
       // Create the Rick object
       var imageRick = new Image();
       if (!imageRick) {
         console.log('Failed to create the imageRick object');
         return false;
       }
       // Tell the browser to load an imageRick
       imageRick.src = '../lib/textures/acid2.png';
       // Register the event handler to be called on loading an imageRick
       imageRick.onload = function () { sendTextureToGLSL(imageRick, RICK); };
     
  return true;
}

function sendTextureToGLSL(image, txtCode) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis

  if (txtCode == GND) {
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
    // Enable texture unit1
    gl.activeTexture(gl.TEXTURE1);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_skyTexture, 1);

  } else if (txtCode == WALLGRASS) {
    // Enable texture unit2
    gl.activeTexture(gl.TEXTURE2);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_wallGrassTexture, 2);

  } else if (txtCode == WALLTREE) {
    // Enable texture unit3
    gl.activeTexture(gl.TEXTURE3);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_wallTreeTexture, 3);

  } else if (txtCode == WALLCHAR) {
    // Enable texture unit4
    gl.activeTexture(gl.TEXTURE4);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_wallCharTexture, 4);
  }  else if (txtCode == KING) {
    // Enable texture unit5
    gl.activeTexture(gl.TEXTURE5);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_kingTexture, 5);
  } else if (txtCode == RICK) {
    // Enable texture unit6
    gl.activeTexture(gl.TEXTURE6);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_rickTexture, 6);
  }

}

var startTimeVal = null;
var endTimeVal;
var charSelect = RICK; // default king, 1 rick

function addActionsForHTMLUI() {
  document.getElementById("changeChar").onclick = function () {
    if (charSelect == KING) { // at king swtich to rick
      charSelect = RICK;
      document.getElementById("charName").textContent = "You are playing as RICK SANCHEZ";
    } else if (charSelect == RICK) { // at rick switch to king
      charSelect = KING;
      document.getElementById("charName").textContent = "You are playing as KING TOMMY";
    }
    console.log(charSelect);
  };

  document.getElementById("endTime").onclick = function () {
    endTimeVal =  Date.now();
    if (startTimeVal) {
      document.getElementById("userTime").textContent = "Maze Run Time: " + (endTimeVal - startTimeVal)/1000;
    } else {
      document.getElementById("userTime").textContent = "UNABLE TO DETERMINE START TIME";

    }
  };
  document.getElementById("resetGame").onclick = function () {
    endTimeVal = 0
    startTimeVal = null;
    g_moveRotate = 0;
    g_moveSides = 0;
    g_moveUps = 0;
    camera.eye.elements.set([0, 0, 0]); // vec3
    camera.at.elements.set([0, 0, -1]);
    camera.up.elements.set([0, 1, 0]);
    document.getElementById("userTime").textContent = "TIMER RESET";
  };

  document.onkeydown = keydown;
  document.onmousedown = function (evt) {
    isMouseDown = true,
      evt = evt || window;
    startX = evt.pageX;
    startY = evt.pageY;
    // console.log("start", startX, startY);  
  };
  document.onmouseup = function () { isMouseDown = false; };
  document.onmousemove = function (evt) {
    if (isMouseDown) {
      evt = evt || window;
      endX = evt.pageX;
      endY = evt.pageY;
      if (endX > startX) { // pan left
        camera.panLeft();
        g_moveRotate = g_moveRotate + 8;
      } else if (endX < startX) { // pan right
        camera.panRight();
        g_moveRotate = g_moveRotate - 8;

      }
    }
  };
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

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

function timerBegin() {
  if (!startTimeVal) {
    startTimeVal =  Date.now();
    document.getElementById("userTime").textContent = "Running Timer.... ";
  }
}

let g_moveSides = 0;
let g_moveUps = 0;
let g_moveRotate = 0;
function keydown(ev) {
  // WSAQE
  if (ev.keyCode == 87) { // W moveForward
    timerBegin();
    camera.moveForward();
  } else if (ev.keyCode == 83) { // S move backwrds
    timerBegin();
    camera.moveBackwards();
  } else if (ev.keyCode == 65) { // A move left
    timerBegin();
    camera.moveLeft();
  } else if (ev.keyCode == 68) { // D move right
    timerBegin();
    camera.moveRight();
  } else if (ev.keyCode == 81) { // Q pan left
    camera.panLeft();
    g_moveRotate = g_moveRotate + 8;

  } else if (ev.keyCode == 69) { // E pan right
    camera.panRight();
    g_moveRotate = g_moveRotate - 8;

  }

  if (ev.keycode == 37) {
    g_moveSides = g_moveSides - 0.1;
    console.log(g_moveSides);
    requestAnimationFrame(tick);
  }

}

function tick() {
  const time = Date.now();
  frames++;
  if (time > prevTime + 1000) {
    let fps = Math.round((frames * 1000) / (time - prevTime));
    prevTime = time;
    frames = 0;
    // console.info('FPS: ', fps);
  }

  // Draw everthing
  renderAllShapes();

  // tell the browser to update again when it has time
  requestAnimationFrame(tick);
}

// Draw every shape that is supposed to be in the canvas
var initWorld = false;
var ground = new Cube();
var sky = new Cube();
var gndCoordMatrix = new Matrix4();

function initWorldFunc() {
  // GROUND
  ground.textureNum = COLOR;
  ground.color = [0.86, 0.58, 0.47, 1];
  ground.matrix.translate(0, -4, 25);
  gndCoordMatrix.set(ground.matrix);
  ground.matrix.scale(-100, 0, 100);
  ground.matrix.translate(-0.45, 0, -0);

  // SKY
  sky.textureNum = SKY;
  sky.matrix.scale(-125, 80, 125);
  sky.matrix.translate(-0.4, 0.25, 0.25);
}

var viewMat = new Matrix4();
var projMat = new Matrix4();
function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Pass the view matrix
  viewMat.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
  ); // eye, at, up
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  // Pass the projection matrix
  projMat.setPerspective(90, canvas.width / canvas.height, .1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  if (!initWorld) { // first time rendering world
    initWorldFunc();
    initWorld = true;
  }
  // GROUND
  ground.render();
  // SKY
  sky.render();

  // MAP
  createWorld();

  // TORSO
  var torso = new Cube();
  torso.textureNum = charSelect;
  torso.matrix.translate(camera.at.elements[0], camera.at.elements[1] , camera.at.elements[2]);
  torso.matrix.rotate(g_moveRotate, 0, 1, 0);
  torso.matrix.scale(0.4, 0.4, 0.4);
  torso.matrix.translate(0.2, -0.5, 0);
  torso.render();


}

var g_map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // left-most column
  [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 3, 2, 2, 2, 2, 0, 0, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 3, 3, 2, 3, 0, 0, 0, 0, 0, 3, 0, 2, 2, 2, 3, 3, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 1],

  [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 0, 2, 0, 0, 3, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 3, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 2, 2, 1],

  [1, 0, 0, 2, 0, 0, 2, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [1, 3, 3, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 0, 0, 1],
  [1, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 1, 1, 0, 0, 1],

  [1, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 3, 0, 0, 0, 1],
  [1, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 2, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 1],
  [3, 0, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 0, 2, 2, 2, 2, 0, 0, 2, 0, 1],
  [4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [4, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [3, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1,], // right-most column
];

var body = new Cube();
function createWorld() {
  for (x = 0; x < 32; x++) {
    for (y = 0; y < 32; y++) {
      for (let c = 1; c <= g_map[x][y]; c++) {
        if (g_map[x][y] == 4) {
          if (c==4) {
            body.textureNum = WALLCHAR;
          } else if (c ==1) {
            body.textureNum = WALLGRASS;
          } else {
            body.textureNum = COLOR;
            body.color = [0.96, 0.84, 0.2, 1];
          }
         
        } else if (g_map[x][y] == 3) {
          body.textureNum = WALLCHAR;
        } else if (c == 1) {
          body.textureNum = WALLGRASS;
        } else if (c == 2) {
          body.textureNum = WALLTREE;
        } 

        body.matrix.set(gndCoordMatrix);
        body.matrix.scale(3, 3, 3);
        body.matrix.translate(-1 + x, (c - 1) + 0.5, -15 + y);
        body.render();
      }
     
    }
  }
}



