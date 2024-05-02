class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.colorSplit = [1.0, 0.0, 0.0, 1.0];

    }

    render() {
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // draw triangle UV
        // drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1]);

        // Front of cube
        drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.25,0.0, 0.25,0.25,0.0], [1,0, 0,1, 1,1]);
        drawTriangle3D([0.25,0.25,0.0, 0.25,0.0,0.0, 0.0,0.0,0.0]);
        // back face side of cube
        drawTriangle3D([0.0,0.0,-0.25, 0.0,0.25,-0.25, 0.25,0.25, -0.25]);
        drawTriangle3D([0.25,0.25,-0.25, 0.25,0.0,-0.25, 0.0,0.0, -0.25]);
        

        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // right side of cube
        drawTriangle3D([0.25,0.0,0.0, 0.25,0.25,0.0, 0.25,0.0,-0.25]);  
        drawTriangle3D([0.25,0.25,0.0, 0.25,0.0,-0.25, 0.25, 0.25, -0.25]);  
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // left side of cube
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.25,0.0, 0.0,0.25,-0.25]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-0.25, 0.0,0.25,-0.25]);
        
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // top side of cube
        drawTriangle3D([0.0,0.25,0.0, 0.25,0.25,0.0, 0.0,0.25,-0.25]);  
        drawTriangle3D([0.25,0.25,0.0, 0.0,0.25,-0.25, 0.25, 0.25, -0.25]);  
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // bottom side of cube
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-0.25, 0.25,0.0,0.0]);
        drawTriangle3D([0.25,0.0,0.0, 0.25,0.0,-0.25, 0.0,0.0,-0.25]);
   
    }

    renderSplitRect2() {
        var rgba = this.color;
        var colorSplit = this.colorSplit;

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, colorSplit[0], colorSplit[1], colorSplit[2], colorSplit[3]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.25,0.0, 0.25,0.25,0.0]);
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        drawTriangle3D([0.25,0.25,0.0, 0.25,0.0,0.0, 0.0,0.0,0.0]);
        // back face side of cube
        drawTriangle3D([0.25,0.25,-0.25, 0.25,0.0,-0.25, 0.0,0.0, -0.25]);
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, colorSplit[0], colorSplit[1], colorSplit[2], colorSplit[3]);
        drawTriangle3D([0.0,0.0,-0.25, 0.0,0.25,-0.25, 0.25,0.25, -0.25]);
        

        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // right side of cube
        drawTriangle3D([0.25,0.0,0.0, 0.25,0.25,0.0, 0.25,0.0,-0.25]);  
        drawTriangle3D([0.25,0.25,0.0, 0.25,0.0,-0.25, 0.25, 0.25, -0.25]);  
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // left side of cube
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.25,0.0, 0.0,0.25,-0.25]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-0.25, 0.0,0.25,-0.25]);
        
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // top side of cube
        drawTriangle3D([0.0,0.25,0.0, 0.25,0.25,0.0, 0.0,0.25,-0.25]);  
        drawTriangle3D([0.25,0.25,0.0, 0.0,0.25,-0.25, 0.25, 0.25, -0.25]);  
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // bottom side of cube
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-0.25, 0.25,0.0,0.0]);
        drawTriangle3D([0.25,0.0,0.0, 0.25,0.0,-0.25, 0.0,0.0,-0.25]);
   
    }
    
    renderSplitRect3() {
        var rgba = this.color;
        var splitColor = this.colorSplit;

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Front of cube, base
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.25,0.0, 0.25/2,0.0,0.0]); // left
        drawTriangle3D([0.25,0.25,0.0, 0.25,0.0,0.0, 0.25/2,0.0,0.0]); // right
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, splitColor[0], splitColor[1], splitColor[2], splitColor[3]);
        drawTriangle3D([0.0,0.25,0.0, 0.25/2,0.0,0.0, 0.25,0.25,0.0]); // right

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // Back Face of cube
        drawTriangle3D([0.0,0.0,-0.25, 0.0,0.25,-0.25, 0.25/2,0.0,-0.25]); // left
        drawTriangle3D([0.25,0.25,-0.25, 0.25,0.0,-0.25, 0.25/2,0.0,-0.25]); // right
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, splitColor[0], splitColor[1], splitColor[2], splitColor[3]);
        drawTriangle3D([0.0,0.25,-0.25, 0.25/2,0.0,-0.25, 0.25,0.25,-0.25]); // right


        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // right side of cube
        drawTriangle3D([0.25,0.0,0.0, 0.25,0.25,0.0, 0.25,0.0,-0.25]);  
        drawTriangle3D([0.25,0.25,0.0, 0.25,0.0,-0.25, 0.25, 0.25, -0.25]);  
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        // left side of cube
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.25,0.0, 0.0,0.25,-0.25]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-0.25, 0.0,0.25,-0.25]);
        
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // top side of cube
        drawTriangle3D([0.0,0.25,0.0, 0.25,0.25,0.0, 0.0,0.25,-0.25]);  
        drawTriangle3D([0.25,0.25,0.0, 0.0,0.25,-0.25, 0.25, 0.25, -0.25]);  
        // faux lighting
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        // bottom side of cube
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-0.25, 0.25,0.0,0.0]);
        drawTriangle3D([0.25,0.0,0.0, 0.25,0.0,-0.25, 0.0,0.0,-0.25]);
   
    }
}