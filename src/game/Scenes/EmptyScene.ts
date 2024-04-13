import { Container, Graphics, Loader, Sprite, Text, TextStyle } from "pixi.js";
import { IScene } from "../../engine/Scenes/IScene";
import { SCREEN_HEIGHT, SCREEN_WIDTH, SCALE } from "../Cons";
import DialogBox from "../../engine/UI/DialogBox";
import { Keyboard } from "../../engine/Input/Keyboard";
import { Group } from "tweedle.js";

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

        // const text1 = new Text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel leo porttitor, viverra nulla at, lobortis justo. Integer nec leo turpis.', styleColorAlphaMenu);
        // text1.position.set(rx );
        // this.addChild(text1);


        // Add keyboard listener
        Keyboard.getInstance().subscribe('ArrowLeft', () => {
            
        });
        
        // right
        Keyboard.getInstance().subscribe('ArrowRight', () => {
            if (DialogBox.getInstance().isShowedDialog())
            {
                DialogBox.getInstance().speedUpText()
                DialogBox.getInstance().showNextLines()
            }
        });
        // up
        Keyboard.getInstance().subscribe('ArrowUp', () => {

            const labelWelcome = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel leo porttitor, viverra nulla at, lobortis justo. Integer nec leo turpis.'

            const dialogBox = DialogBox.getInstance();
            dialogBox.showText(labelWelcome);
            this.addChild(dialogBox);
        });
        // down
        Keyboard.getInstance().subscribe('ArrowDown', () => {
            console.log('down pressed');
        });

    }


    update(framesPassed: number): void
    {
        Group.shared.update();
    }

    resize(screenWidth: number, screenHeight: number): void
    {
    }

}

