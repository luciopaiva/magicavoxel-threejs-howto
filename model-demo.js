
import * as THREE from "./node_modules/three/build/three.module.js";
import Model from "./model.js";
import {OrbitControls} from "./node_modules/three/examples/jsm/controls/OrbitControls.js";


export default class ModelDemo {

    constructor (canvasId, modelName = canvasId, wireframeMode = false) {
        this.modelName = modelName;
        this.wireframeMode = wireframeMode;

        this.canvas = document.getElementById(canvasId);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);

        this.createCamera();
        this.createControls();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#ccc");

        this.createLights();

        this.canvas.addEventListener("keypress", event => {
            switch (event.key) {
                case "i":
                    console.info(this.renderer.info);
                    break;
                case "w":
                    this.model.toggleWireframeMode();
                    break;
            }
        });
    }

    async loadModel() {
        this.model = await Model.load(this.modelName, this.wireframeMode);
        this.scene.add(this.model.getObject());
    }

    start() {
        requestAnimationFrame(this.render.bind(this));
    }

    render() {
        this.controls.update();
        // avoid unnecessarily burdening the CPU if the canvas is not visible due to page scrolling
        if (this.isCanvasVisible()) {
            this.renderer.render(this.scene, this.camera);
        }
        requestAnimationFrame(this.render.bind(this));
    }

    isCanvasVisible() {
        const rect = this.canvas.getBoundingClientRect();
        const top = rect.y;
        const bottom = top + rect.height;
        return (top > 0 && top < window.innerHeight) || (bottom > 0 && bottom < window.innerHeight);
    }

    createCamera() {
        const fov = 45;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.setCameraPosition(0, 10, 20);
    }

    setCameraPosition(x, y, z) {
        this.camera.position.set(x, y, z);
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    setCameraZoom(zoom) {
        this.camera.zoom = zoom;
        this.camera.updateProjectionMatrix();
    }

    createControls() {
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.autoRotate = true;
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        this.controls.target.set(0, 0, 0);
    }

    createPlane() {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load("assets/checker.png");
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
        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    createLights() {
        const intensity = 1;

        const skyColor = 0xB97A20;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.scene.add(hemisphereLight);

        const color = 0xFFFFFF;
        this.directionalLight = new THREE.DirectionalLight(color, intensity);
        this.directionalLight.position.set(10, 10, 10);
        this.directionalLight.target.position.set(0, 0, 0);
        this.scene.add(this.directionalLight);
    }

    static async load(canvasId, modelName = canvasId, wireframeMode = false) {
        const demo = new ModelDemo(canvasId, modelName, wireframeMode);
        await demo.loadModel();
        demo.start();
        return demo;
    }
}
