
function init() {

    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var clock = new THREE.Clock();

    var enableFog = false;
    if (enableFog){
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }


    // var box = getBox(1, 1, 1);
    var boxGrid = getBoxGrid(10, 1.5);
    var plane = getPlane(20);
    // var pointLight = getPointLight(1);
    // var spotLight = getSpotLight(1);
    var directionalLight = getDirectionalLight(1);
    var sphere = getSphere(0.05);
    var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    var ambientLight = new getAmbientLight(2);


    // box.position.y = box.geometry.parameters.height/2;
    plane.rotation.x = Math.PI/2 ;

    // pointLight.position.y = 2;
    // pointLight.intensity = 2;
    // spotLight.position.y = 2;
    // spotLight.intensity = 2;
    directionalLight.position.y = 2;
    directionalLight.intensity = 2;

    // gui.add(pointLight, 'intensity', 1, 10);
    // gui.add(pointLight.position, 'y', 1, 5);
    // gui.add(pointLight.position, 'x', -5, 5);
    // gui.add(pointLight.position, 'z', -5, 5);
    // gui.add(spotLight, 'intensity', 1, 10);
    // gui.add(spotLight.position, 'y', 1, 20);
    // gui.add(spotLight.position, 'x', -5, 20);
    // gui.add(spotLight.position, 'z', -5, 20);
    // gui.add(spotLight, 'penumbra', 0, 1);
    gui.add(directionalLight, 'intensity', 1, 10);
    gui.add(directionalLight.position, 'y', 1, 20);
    gui.add(directionalLight.position, 'x', -5, 20);
    gui.add(directionalLight.position, 'z', -20, 20);

    plane.name = 'plane-1';
    boxGrid.name= 'boxGrid';

    // plane.add(box);
    // scene.add(box);
    scene.add(plane);

    // pointLight.add(sphere);
    // scene.add(pointLight);
    // spotLight.add(sphere);
    // scene.add(spotLight);
    directionalLight.add(sphere);
    scene.add(directionalLight);
    scene.add(boxGrid);
    scene.add(helper);
    scene.add(ambientLight);

    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    var cameraZPosition = new THREE.Group();
    var cameraXRotation = new THREE.Group();
    var cameraYRotation = new THREE.Group();
    cameraZPosition.add(camera);
    cameraXRotation.add(cameraZPosition);
    cameraYRotation.add(cameraXRotation);
    // scene.add(cameraZPosition);
    scene.add(cameraYRotation);

    gui.add(cameraZPosition.position, 'z', 0 , 100);
    gui.add(cameraYRotation.rotation, 'y', -Math.PI , Math.PI);
    gui.add(cameraXRotation.rotation, 'x', -Math.PI , Math.PI);

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;

    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setClearColor('#ffffff')
    renderer.setClearColor('rgb(120, 120, 120)')
    // document.body.appendChild( renderer.domElement );
    document.getElementById('webgl').appendChild(renderer.domElement);

    // renderer.render( scene, camera );
    // // renderer.render(
    // //     scene,
    // //     camera
    // // );

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

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    // var material = new THREE.MeshBasicMaterial({
    //     color: 0xff0000,
    //     side: THREE.DoubleSide
    // });
    var material = new THREE.MeshPhongMaterial({
        color: 'rgb(120, 120, 120)',
        side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;

    return mesh;
}

function getSphere(size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({
        color: 'rgb(255, 255, 255)'
    });

    var mesh = new THREE.Mesh(
        geometry,
        material
    );

    return mesh;
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow = true;

    return light;
}

function getSpotLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;

    light.shadow.bias = 0.001

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

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

    var boxGrid = scene.getObjectByName('boxGrid');

    boxGrid.children.forEach(function (child, index) {
        var x = timeElapsed * 2 + index
        // child.scale.y = Math.abs(Math.sin(timeElapsed * 2 + index)) + 0.002;
        child.scale.y = Math.abs(noise.simplex2(x, x)) + 0.002;
        child.position.y = child.scale.y/2;
    });

    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls, clock);
    })
}


var scene = init();