import { Application, DisplayObject, SCALE_MODES, settings } from "pixi.js";

export const enum Resize { LETTERBOX, RESPONSIVE }

export class ManagerScene
{
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    // Safely store variables for our game
    public static app: Application;
    private static currentScene: IScene;
    private static responsive: Resize;

    // Width and Height are read-only after creation (for now)
    private static _width: number;
    private static _height: number;

    // With getters but not setters, these variables become read-only
    public static get width(): number { return ManagerScene._width; }
    public static get height(): number { return ManagerScene._height; }

    // Use this function ONCE to start the entire machinery
    public static initialize(width: number, height: number, background: number, responsive: Resize): void
    {
        // Store width and height
        ManagerScene._width = width;
        ManagerScene._height = height;
        ManagerScene.responsive = responsive;

        // Create the application
        ManagerScene.app = new Application({
            // view: document.getElementById("pixi-canvas") as HTMLCanvasElement, // <-- this is to set to a specific canvas but we want to use the entire screen
            view: document.getElementById('game') as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height,
            antialias: false,

            //resizeTo: responsive == Resize.RESPONSIVE ? window : undefined,
        });

        // Disable interpolation when scaling, will make texture be pixelated
        settings.SCALE_MODE = SCALE_MODES.NEAREST;

        // Add the application to the document
        //document.body.appendChild(ManagerScene.app.view);

        // Add the ticker
        ManagerScene.app.ticker.add(ManagerScene.update);

        // listen for resize events
        window.addEventListener("resize", ManagerScene.resize);

        // call it once to make sure we get the right size
        ManagerScene.resize();
    }

    public static resize(): void
    {
        if (ManagerScene.responsive == Resize.LETTERBOX)
        {
            // current screen size
            const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            // uniform scale for our game
            const scale = Math.min(screenWidth / ManagerScene.width, screenHeight / ManagerScene.height);

            // the "uniformly englarged" size for our game
            const enlargedWidth = Math.floor(scale * ManagerScene.width);
            const enlargedHeight = Math.floor(scale * ManagerScene.height);

            // margins for centering our game
            const horizontalMargin = (screenWidth - enlargedWidth) / 2;
            const verticalMargin = (screenHeight - enlargedHeight) / 2;

            // now we use css trickery to set the sizes and margins
            ManagerScene.app.view.style.width = `${enlargedWidth}px`;
            ManagerScene.app.view.style.height = `${enlargedHeight}px`;
            ManagerScene.app.view.style.marginLeft = ManagerScene.app.view.style.marginRight = `${horizontalMargin}px`;
            ManagerScene.app.view.style.marginTop = ManagerScene.app.view.style.marginBottom = `${verticalMargin}px`;
        }
        else if (ManagerScene.responsive == Resize.RESPONSIVE)
        {
            // if we have a scene, we let it know that a resize happened!
            if (ManagerScene.currentScene)
                ManagerScene.currentScene.resize(ManagerScene.width, ManagerScene.height);
        }

    }

    // Call this function to switch to a new scene
    public static switchScene(scene: IScene): void
    {
        // If we have a current scene, remove it
        if (ManagerScene.currentScene)
        {
            ManagerScene.app.stage.removeChild(ManagerScene.currentScene);
            ManagerScene.currentScene.destroy();
        }

        // Add the new scene
        ManagerScene.currentScene = scene;
        ManagerScene.app.stage.addChild(ManagerScene.currentScene);
    }

    // Call this function to update the current scene
    private static update(deltaTime: number): void
    {
        if (ManagerScene.currentScene)
        {
            ManagerScene.currentScene.update(ManagerScene.app.ticker.deltaTime);
        }
    }

}

// This could have a lot more generic functions that you force all your scenes to have. Update is just an example.
// Also, this could be in its own file...
export interface IScene extends DisplayObject 
{
    update(framesPassed: number): void;

    resize(screenWidth: number, screenHeight: number): void;
}
