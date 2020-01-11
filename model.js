
import * as THREE from "./node_modules/three/build/three.module.js";
import {OBJLoader2} from './node_modules/three/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import {MtlObjBridge} from './node_modules/three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';

export default class Model {

    constructor (scene, fileName, wireframeMode = false) {
        const objLoader = new OBJLoader2();

        const mtlLoader = new MTLLoader();
        mtlLoader.load(`models/${fileName}.mtl`, (mtlParseResult) => {
            const materials =  MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
            objLoader.addMaterials(materials);
            objLoader.load(`models/${fileName}.obj`, (root) => {

                if (wireframeMode) {
                    for (const child of root.children) {
                        child.material.wireframe = true;
                        child.material.color = new THREE.Color(0xff0000);
                    }
                }

                scene.add(root);
                root.position.x = 0;
                root.position.y = 0;
                root.position.z = 0;
            });
        });
    }
}
