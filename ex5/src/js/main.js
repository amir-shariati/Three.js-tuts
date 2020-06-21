
function init() {

    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var clock = new THREE.Clock();

    // var enableFog = false;
    // if (enableFog){
    //     scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    // }
    var planeMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
    var plane = getPlane(planeMaterial,30);


    var sphereMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
    var sphere = getSphere(sphereMaterial, 1, 24);

    var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
    var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');


    // manipulae objects
    plane.rotation.x = Math.PI/2 ;
    sphere.position.y = sphere.geometry.parameters.radius;

    lightLeft.position.x = -5;
    lightLeft.position.y = 2 ;
    lightLeft.position.z = -4;

    lightRight.position.x = 5;
    lightRight.position.y = 2;
    lightRight.position.z = -4;

    //manipulate material
    var loader = new THREE.TextureLoader();
    planeMaterial.map = loader.load('../../assets/textures/concrete.JPG');
    planeMaterial.bumpMap = loader.load('../../assets/textures/concrete.JPG');
    planeMaterial.roughnessMap = loader.load('../../assets/textures/concrete.JPG');
    // planeMaterial.map = loader.load('../../assets/textures/checkerboard.jpg');
    // planeMaterial.bumpMap = loader.load('../../assets/textures/checkerboard.jpg');
    // planeMaterial.roughnessMap = loader.load('../../assets/textures/checkerboard.jpg');
    planeMaterial.bumpScale = 0.01;
    planeMaterial.metalness = 0.1;
    planeMaterial.roughness = 0.7;
    sphereMaterial.roughnessMap = loader.load('../../assets/textures/fingerprints.jpg');

    var maps = ['map', 'bumpMap', 'roughnessMap'];
    maps.forEach(function (mapName) {
        var texture = planeMaterial[mapName];
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1.5, 1.5);
    });

    plane.name = 'plane-1';

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

    var folder3 = gui.addFolder('materials');
    // folder3.add(sphereMaterial, 'shininess', 0, 1000);
    // folder3.add(planeMaterial, 'shininess', 0, 1000);
    folder3.add(sphereMaterial, 'roughness', 0, 1);
    folder3.add(planeMaterial, 'roughness', 0, 1);
    folder3.add(sphereMaterial, 'metalness', 0, 1);
    folder3.add(planeMaterial, 'metalness', 0, 1);
    folder3.open();

    // add objects to the scene
    scene.add(sphere);
    scene.add(plane);
    scene.add(lightLeft);
    scene.add(lightRight);

    // camera
    var camera = new THREE.PerspectiveCamera(
        45, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        1000 // far clipping plane
    );
    camera.position.z = 7;
    camera.position.x = -2;
    camera.position.y = 7;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setClearColor('rgb(120, 120, 120)');
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

    var timeElapsed = clock.getElapsedTime();

    // var boxGrid = scene.getObjectByName('boxGrid');
    //
    // boxGrid.children.forEach(function (child, index) {
    //     var x = timeElapsed * 2 + index
    //     // child.scale.y = Math.abs(Math.sin(timeElapsed * 2 + index)) + 0.002;
    //     child.scale.y = Math.abs(noise.simplex2(x, x)) + 0.002;
    //     child.position.y = child.scale.y/2;
    // });

    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls, clock);
    })
}


var scene = init();