import { Container, Graphics, Loader, Sprite, Text, TextStyle } from "pixi.js";
import { IScene } from "../../engine/Scenes/IScene";
import { SCREEN_HEIGHT, SCREEN_WIDTH, SCALE } from "../Cons";
import DialogBox from "../../engine/UI/DialogBox";

export class EmptyScene extends Container implements IScene
{
    constructor()
    {
        super();
        this.create();
    }
    create()
    {
        const sprite = new Sprite(Loader.shared.resources['tile_01'].texture!);
        sprite.scale.set(SCALE);
        this.addChild(sprite);

        const blackRect = new Graphics();
        blackRect.beginFill(0x000000);
        const rw = 104 * SCALE;
        const rh = 19 * SCALE;
        const rx = 12 * SCALE;
        const ry = 97 * SCALE;
        blackRect.drawRect(0, 0, rw, rh);
        blackRect.endFill();
        blackRect.position.set(rx, ry);
        this.addChild(blackRect);



        // const text1 = new Text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel leo porttitor, viverra nulla at, lobortis justo. Integer nec leo turpis.', styleColorAlphaMenu);
        // text1.position.set(rx );
        // this.addChild(text1);
        
        const labelWelcome = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel leo porttitor, viverra nulla at, lobortis justo. Integer nec leo turpis.'

        const dialogBox = DialogBox.getInstance();
        dialogBox.showText(labelWelcome);
        this.addChild(dialogBox);




    }

    update(framesPassed: number): void
    {
    }

    resize(screenWidth: number, screenHeight: number): void
    {
    }

}

