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
    

    // Draw a black rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
    ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color
    var rectOrigin = [120 + (150/2), 10 + (150/2)];
    
    // instantiate vector v1
    let v1 = new Vector3();
    v1[0] = 2.25 * 0.20; //x coordinate, scaled by 20
    v1[1] = 2.25 * 0.20; //y coordinate, scaled by 20
    v1[2] = 0; //z
    console.log(v1);

    // draw vector in 2D
    function drawVector(v, color) {
        var ctx = canvas.getContext('2d');

        // set stroke color
        ctx.strokeStyle = color;
        //start a new path
        ctx.beginPath();
        var x = v1[0];
        var y = v1[1];

        ctx.moveTo(rectOrigin[0], rectOrigin[1]); // start at origin of rectangle in canvas
        ctx.lineTo(x , y ); // scaled by 20
        ctx.stroke();
    }

    drawVector(v1, "red");
}


