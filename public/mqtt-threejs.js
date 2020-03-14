// 3d ympäristön luonti javascriptillä

let three_view = document.getElementById('three_view');

let renderer = new THREE.WebGLRenderer();
let scene = new THREE.Scene();
let width = window.innerWidth;
let height = window.innerHeight;
let view_angle = 45;
let near = 0.1;
let far = 1000;

let camera = new THREE.PerspectiveCamera(view_angle, width/height, near, far);
// Kameran paikka robotista nähden
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(scene.position);

renderer.setSize(width, height);
three_view.appendChild(renderer.domElement);

// Luodaan testi kuutio
{
    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshLambertMaterial({
        color: 0xFF0000
    });
    let mesh = new THREE.Mesh(geometry, material);
    // Kiinnitetään kuutio maailmaan
    //scene.add(mesh);
}


// Laitetaan valot päälle 
let light = new THREE.DirectionalLight(0xAAAAAA, 1.5);
light.position.x = 10;
light.position.y = 10;
light.position.z = 10;
light.lookAt(new THREE.Vector3(0,0,0));
scene.add(light);
scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
scene.background = new THREE.Color(0xFFFFFF);
scene.fog = new THREE.Fog(0xFFFFFF, 3, 30);

// Luodaan lattia
{
    let geometry = new THREE.PlaneBufferGeometry(40, 40);
    let material = new THREE.MeshPhongMaterial({
        color: 0xAAAAAA,
        specular: 0x101010
    });
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

const stl_loader = new THREE.STLLoader();
const load_stl = (url) => {
    return new Promise((resolve)=>{
        stl_loader.load(url, resolve);
    });
};

let dark = new THREE.MeshLambertMaterial({
    color: 0x111111
});

let yellow = new THREE.MeshLambertMaterial({
    color: 0xFFFF00
});

let joints = [];

const load_geometries = async() => {
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/BASE.stl');
        joints.push(new THREE.Mesh(geometry, dark));
        joints[0].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[0]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J1-1.stl');
        let geometry2 = await load_stl('./FANUC_R2000iA165F-STL/J1-2.stl');
        geometry.merge(geometry2);
        joints.push(new THREE.Mesh(geometry, dark));
        joints[1].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[1]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J2.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[2].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[2]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J3.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[3].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[3]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J4.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[4].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[4]);
    }
    {
        let geometry = await load_stl('./FANUC_R2000iA165F-STL/J5.stl');
        joints.push(new THREE.Mesh(geometry, yellow));
        joints[5].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[5]);
    }
};
load_geometries();

const orbit_controls = new THREE.OrbitControls(camera, renderer.domElement);
orbit_controls.target = new THREE.Vector3(0,0,0);


const animate = ()=>{
    requestAnimationFrame(animate);
    orbit_controls.update();
    renderer.render(scene, camera);
};
animate();

const resize = ()=>{
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}
window.onresize = resize;

//Camera setup:
