
class Camera {
    constructor() {
        this.fov = 30.0; //float
        this.eye = new Vector3([0, 0, 0]); // vec3
        this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);
        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2])

        this.projectionMat = new Matrix4();
        this.projectionMat.setPerspective(this.fov, webgl.width / webgl.height, 0.1, 1000);

    }

    moveForward() {
        // vector f = at - eye
        let f = new Vector3();
        // console.log("AT ", this.at);
        f.set(this.at);
        f.sub(this.eye);
        // console.log("f ", f);

        f.normalize();
        // determine speed
        let speed = 0.5;
        f.mul(speed);

        // add forward vector to eye and center
        this.eye.add(f);
        this.at.add(f);

        // console.log("eye", this.eye.elements, "at", this.at.elements);
    }

    moveBackwards() {
        // vector b = eye - at
        let b = new Vector3();
        b.set(this.eye);
        b.sub(this.at);
        b.normalize();
        // determine speed
        let speed = 0.5;
        b.mul(speed);

        // add forward vector to eye and center
        this.eye.add(b);
        this.at.add(b);

        // console.log("eye", this.eye.elements, "at", this.at.elements);

    }

    moveLeft() {
        // vector f = at - eye
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        // vector s = up x f
        let s = new Vector3();
        s.set(Vector3.cross(this.up,f));
        s.normalize();
        // determine speed
        let speed = 0.5;
        s.mul(speed);
        // add forward vector to eye and center
        this.eye.add(s);
        this.at.add(s);
        // console.log("eye", this.eye.elements, "at", this.at.elements);

    }

    moveRight() {
        // vector f = at - eye
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);

        // vector s = f x up
        let s = new Vector3();
        s.set(Vector3.cross(f, this.up));
        s.normalize();
        // determine speed
        let speed = 0.5;
        s.mul(speed);
        // add forward vector to eye and center
        this.eye.add(s);
        this.at.add(s);
        // console.log("eye", this.eye.elements, "at", this.at.elements);

    }

    panLeft() {
        // vector f = at - eye
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize(); 

        // rotate vector f by alpha degrees around the up vec
        let alpha = 5;
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        // compute f_prime = rotationMatrix.multiplyVector3(f);
        let f_prime = rotationMatrix.multiplyVector3(f);
        let vecSum = new Vector3();
        vecSum.set(this.eye);
        vecSum.add(f_prime);
        this.at.set(vecSum);

    }

    panRight() {
        // vector f = at - eye
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
          f.normalize();  

        // rotate vector f by alpha degrees around the up vec
        let alpha = 5;
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        // compute f_prime = rotationMatrix.multiplyVector3(f);
        let f_prime = rotationMatrix.multiplyVector3(f);
        let vecSum = new Vector3();
        vecSum.set(this.eye);
        vecSum.add(f_prime);
        this.at.set(vecSum);

    }
}