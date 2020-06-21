
var GEO_TYPES = [
    'box',
    'cone',
    'cylinder',
    'octahedron',
    'sphere',
    'tetrahedron',
    'torus',
    'torusKnot'
];


function init() {

    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var clock = new THREE.Clock();

    // var enableFog = false;
    // if (enableFog){
    //     scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    // }

    // initialize objects
    var objMaterial = getMaterial('basic', 'rgb(255, 255, 255)');

    var geoTypes = GEO_TYPES;

    geoTypes.forEach(function(type) {
        var geo = getGeometry(type, 5, objMaterial);
        scene.add(geo);
    });


    // var planeMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
    // var plane = getPlane(planeMaterial,300);
    //
    //
    // var sphereMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
    // var sphere = getSphere(sphereMaterial, 1, 24);

    var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
    var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');
    var lightBottom = getPointLight(0.33, 'rgb(255, 220, 150)');


    // manipulae objects
    // plane.rotation.x = Math.PI/2 ;
    // sphere.position.y = sphere.geometry.parameters.radius;

    lightLeft.position.x = -5;
    lightLeft.position.y = 2 ;
    lightLeft.position.z = -4;

    lightRight.position.x = 5;
    lightRight.position.y = 2;
    lightRight.position.z = -4;

    lightBottom.position.x = 0;
    lightBottom.position.y = 10;
    lightBottom.position.z = 0;

    //manipulate material
    // Load the cube map
    var path = '../../assets/cubemap/';
    var format = '.jpg';
    var fileNames = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    // var urls = [
    //     path + 'px' + format, path + 'nx' + format,
    //     path + 'py' + format, path + 'ny' + format,
    //     path + 'pz' + format, path + 'nz' + format
    // ];
    // var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    var reflectionCube = new THREE.CubeTextureLoader().load(fileNames.map(function(fileName) {
        return path + fileName + format;
    }));

    // reflectionCube.format = THREE.RGBFormat;

    scene.background = reflectionCube;

    var loader = new THREE.TextureLoader();
    // planeMaterial.map = loader.load('../../assets/textures/concrete.JPG');
    // planeMaterial.bumpMap = loader.load('../../assets/textures/concrete.JPG');
    // planeMaterial.roughnessMap = loader.load('../../assets/textures/concrete.JPG');
    // // planeMaterial.map = loader.load('../../assets/textures/checkerboard.jpg');
    // // planeMaterial.bumpMap = loader.load('../../assets/textures/checkerboard.jpg');
    // // planeMaterial.roughnessMap = loader.load('../../assets/textures/checkerboard.jpg');
    // planeMaterial.bumpScale = 0.01;
    // planeMaterial.metalness = 0.1;
    // planeMaterial.roughness = 0.7;
    // planeMaterial.envMap = reflectionCube;
    // sphereMaterial.roughnessMap = loader.load('../../assets/textures/fingerprints.jpg');
    // sphereMaterial.envMap = reflectionCube;


    // var maps = ['map', 'bumpMap', 'roughnessMap'];
    // maps.forEach(function (mapName) {
    //     var texture = planeMaterial[mapName];
    //     texture.wrapS = THREE.RepeatWrapping;
    //     texture.wrapT = THREE.RepeatWrapping;
    //     texture.repeat.set(15, 15);
    // });
    // objMaterial.roughnessMap = loader.load('/assets/textures/scratch.jpg');
    // objMaterial.bumpMap = loader.load('/assets/textures/scratch.jpg');
    // objMaterial.bumpScale = 0.01;
    // objMaterial.envMap = reflectionCube;
    //
    // objMaterial.roughness = 0.5;
    // objMaterial.metalness = 0.7;
    //
    // var maps = ['bumpMap', 'roughnessMap'];
    // maps.forEach(function(map) {
    //     var texture = objMaterial[map];
    //     texture.wrapS = THREE.RepeatWrapping;
    //     texture.wrapT = THREE.RepeatWrapping;
    //     texture.repeat.set(1, 1);
    // });

    // plane.name = 'plane-1';

    // dat.gui
    var folder1 = gui.addFolder('light_1');
    folder1.add(lightLeft, 'intensity', 0, 10);
    folder1.add(lightLeft.position, 'x', -5, 15);
    folder1.add(lightLeft.position, 'y', -5, 15);
    folder1.add(lightLeft.position, 'z', -5, 15);

    var folder2 = gui.addFolder('light_2');
    folder2.add(lightRight, 'intensity', 0, 10);
    folder2.add(lightRight.position, 'x', -5, 15);
    folder2.add(lightRight.position, 'y', -5, 15);
    folder2.add(lightRight.position, 'z', -5, 15);

    // var folder3 = gui.addFolder('materials');
    // // folder3.add(sphereMaterial, 'shininess', 0, 1000);
    // // folder3.add(planeMaterial, 'shininess', 0, 1000);
    // folder3.add(sphereMaterial, 'roughness', 0, 1);
    // folder3.add(planeMaterial, 'roughness', 0, 1);
    // folder3.add(sphereMaterial, 'metalness', 0, 1);
    // folder3.add(planeMaterial, 'metalness', 0, 1);
    // folder3.open();

    // add objects to the scene
    // scene.add(sphere);
    // scene.add(plane);
    scene.add(lightLeft);
    scene.add(lightRight);
    scene.add(lightBottom);


    // camera
    var cameraGroup = new THREE.Group();
    var camera = new THREE.PerspectiveCamera(
        45, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        1000 // far clipping plane
    );
    camera.position.z = 20;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    cameraGroup.add(camera);
    cameraGroup.name = 'sceneCameraGroup';
    scene.add(cameraGroup);

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    renderer.setSize( window.innerWidth, window.innerHeight );

    // renderer.setClearColor('rgb(120, 120, 120)');
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // document.body.appendChild( renderer.domElement );
    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls, clock);

    return scene;

}

