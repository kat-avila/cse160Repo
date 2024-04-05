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
    var rectOrigin = [canvas.width/2 , canvas.height/2 ]; // offset + (1/2 * width or height)
    console.log(canvas.width, canvas.height, rectOrigin[0], rectOrigin[1]);

    // Draw a blue rectangle
    // ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    // ctx.fillRect(120, 10, 150, 150);        // Fill a rectangle with the color
    // var rectOrigin = [120 + (150/2), 10 + (150/2)]; // offset + (1/2 * width or height)
    
    // instantiate vector v1
    let v1 = new Vector3();
    v1[0] = 2.25 * 20; //x coordinate, scaled by 20
    v1[1] = 2.25 * 20; //y coordinate, scaled by 20
    v1[2] = 0; //z
    // console.log(v1);

    //handle draw event
    drawButton.onclick = function handleDrawEvent() {
        console.log("hanlderEVENT triggger");

        //clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);   
        //reset to black
        ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color


        //read values of text boxes
        // let v1xCord = document.getElementById('v1xCord');
        // console.log("v1xcord", v1xCord);

        // call draw vector(v1, "red")
        // drawVector(v1, "red");
        return false;
    }

    // draw vector in 2D
    function drawVector(v, color) {
        // var ctx = canvas.getContext('2d');
        // set stroke color
        ctx.strokeStyle = color;
        //start a new path
        ctx.beginPath();
        var x = rectOrigin[0] + v1[0];
        var y = rectOrigin[1] + (-1 * v1[1]); //adjust for opposing direction in coordinate system vs canvas
        ctx.moveTo(rectOrigin[0], rectOrigin[1]); // start at origin of rectangle in canvas
        // draw vector 
        ctx.lineTo(x, y); 
        ctx.stroke();
    }

    drawVector(v1, "red");


}


