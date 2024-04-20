import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

main();

function main() {
    class ColorGUIHelper {
        constructor(object, prop) {
            this.object = object;
            this.prop = prop;
        }
        get value() {
            return `#${this.object[this.prop].getHexString()}`;
        }
        set value(hexString) {
            this.object[this.prop].set(hexString);
        }
    }

    const canvas = document.querySelector('#c');
    canvas.width = "1000";
    canvas.height = "800";

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    // create perspective camera
    const fov = 75; // field of view, 75 deg in vert
    const aspect = 2; // 300x150 the canvas default
    const near = 0.1; //fustrum start
    const far = 100;  //fustrum end
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // cube at origin, give space to observe
    // camera.position.z = 2;
    camera.position.set(0, 10, 20);

    //orbit controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // create scene
    const scene = new THREE.Scene();
    // add lighting
    const color = 0xFFFFFF;
    // const skyColor = 0xB1E1FF;  // light blue
    // const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    // const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);


    // light controls
    // HELPER FOR TARGET LIGHT
    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);
    function updateLight() {
        light.target.updateMatrixWorld();
        helper.update();
    }
    updateLight();

    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
    // gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
    gui.add(light, 'intensity', 0, 2, 0.01);
    // gui.add(light.target.position, 'x', -10, 10);
    // gui.add(light.target.position, 'z', -10, 10);
    // gui.add(light.target.position, 'y', 0, 10);

    // control traget
    makeXYZGUI(gui, light.position, 'position', updateLight);
    makeXYZGUI(gui, light.target.position, 'target', updateLight);
    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        folder.open();
    }


    //make plane
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../lib/portal.jpg');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);
    // make plane geometry, material, and mesh
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);

  

    // CREATE SPHERE
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(-sphereRadius + 8, sphereRadius + 2, 0);
    scene.add(sphere);

    // CREATE CUBES
    // creatre cube geometry
    const cubeSize = 4;
    const boxWidth = 4;
    const boxHeight = 4;
    const boxDepth = 4;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = [
        // makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        // makeInstance(geometry, 0xaa8844, 2),
    ];

    function makeInstance(geometry, color, x) {
        // BoxGeometry can use 6 materials one for each face. ConeGeometry can use 2 materials, one for the bottom and one for the cone. CylinderGeometry can use 3 materials, bottom, top, and side. 
        // CUBE MESH
        // const cube = new THREE.Mesh(geometry, material);
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
        cube.position.set(cubeSize + 1, (cubeSize / 2) + 2, 0);
        scene.add(cube);
        cube.position.x = x;

        return cube;
    }

    function loadColorTexture(path) {
        // create texture loader
        const loader = new THREE.TextureLoader();
        const texture = loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.NearestFilter;
        return texture;
    }

    //render the animated scene
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

