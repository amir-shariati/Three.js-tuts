
function init() {

    var scene = new THREE.Scene();
    var gui = new dat.GUI();

    var enableFog = false;
    if (enableFog){
        scene.fog = new THREE.FogExp2(0xffffff, 0.2);
    }


    var box = getBox(1, 1, 1);
    var plane = getPlane(20);
    var pointLight = getPointLight(1);
    var sphere = getSphere(0.05);

    box.position.y = box.geometry.parameters.height/2;
    plane.rotation.x = Math.PI/2 ;

    pointLight.position.y = 2;
    pointLight.intensity = 2;

    gui.add(pointLight, 'intensity', 1, 10);
    gui.add(pointLight.position, 'y', 1, 5);
    gui.add(pointLight.position, 'x', -5, 5);
    gui.add(pointLight.position, 'z', -5, 5);

    plane.name = 'plane-1';

    // plane.add(box);
    scene.add(box);
    scene.add(plane);

    pointLight.add(sphere);
    scene.add(pointLight);

    // var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    camera.position.x = 1 ;
    camera.position.y = 2 ;
    camera.position.z = 5 ;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
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

    update(renderer, scene, camera, controls);

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

    return mesh;
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

    return light;
}

function update(renderer, scene, camera, controls) {
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

    controls.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    })
}


var scene = init();