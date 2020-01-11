
import * as THREE from "./node_modules/three/build/three.module.js";
import Model from "./model.js";
import {OrbitControls} from "./node_modules/three/examples/jsm/controls/OrbitControls.js";


export default class ModelDemo {

    constructor (canvasId, modelName = canvasId, wireframeMode = false) {
        this.canvas = document.getElementById(canvasId);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);

        this.createCamera();
        this.createControls();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("white");

        // this.createPlane();
        this.createLights();

        // ToDo break this into two steps:
        //      - load obj and mtl
        //      - create scene object
        // ToDo once the above is done, create one regular object and another in wireframe mode
        new Model(this.scene, modelName, wireframeMode);

        // this.render();
        // window.addEventListener("resize", () => this.render());
        requestAnimationFrame(this.render.bind(this));
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    createCamera() {
        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(-0.3, 2.5, 0.5);
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    createControls() {
        const controls = new OrbitControls(this.camera, this.canvas);
        controls.target.set(0, 2, 0);
        controls.update();
    }

    createPlane() {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load("img/checker.png");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        mesh.position.x = 0;
        mesh.position.y = 2;
        mesh.position.z = 0;
        this.scene.add(mesh);
    }

    createLights() {
        const intensity = 1;

        const skyColor = 0xB97A20;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.scene.add(hemisphereLight);

        const color = 0xFFFFFF;
        const directionalLight = new THREE.DirectionalLight(color, intensity);
        directionalLight.position.set(0, 10, 0);
        directionalLight.target.position.set(-5, 0, 0);
        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);
    }
}
