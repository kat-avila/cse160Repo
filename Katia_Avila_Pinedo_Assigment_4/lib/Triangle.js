class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];

  }

  render(vertices) {
    var rgba = this.color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw
    drawTriangle3D(vertices);
  }
}

var g_vertexBuffer = null;
function initTriangles3D() {
 // Create a buffer object
 g_vertexBuffer = gl.createBuffer();
 if (!g_vertexBuffer) {
   console.log('Failed to create the buffer object');
   return -1;
 }
 // Bind the buffer object to target
 gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

 // Assign the buffer object to a_Position variable, with 3 values
 gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

 // Enable the assignment to a_Position variable
 gl.enableVertexAttribArray(a_Position);

//  console.log("initTri");
}

var g_uvBuffer = null;
function initTrianglesUV() {
   // Create a buffer object
   var g_uvBuffer = gl.createBuffer();
   if (!g_uvBuffer) {
     console.log('Failed to create the buffer object');
     return -1;
   }
 // Bind the buffer object to target
 gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);

 // Assign the buffer object to a_Position variable, with 2 values
 gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

 // Enable the assignment to a_Position variable
 gl.enableVertexAttribArray(a_UV);
}

function drawTriangle3D(vertices) {
  var n = vertices.length / 3; // The number of vertices

  if (g_vertexBuffer == null) {
    initTriangles3D();
  }
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Draw triangles
  gl.drawArrays(gl.TRIANGLES, 0, n);

  return n;
}



function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length/3; // The number of vertices

  if (g_vertexBuffer == null) {
    initTriangles3D();
  }
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  //------------ UV buffer
   if (g_uvBuffer == null) {
    initTrianglesUV();
   }
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);


  // Draw triangles
  gl.drawArrays(gl.TRIANGLES, 0, n);


  return n;
}


