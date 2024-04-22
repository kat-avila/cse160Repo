import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
// import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';

main();

function main() {
    // SET UP CANVAS, RENDERER
    const canvas = document.querySelector('#c');
    canvas.width = "2000";
    canvas.height = "1000";
    // const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas,
        logarithmicDepthBuffer: true,
        alpha: true,
    });

    // PERSPECTIVE CAMERA
    const fov = 75; // field of view, 75 deg in vert
    const aspect = canvas.width / canvas.height; // 300x150 the canvas default
    const near = 0.1; //fustrum start
    const far = 200;  //fustrum end
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);

    //orbit controls
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    // CREATE SCENE
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

    // GUI COLOR
    const guiColor = new GUI();
    guiColor.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor');
    // gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor');
    guiColor.add(light, 'intensity', 0, 2, 0.01);
    // gui.add(light.target.position, 'x', -10, 10);
    // gui.add(light.target.position, 'z', -10, 10);
    // gui.add(light.target.position, 'y', 0, 10);

    // control traget
    makeXYZGUI(guiColor, light.position, 'position', updateLight);
    makeXYZGUI(guiColor, light.target.position, 'target', updateLight);
    function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
        folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
        folder.open();
    }

    // MAKE PLANE
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../lib/fallinginportal.png');
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    // const repeats = planeSize / 2;
    // texture.repeat.set(repeats, repeats);
    // make plane geometry, material, and mesh
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);

    // LOAD OBJ 3D MODEL
    const objLoader = new OBJLoader();
    objLoader.load('../lib/model/ufo 2.obj', (root) => {
        root.position.set(0, 10, 0);
        scene.add(root);
    });

    // CREATE RING 1
    var torusGeo1 = new THREE.TorusGeometry(13, 0.5, 25, 100)
    const materialTorus1 = new THREE.MeshPhongMaterial({
        color: "#ffff00",
        side: THREE.DoubleSide,
    });
    var torusMesh1 = new THREE.Mesh(torusGeo1, materialTorus1);
    scene.add(torusMesh1);
   
    // CREATE RING 2
    var torusGeo2 = new THREE.TorusGeometry(20, 0.5, 25, 100)
    const materialTorus2 = new THREE.MeshPhongMaterial({
        color: "#34ff14",
        side: THREE.DoubleSide,
    });
    var torusMesh2 = new THREE.Mesh(torusGeo2, materialTorus2);
    scene.add(torusMesh2);


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
    // Portal Cube
    const boxWidthPortal = 4;
    const boxHeightPortal = 8;
    const boxDepthPortal = 8;
    const geometryPortal = new THREE.BoxGeometry(boxWidthPortal, boxHeightPortal, boxDepthPortal);
    const materialPortal = new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/portal.jpg') });
    const cubePortal = new THREE.Mesh(geometryPortal, materialPortal);
    cubePortal.position.set(-15, 5, -10);
    scene.add(cubePortal);

    // creatre cube geometry
    const cubeSize = 4;
    const boxWidth = 4;
    const boxHeight = 4;
    const boxDepth = 4;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cubes = [
        makeEvilMorty(0, 0, 0), // evil morty cube
        makeDrunkRick(0, 0, 0), // drunk rick cube
        makeAcid(0, 0, 0),     //acid cube
        makeInstance(geometry, 0xaa8844, 18),
        makeEvilMorty(10, -20, 8), // evil morty cube
        makeAcid(0, 10, -20),     //acid cube
        makeInstance(geometry, 0xaa8844, 2),
    ];
    function makeEvilMorty(x ,y ,z) {
        const boxWidth = 5;
        const boxHeight = 5;
        const boxDepth = 5;
        const geometryEV = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const materials = [
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/evilMorty/evilMorty1.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/evilMorty/evilMorty2.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/evilMorty/evilMorty3.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/evilMorty/evilMorty4.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/evilMorty/evilMorty5.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/evilMorty/evilMorty6.jpg') }),

        ];
        const cube = new THREE.Mesh(geometryEV, materials);
        cube.position.set(0 + x, 25 + y, 0 + z);
        scene.add(cube);

        return cube;
    }

    function makeDrunkRick(x, y , z) {
        const boxWidth = 4;
        const boxHeight = 4;
        const boxDepth = 4;
        const geometryEV = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const materials = [
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/drunkRick/drunkRick1.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/drunkRick/drunkRick2.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/drunkRick/drunkRick3.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/drunkRick/drunkRick4.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/drunkRick/drunkRick5.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/drunkRick/drunkRick6.jpg') }),

        ];
        const cube = new THREE.Mesh(geometryEV, materials);
        cube.position.set(5 + x, 16 + y, -10 + z);
        scene.add(cube);

        return cube;
    }

    function makeAcid(x, y, z) {
        const boxWidth = 6;
        const boxHeight = 6;
        const boxDepth = 6;
        const geometryEV = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
        const materials = [
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/acid/acid1.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/acid/acid2.png') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/acid/acid3.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/acid/acid4.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/acid/acid5.jpg') }),
            new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/acid/acid6.jpg') }),
        ];
        const cube = new THREE.Mesh(geometryEV, materials);
        cube.position.set(-13 + x, 8 + y, 10 + z);
        scene.add(cube);

        return cube;
    }


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

