
class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.colorSplit = [1.0, 0.0, 0.0, 1.0];
        this.textureNum = -2; // default use color
    }

    render() {
        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);
        // console.log(this.textureNum, u_whichTexture);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3DUV([0.0, 0.0, 0.0, 1, 1, 0.0, 1, 0, 0.0], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 0, 0.0, 0, 1, 0.0, 1, 1, 0.0], [0, 0, 0, 1, 1, 1]);
        // back of cube
        drawTriangle3DUV([0.0, 0.0, -1, 1, 1, -1, 1, 0, -1], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 0, -1, 0, 1, -1, 1, 1, -1], [0, 0, 0, 1, 1, 1]);

        // right side of cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        drawTriangle3DUV([1, 0.0, 0.0, 1, 1, -1, 1, 0, -1], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([1, 0, 0.0, 1, 1, 0, 1, 1, -1], [0, 0, 0, 1, 1, 1]);
        // left side of cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1, -1, 0, 0, -1], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1, 0, 0, 1, -1], [0, 0, 0, 1, 1, 1]);

        // top side of cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        drawTriangle3DUV([0, 1, 0, 1, 1, -1, 1, 1, 0], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 1, 0, 0, 1, -1, 1, 1, -1], [0, 0, 0, 1, 1, 1]);
        // bottom side of cube
        gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 1, 0.0, -1, 1, 0.0, 0.0], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0, 0.0, 0.0, 0, 0.0, -1, 1, 0, -1], [0, 0, 0, 1, 1, 1]);

    }

    renderfast() {
        var rgba = this.color;

        // Pass the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        let allVerts = [
            0,
            0,
            0,
            1,
            1,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            0,
            -1,
            1,
            1,
            -1,
            1,
            0,
            -1,
            0,
            0,
            -1,
            0,
            1,
            -1,
            1,
            1,
            -1,
            1,
            0,
            0,
            1,
            1,
            -1,
            1,
            0,
            -1,
            1,
            0,
            0,
            1,
            1,
            0,
            1,
            1,
            -1,0,0,0,0,1,-1,0,0,-1,0,0,0,0,1,0,0,1,-1,0,1,0,1,1,-1,1,1,0,0,1,0,0,1,-1,1,1,-1,0,0,0,1,0,-1,1,0,0,0,0,0,0,0,-1,1,0,-1];
        let allUV = [
            0,
            0,
            1,
            1,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            0,
            1,
            1,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            1
        ];

        drawTriangle3DUV(allVerts, allUV);
    }
}