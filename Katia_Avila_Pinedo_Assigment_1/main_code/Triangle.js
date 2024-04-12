class Triangle {
  constructor() {
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.triType = 0; // default right triangle
    this.triFace = 0; // default face right
    this.triFlip = 0; // default true img
    this.drawing = false; // default not drawing triangle
    this.drawingCoord = [[0, 0], [0, 0], [0, 0]]; // default triangle at origin
  }

  render() {
    if (this.drawing) {
      var rgba = this.color;
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      var ab = this.drawingCoord[0];
      var cd = this.drawingCoord[1];
      var ef = this.drawingCoord[2];
      drawTriangle([ab[0], ab[1], cd[0], cd[1], ef[0], ef[1]]);
      // console.log("THIS triangle is drawing", this.drawingCoord);
    } else {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;

      // Pass the color of a point to u_FragColor variable
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the color of a point to u_Size variable
      gl.uniform1f(u_Size, size);

      // Draw
      // flip image on selection
      if (this.triFlip == 0) {
        var d = this.size / 200.0; // delta
      } else if (this.triFlip == 1) {
        var d = - (this.size / 200.0); // delta
      }
      // flip shape face direction on selection
      if (this.triType == 0) { // RIGHT
        if (this.triFace == 0) {
          drawTriangle([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
        } else if (this.triFace == 1) {
          drawTriangle([xy[0], xy[1], xy[0] - d, xy[1], xy[0], xy[1] + d]);
        }
      } else if (this.triType == 1) { // SCALENE
        if (this.triFace == 0) {
          drawTriangle([xy[0] - (2 * d / 3), xy[1], xy[0] + (2 * d), xy[1], xy[0], xy[1] + (3 * d / 5)]);
        } else if (this.triFace == 1) {
          drawTriangle([xy[0] - (2 * d / 3), xy[1], xy[0] - (2 * d), xy[1], xy[0], xy[1] + (3 * d / 5)]);
        }
      } else { // Equilateral
        drawTriangle([xy[0] - d, xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
      }
    }
  }
}

function drawTriangle(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Draw triangles
  gl.drawArrays(gl.TRIANGLES, 0, n);

  return n;
}
