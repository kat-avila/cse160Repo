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
    // console.log(canvas.width, canvas.height, rectOrigin[0], rectOrigin[1]);

    // Draw a blue rectangle
    // ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    // ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color
    // var rectOrigin = [120 + (150/2), 10 + (150/2)]; // offset + (1/2 * width or height)

    // instantiate vector v1 and v2
    let v1 = new Vector3();
    let v2 = new Vector3();

    // draw vector in 2D
    function drawVector(v, color) {
        // var ctx = canvas.getContext('2d');
        // set stroke color
        ctx.strokeStyle = color;
        //start a new path
        ctx.beginPath();
        var x = rectOrigin[0] + v[0];
        var y = rectOrigin[1] + (-1 * v[1]); //adjust for opposing direction in coordinate system vs canvas
        ctx.moveTo(rectOrigin[0], rectOrigin[1]); // start at origin of rectangle in canvas
        // draw vector 
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    //handle draw event
    function handleDrawEvent() {
        console.log("draw vectors");
        //clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //reset to black
        ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color

        //create vector 1, read values of text boxes
        let v1xCord = document.getElementById('v1xCord').value;
        let v1yCord = document.getElementById('v1yCord').value;
        //set coordinates
        v1[0] = v1xCord * 20; //x coordinate, scaled by 20
        v1[1] = v1yCord * 20; //y coordinate, scaled by 20
        v1[2] = 0; //z
        // call draw vector1
        drawVector(v1, "red");

        //create vector 2, read values of text boxes
        let v2xCord = document.getElementById('v2xCord').value;
        let v2yCord = document.getElementById('v2yCord').value;
        //set coordinates
        v2[0] = v2xCord * 20; //x coordinate, scaled by 20
        v2[1] = v2yCord * 20; //y coordinate, scaled by 20
        v2[2] = 0; //z
        // call draw vector2
        drawVector(v2, "blue");

        return false;
    }

    //handle operations event
    function handleDrawOperationEvent() {
        console.log("operation button");
        handleDrawEvent();
        // read value of operation selector
        let operation = document.getElementById('operators').value;
        let scalar = document.getElementById('scalar').value;

        // call vector function and draw results in green vectors
        if (operation == 'add') {
            // add v2 (other) to v1 (this)
            v1.add(v2);
        } else if (operation == 'subtract') {
            // subtract v2 from v1
            v1.sub(v2);
        } else { 
            // perform multiplication
            let v3 = v1.mul(scalar);
            let v4 = v2.mul(scalar);
            // console.log(v3);
            // console.log(v4);
            drawVector(v3, "green");
            drawVector(v4, "green");
        }

        return false;
    };


    // draw vectors when v1 and v2 coordinates are submittes
    drawButton.onclick = handleDrawEvent;
    // conduct operation when scalar submitted
    operationButton.onclick = handleDrawOperationEvent;

    
}


