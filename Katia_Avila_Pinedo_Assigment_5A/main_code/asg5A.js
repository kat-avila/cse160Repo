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
    // add lighting
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);

    // creatre box geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    // // create texture loader
    // const loader = new THREE.TextureLoader();
    // const texture = loader.load('../lib/evilMorty.jpg');
    // texture.colorSpace = THREE.SRGBColorSpace;

    function loadColorTexture(path) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }
    
    // add more cubes
    function makeInstance(geometry, color, x) {
        // const material = new THREE.MeshPhongMaterial({ color });
        // create material
        // const material = new THREE.MeshPhongMaterial({ 
        //     // color: 0x44aa88 
        //     map: texture,
        // }); 
        const materials = [
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/evilMorty.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/melting.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/negSunset.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/susRick.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/trippingFade.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/vintage.jpg') }),
        ];
    
        // const cube = new THREE.Mesh(geometry, material);
        const cube = new THREE.Mesh(geometry, materials);
        scene.add(cube);
    
        cube.position.x = x;
    
        return cube;
    }
        
    // create mesh = geomtery + material + position/orientation/scale
    // const cube = new THREE.Mesh(geometry, material);
    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];

    //render the scene
    function render(time) {
        time *= 0.001;  // convert time to seconds

        // cube.rotation.x = time;
        // cube.rotation.y = time;
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render); // request to animate
    }
    requestAnimationFrame(render);
}

