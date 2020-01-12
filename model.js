
import * as THREE from "./node_modules/three/build/three.module.js";
import {OBJLoader2} from './node_modules/three/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from './node_modules/three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';

export default class Model {

    constructor (fileName, wireframeMode = false) {
        this.fileName = fileName;
        this.wireframeMode = wireframeMode;
        this.materials = null;
        this.root = null;
    }

    async loadMaterial() {
        return new Promise(resolve => {
            const mtlLoader = new MTLLoader();
            mtlLoader.load(`models/${this.fileName}.mtl`, mtlParseResult => {
                this.materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
                resolve();
            });
        });
    }

    async loadObject() {
        return new Promise(resolve => {
            const objLoader = new OBJLoader2();
            objLoader.addMaterials(this.materials, true);
            objLoader.load(`models/${this.fileName}.obj`, root => {

                if (this.wireframeMode) {
                    this.toggleWireframeModeOn(root);
                }

                this.root = root;

                resolve();
            });
        });
    }

    // https://stackoverflow.com/questions/24379720/threejs-wireframe-with-the-object-materials
    toggleWireframeModeOn(root) {
        for (const child of root.children) {
            child.material.wireframe = true;
            child.material.color = new THREE.Color(0xff0000);
        }
    }

    static async load(fileName, wireframeMode = false) {
        const model = new Model(fileName, wireframeMode);
        await model.loadMaterial();
        await model.loadObject();
        return model.root;
    }
}
