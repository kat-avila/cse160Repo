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

    // CREATE CYLINDER
    // pickle rick
    const geometryCyl1 = new THREE.CylinderGeometry(1.5, 4, 10, 32);
    const materialCyl1 = new THREE.MeshBasicMaterial({ map: loadColorTexture("../lib/pickleRick.jpg") });
    const cylinder1 = new THREE.Mesh(geometryCyl1, materialCyl1);
    cylinder1.position.set(-15, 5, 15);
    scene.add(cylinder1);
    // nimbus
    const geometryCyl2 = new THREE.CylinderGeometry(1.5, 4, 15, 32);
    const materialCyl2 = new THREE.MeshBasicMaterial({ map: loadColorTexture("../lib/nimbus.jpg") });
    const cylinder2 = new THREE.Mesh(geometryCyl2, materialCyl2);;
    cylinder2.position.set(12, 7.5, -15);
    scene.add(cylinder2);
    // bugs
    const geometryCyl3 = new THREE.CylinderGeometry(2, 2, 8, 32);
    const materialCyl3 = new THREE.MeshBasicMaterial({ map: loadColorTexture("../lib/bugs.jpg") });
    const cylinder3 = new THREE.Mesh(geometryCyl3, materialCyl3);;
    cylinder3.position.set(-6, 4, 6);
    scene.add(cylinder3);

    // CREATE SPHERE
    // me seeks
    const sphereRadius1 = 2;
    const sphereWidthDivisions1 = 32;
    const sphereHeightDivisions1 = 16;
    const sphereGeo1 = new THREE.SphereGeometry(sphereRadius1, sphereWidthDivisions1, sphereHeightDivisions1);
    const sphereMat1 = new THREE.MeshPhongMaterial({ map: loadColorTexture("../lib/meSeeks.jpg") });
    const sphere1 = new THREE.Mesh(sphereGeo1, sphereMat1);
    sphere1.position.set(15, sphereRadius1, 18);
    scene.add(sphere1);
    // mr poopy
    const sphereRadius2 = 4;
    const sphereWidthDivisions2 = 32;
    const sphereHeightDivisions2 = 16;
    const sphereGeo2 = new THREE.SphereGeometry(sphereRadius2, sphereWidthDivisions2, sphereHeightDivisions2);
    const sphereMat2 = new THREE.MeshPhongMaterial({ map: loadColorTexture("../lib/mrPoopy.jpg") });
    const sphere2 = new THREE.Mesh(sphereGeo2, sphereMat2);
    sphere2.position.set(0, sphereRadius2, -15);
    scene.add(sphere2);
    // morty face
    const sphereRadius3 = 8;
    const sphereWidthDivisions3 = 32;
    const sphereHeightDivisions3 = 16;
    const sphereGeo3 = new THREE.SphereGeometry(sphereRadius3, sphereWidthDivisions3, sphereHeightDivisions3);
    const sphereMat3 = new THREE.MeshPhongMaterial({ map: loadColorTexture("../lib/mortyFace.jpg") });
    const sphere3 = new THREE.Mesh(sphereGeo3, sphereMat3);
    sphere3.position.set(-5, sphereRadius3 + 10, -20);
    scene.add(sphere3);
     // rick face
     const sphereRadius4 = 8;
     const sphereWidthDivisions4 = 32;
     const sphereHeightDivisions4 = 16;
     const sphereGeo4 = new THREE.SphereGeometry(sphereRadius4, sphereWidthDivisions4, sphereHeightDivisions4);
     const sphereMat4 = new THREE.MeshPhongMaterial({ map: loadColorTexture("../lib/rickFace.jpg") });
     const sphere4 = new THREE.Mesh(sphereGeo4, sphereMat4);
     sphere4.position.set(15, 20, -20 + sphereRadius4);
     scene.add(sphere4);
     // scary terry
    const sphereRadius5 = 3;
    const sphereWidthDivisions5= 4;
    const sphereHeightDivisions5 = 2;
    const sphereGeo5 = new THREE.SphereGeometry(sphereRadius5, sphereWidthDivisions5, sphereHeightDivisions5);
    const sphereMat5 = new THREE.MeshPhongMaterial({ map: loadColorTexture("../lib/scaryterry.jpg") });
    const sphere5 = new THREE.Mesh(sphereGeo5, sphereMat5);
    sphere5.position.set(10 - sphereRadius5, sphereRadius5 + 5, 18);
    scene.add(sphere5);
     // scary terry
     const sphereRadius6 = 5;
     const sphereWidthDivisions6= 32;
     const sphereHeightDivisions6 = 2;
     const sphereGeo6 = new THREE.SphereGeometry(sphereRadius6, sphereWidthDivisions6, sphereHeightDivisions6);
     const sphereMat6 = new THREE.MeshPhongMaterial({ map: loadColorTexture("../lib/mrJelly.png") });
     const sphere6 = new THREE.Mesh(sphereGeo6, sphereMat6);
     sphere6.position.set(-5, sphereRadius6, 15);
     scene.add(sphere6);


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
    //portal cube 2
    const materialPortal2 = new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/portal2.jpg') });
    const cubePortal2 = new THREE.Mesh(geometryPortal, materialPortal2);
    cubePortal2.position.set(18, 5, 6);
    scene.add(cubePortal2);
    //family picture
    const boxWidthPortalFamily = 15;
    const boxHeightPortalFamily= 15;
    const boxDepthPortalFamily= 3;
    const geometryPortalFamily= new THREE.BoxGeometry(boxWidthPortalFamily, boxHeightPortalFamily, boxDepthPortalFamily);
    const materialFamily= new THREE.MeshBasicMaterial({ map: loadColorTexture('../lib/family.jpg') });
    const cubeFamily= new THREE.Mesh(geometryPortalFamily, materialFamily);
    cubeFamily.position.set(0, 0, 0);
    scene.add(cubeFamily);

    // creatre cube geometry
    const cubeSize = 4;
    const boxWidth = 4;
    const boxHeight = 4;
    const boxDepth = 4;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const cubes = [
        makeEvilMorty(0, 0, 0), // evil morty cube
        makeDrunkRick(0, 8, 0), // drunk rick cube
        makeAcid(0, 8, 0),     //acid cube
        makeInstance(geometry, 15, 15, -10),
        makeEvilMorty(10, -20, 8), // evil morty cube
        makeDrunkRick(0, 8, 18), // drunk rick cube
        makeAcid(0, 10, -20),     //acid cube
        makeInstance(geometry, 2, 15, 0),
    ];
    function makeEvilMorty(x, y, z) {
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

    function makeDrunkRick(x, y, z) {
        const boxWidth = 2;
        const boxHeight = 1;
        const boxDepth = 2;
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
        const boxHeight = 4;
        const boxDepth = 5;
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

    function makeInstance(geometry, x, y, z) {
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
        cube.position.set(cubeSize + x, (cubeSize / 2) + y, z);
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

