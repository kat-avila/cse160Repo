
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

}