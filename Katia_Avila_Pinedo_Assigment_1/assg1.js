// Assg1.js Paint!
function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    // Get the rendering context for 2DCG
    var ctx = canvas.getContext('2d');
    // setup a black canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
    // Fill a rectangle with the color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   }