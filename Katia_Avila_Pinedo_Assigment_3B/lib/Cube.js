
class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.colorSplit = [1.0, 0.0, 0.0, 1.0];
        this.textureNum = -2; // default use color
        this.allVerts =
            [
                //FRONT
                -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
                -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
                //LEFT
                -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
                -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
                //RIGHT
                0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
                0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
                //TOP
                -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
                -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
                //BACK
                0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
                -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
                //BOTTOM
                -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
                -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5
            ];


        this.allUV =
            [
                // FRONT
                0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
                // LEFT
                0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
                // RIGHT
                0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
                // TOP
                1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0,
                // BACK
                0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0,
                // BOTTOM
                0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
            ];


    }

    render() {
        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


        drawTriangle3DUV(this.allVerts, this.allUV);

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