function getBox(width, height, depth) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    // var material = new THREE.MeshBasicMaterial({
    //     color: 0x00ff00
    // });
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)'
    });

    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true;

    return mesh;
}

function getBoxGrid(amount, separationMultiplier) {
    var group = new THREE.Group();

    for (var i=0; i < amount; i++){
        var obj = getBox(1,1,1);
        obj.position.x = i * separationMultiplier;
        obj.position.y = obj.geometry.parameters.height/2;
        group.add(obj);
        for (var j=0; j < amount; j++){
            var obj = getBox(1,1,1);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height/2;
            obj.position.z = j * separationMultiplier;
            group.add(obj);
        }
    }

    group.position.x = -(separationMultiplier * (amount-1))/2;
    group.position.z = -(separationMultiplier * (amount-1))/2;

    return group;
}

function getPlane(material, size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;

    var obj = new THREE.Mesh(
        geometry,
        material
    );
    obj.receiveShadow = true;

    return obj;
}

function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);

    var obj = new THREE.Mesh(
        geometry,
        material
    );
    obj.castShadow = true;

    return obj;
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;

    return light;
}

function getSpotLight(intensity, color) {
    color = color === undefined ? 'rgb(255, 255, 255)' : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;


    //Set up shadow properties for the light
    light.shadow.mapSize.width = 2048; //defualt: 512
    light.shadow.mapSize.height = 2048; //defualt: 512
    light.shadow.bias = 0.001;

    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;

    light.shadow.camera.left = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;
    light.shadow.camera.bottom = -10;

    return light;
}

function getAmbientLight(intensity) {
    var light = new THREE.AmbientLight('rgb(10, 30, 50)', intensity);


    return light;
}

function getMaterial(type, color) {
    var selectMaterial;
    var materialOptions = {
        color: color === undefined ? 'rqb(255, 255, 255)' : color,
        wireframe: true
    };
    switch (type) {
        case 'basic':
            selectMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
        case 'lambert':
            selectMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;
        case 'phong':
            selectMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;
        case 'standard':
            selectMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
        default:
            selectMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
    }
    return selectMaterial;

}

function getGeometry(type, size, material) {
    var geometry;
    var segmentMultiplier = 0.25;

    switch (type) {
        case 'box':
            geometry = new THREE.BoxGeometry(size, size, size);
            break;
        case 'cone':
            geometry = new THREE.ConeGeometry(size, size, 256*segmentMultiplier);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(size, size, size, 32*segmentMultiplier);
            break;
        case 'octahedron':
            geometry = new THREE.OctahedronGeometry(size);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(size, 32*segmentMultiplier, 32*segmentMultiplier);
            break;
        case 'tetrahedron':
            geometry = new THREE.TetrahedronGeometry(size);
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(size/2, size/4, 16*segmentMultiplier, 100*segmentMultiplier);
            break;
        case 'torusKnot':
            geometry = new THREE.TorusKnotGeometry(size/2, size/6, 256*segmentMultiplier, 100*segmentMultiplier);
            break;
        default:
            break;
    }

    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    obj.name = type;

    return obj;
}

function update(renderer, scene, camera, controls, clock) {
    renderer.render( scene, camera );

    // var plane = scene.getObjectByName('plane-1');
    // plane.rotation.z += 0.0005;
    //
    // scene.traverse(function (child) {
    //     child.scale.x += 0.001;
    //
    //     console.log('scale is : ' + child.scale.x);
    //     if (child.scale.x >= 1.3){
    //         child.scale.x = 1;
    //     }
    // })

    // rotate camera around the origin
    var sceneCameraGroup = scene.getObjectByName('sceneCameraGroup');
    if (sceneCameraGroup) {
        sceneCameraGroup.rotation.y += 0.003;
    }

    // switch between objects
    var geoTypes = GEO_TYPES;

    var currentIndex = Math.floor((clock.getElapsedTime() / 4) % geoTypes.length);
    geoTypes.forEach(function(geo, index) {
        var currentObj = scene.getObjectByName(geo);
        if (index === currentIndex) {
            currentObj.visible = true;
        } else {
            currentObj.visible = false;
        }
    })

    // var timeElapsed = clock.getElapsedTime();

    // var boxGrid = scene.getObjectByName('boxGrid');
    //
    // boxGrid.children.forEach(function (child, index) {
    //     var x = timeElapsed * 2 + index
    //     // child.scale.y = Math.abs(Math.sin(timeElapsed * 2 + index)) + 0.002;
    //     child.scale.y = Math.abs(noise.simplex2(x, x)) + 0.002;
    //     child.position.y = child.scale.y/2;
    // });

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls, clock);
    })
}


var scene = init();