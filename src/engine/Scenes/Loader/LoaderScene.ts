import { Container, Loader, SCALE_MODES, settings } from "pixi.js";
import { LoadingBar } from "./LoadingBar";
import { assets } from "../../../assets";
import { ManagerScene } from "../ManagerScene";
import { IScene } from "../IScene";
import { EmptyScene } from "../../../game/Scenes/EmptyScene";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";



export class LoaderScene extends Container implements IScene
{
    private loadingbar: LoadingBar;

    constructor(screenWidth: number, screenHeight: number)
    {
        super();

        settings.SCALE_MODE = SCALE_MODES.NEAREST;

        // lets make a loader graphic:
        this.loadingbar = new LoadingBar(screenWidth, screenHeight);
        this.addChild(this.loadingbar);

        // Now the actual asset loader:
        //Loader.shared.baseUrl = <string>process.env.BASE_URL;
        
        Loader.registerPlugin(WebfontLoaderPlugin);

        // we add the asset manifest
        Loader.shared.add(assets);

        // connect the events
        Loader.shared.onProgress.add(this.downloadProgress, this);
        Loader.shared.onComplete.once(this.gameLoaded, this);

        // Start loading!
        Loader.shared.load();
        
        
       
    }

    resize(screenWidth: number, screenHeight: number): void
    {

    }

    private downloadProgress(loader: Loader): void
    {
        // Progress goes from 0 to 100 but we are going to use 0 to 1 to set it to scale
        this.loadingbar.update(loader.progress);
    }

    private gameLoaded(): void
    {
        // Our game finished loading!
        // Let's remove our loading bar
        this.removeChild(this.loadingbar);
        // all your assets are ready! I would probably change to another scene
        // ...but you could build your entire game here if you want
        // (pls don't)
        // Change scene to the game scene!
        ManagerScene.switchScene(new EmptyScene());
    }

    public update(deltaTime: number): void
    {
        // To be a scene we must have the update method even if we don't use it.
    }

}

