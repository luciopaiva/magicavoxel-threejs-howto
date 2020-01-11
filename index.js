
import ModelDemo from "./model-demo.js";

class App {

    constructor () {
        new ModelDemo("cyclist-cover", "cyclist");
        new ModelDemo("2x2x2", "2x2x2", true);
        new ModelDemo("2x2x2-1-voxel-removed", "2x2x2-1-voxel-removed", true);
        new ModelDemo("2x2x2-colors");
        new ModelDemo("2x2x2-colors-wireframe", "2x2x2-colors", true);
        new ModelDemo("cyclist");
    }
}

window.addEventListener("load", () => new App());
