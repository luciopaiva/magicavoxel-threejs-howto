
import ModelDemo from "./model-demo.js";

class App {

    constructor () {
        ModelDemo.load("cyclist-cover", "cyclist")
            .then(this.setupCyclist.bind(this));
        ModelDemo.load("2x2x2", "2x2x2", true)
            .then(this.setupCube.bind(this));
        ModelDemo.load("2x2x2-1-voxel-removed", "2x2x2-1-voxel-removed", true)
            .then(this.setupCube.bind(this));
        ModelDemo.load("2x2x2-colors")
            .then(this.setupCube.bind(this));
        ModelDemo.load("2x2x2-colors-wireframe", "2x2x2-colors", true)
            .then(this.setupCube.bind(this));
        ModelDemo.load("cyclist")
            .then(this.setupCyclist.bind(this));
    }

    setupCube(demo) {
        demo.controls.target.set(0.1, 2.1, -0.1);
        demo.setCameraZoom(50);
    }

    setupCyclist(demo) {
        demo.controls.target.set(0, 1.2, 0);
        demo.setCameraZoom(6);
    }
}

window.addEventListener("load", () => new App());
