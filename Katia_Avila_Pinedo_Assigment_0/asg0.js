// asg0.js for asg0.html
function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    // Get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');
    // setup a black canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color
    var rectOrigin = [canvas.width / 2, canvas.height / 2]; // offset + (1/2 * width or height)

    // Draw a blue rectangle
    // ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    // ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color
    // var rectOrigin = [120 + (150/2), 10 + (150/2)]; // offset + (1/2 * width or height)

    // instantiate vector v1 and v2
    let v1 = new Vector3([0,0,0]);
    let v2 = new Vector3([0,0,0]);
    var scale = 20;

    // draw vector in 2D
    function drawVector(v, color) {
        // set stroke color
        ctx.strokeStyle = color;
        //start a new path
        ctx.beginPath();
        var x = (rectOrigin[0] + (v.elements[0] * scale)); // adjust for scale
        var y = rectOrigin[1] + (-1 * v.elements[1] * scale); //adjust for opposing direction in coordinate system vs canvas, adjust for scale
        ctx.moveTo(rectOrigin[0], rectOrigin[1]); // start at origin of rectangle in canvas
        // draw vector 
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    //handle draw event
    function handleDrawEvent() {
        //clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //reset to black
        ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color

        //create vector 1, read values of text boxes
        let v1xCord = document.getElementById('v1xCord').value;
        let v1yCord = document.getElementById('v1yCord').value;
        //set coordinates
        v1.elements[0] = v1xCord ; //x coordinate, scaled by 20
        v1.elements[1] = v1yCord ; //y coordinate, scaled by 20
        v1.elements[2] = 0; //z
        // call draw vector1
        drawVector(v1, "red");

        //create vector 2, read values of text boxes
        let v2xCord = document.getElementById('v2xCord').value;
        let v2yCord = document.getElementById('v2yCord').value;
        //set coordinates
        v2.elements[0] = v2xCord ; //x coordinate
        v2.elements[1] = v2yCord ; //y coordinate
        v2.elements[2] = 0; //z
        // call draw vector2
        drawVector(v2, "blue");

        return false;
    }

    // finds angle between two vectors using dot product
    function angleBetween(v1, v2) {
        let mag1 = (v1.magnitude() ); 
        let mag2 = (v2.magnitude() );

        let d = Vector3.dot(v1,v2);
        let cosAlpha = d / (mag1 * mag2);
        let angleRadians = Math.acos(cosAlpha); // angle in radians
        //convertion to degrees
        let angleDegrees = angleRadians * (180 / Math.PI);
        console.log("Angle: ", angleDegrees);
        return false;   
    }

    //finds area of triangle formed by two vectors
    function areaTriangle(v1, v2) {
        // A = mag(axb) / 2
        let crossProd = Vector3.cross(v1, v2);
        let magCross = crossProd.magnitude();
        let areaTri = magCross / 2;
        console.log("Area of the triangle: ", areaTri);
    }

    //handle operations event
    function handleDrawOperationEvent() {
        handleDrawEvent();
        // read value of operation selector
        let operation = document.getElementById('operators').value;
        let scalar = document.getElementById('scalar').value;

        // call vector function and draw results in green vectors
        if (operation == 'add') {
            // add v2 (other) to v1 (this)
            v1.add(v2);
            drawVector(v1, "green");
        } else if (operation == 'subtract') {
            // subtract v2 from v1
            v1.sub(v2);
            drawVector(v1, "green");
        } else if (operation == 'multiply') {
            // perform multiplication
            let v3 = v1.mul(scalar);
            let v4 = v2.mul(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
        } else if (operation == 'divide') {
            // perform division
            let v3 = v1.div(scalar);
            let v4 = v2.div(scalar);
            drawVector(v3, "green");
            drawVector(v4, "green");
        } else if (operation == 'magnitude') {
            console.log("Magnitude v1: ", v1.magnitude());
            console.log("Magnitude v2: ", v2.magnitude());
        } else if (operation == 'normalize') {
            let v3 = v1.normalize();
            let v4 = v2.normalize();
            drawVector(v3, "green");
            drawVector(v4, "green");
        } else if (operation == 'between') {
            angleBetween(v1,v2);
        } else if (operation == 'area') {
            areaTriangle(v1,v2);
        }

        return false;
    };

    // draw vectors when v1 and v2 coordinates are submittes
    drawButton.onclick = handleDrawEvent;
    // conduct operation when scalar submitted
    operationButton.onclick = handleDrawOperationEvent;

}


