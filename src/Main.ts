
import { utils } from "pixi.js"
import { ManagerScene, Resize } from "./engine/Scenes/ManagerScene";
import { LoaderScene } from "./engine/Scenes/Loader/LoaderScene";
import { SCREEN_WIDTH, SCREEN_HEIGHT, BACKGROUND_COLOR } from "./game/Cons";

// Remove banner from console.
utils.skipHello();

ManagerScene.initialize(SCREEN_WIDTH, SCREEN_HEIGHT, BACKGROUND_COLOR, Resize.LETTERBOX);
ManagerScene.switchScene(new LoaderScene(SCREEN_WIDTH, SCREEN_HEIGHT));

