import * as THREE from "three";
main();

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    // create perspective camera
    const fov = 75; // field of view, 75 deg in vert
    const aspect = 2; // 300x150 the canvas default
    const near = 0.1; //fustrum start
    const far = 5;  //fustrum end
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // cube at origin, give space to observe
    camera.position.z = 2;

    const scene = new THREE.Scene();
    // creatre box geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    // create material
    const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue
    // create mesh = geomtery + material + position/orientation/scale
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); // add mesh to scene
    //render the scene
    function render(time) {
        time *= 0.001;  // convert time to seconds
    
        cube.rotation.x = time;
        cube.rotation.y = time;
    
        renderer.render(scene, camera);
    
        requestAnimationFrame(render); // request to animate
    }
    requestAnimationFrame(render);
    }

