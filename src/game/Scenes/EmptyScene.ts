import { Container, Graphics, Loader, Sprite, Text, TextStyle } from "pixi.js";
import { IScene } from "../../engine/Scenes/IScene";
import { SCREEN_HEIGHT, SCREEN_WIDTH, SCALE } from "../Cons";
import DialogBox from "../../engine/UI/DialogBox";
import { Keyboard } from "../../engine/Input/Keyboard";
import { Group } from "tweedle.js";
import IEntitie, { EntityType } from "../../engine/Entities/IEntity";
import { ManagerScene } from "../../engine/Scenes/ManagerScene";
import { Palette } from "../../engine/Utils/Palette";
import PlayerController from "../../engine/Entities/PlayerController";
import { Entity } from "../../engine/Entities/Entity";
import { AnimationEntity } from "../../engine/Entities/AnimationEntity";

export class EmptyScene extends Container implements IScene
{

    public arrEntities: IEntitie[] = []
    public layerEntities: Container = new Container()
    public layerHUD: Container = new Container()

    constructor()
    {
        super();
        this.create();
    }

    create()
    {
        ManagerScene.app.renderer.backgroundColor = Palette.BROWN_LIGHT;

        this.addChild(this.layerEntities);
        this.addChild(this.layerHUD);

        this.layerHUD.addChild(DialogBox.getInstance());
        
        const sprite = new Sprite(Loader.shared.resources['tile_01'].texture!);
        sprite.scale.set(SCALE);
        this.layerEntities.addChild(sprite);

        const player = new AnimationEntity(Loader.shared.resources['frames'].spritesheet?.animations['player']!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(8 * SCALE, 8 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);

        const block = new Entity(Loader.shared.resources['block'].texture!, EntityType.BLOCK);
        block.scale.set(SCALE);
        block.position.set(16 * SCALE, 16 * SCALE);
        this.layerEntities.addChild(block);
        this.arrEntities.push(block);
        block.callback = () => {
            DialogBox.getInstance().showText('You can\'t move here!')
        }

        // Add keyboard listener
        Keyboard.getInstance().subscribe('ArrowLeft', () => {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.LEFT)
            }
        });
        
        // right
        Keyboard.getInstance().subscribe('ArrowRight', () => {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.RIGHT)
            }
        });
        // up
        Keyboard.getInstance().subscribe('ArrowUp', () => {

            // const labelWelcome = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel leo porttitor, viverra nulla at, lobortis justo. Integer nec leo turpis.'

            // const dialogBox = DialogBox.getInstance();
            // dialogBox.showText(labelWelcome);
            // this.addChild(dialogBox);
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.UP)
            }
        });
        // down
        Keyboard.getInstance().subscribe('ArrowDown', () => {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.DOWN)
            }
        });

    }

    private checkText(): boolean
    {
        const isTextShow = DialogBox.getInstance().isShowedDialog();
        if (isTextShow)
        {
            DialogBox.getInstance().speedUpText()
            DialogBox.getInstance().showNextLines()
        }
        return isTextShow
    }
    


    update(delta: number): void
    {
        Group.shared.update();
        for (let i = 0; i < this.arrEntities.length; i++)
        {
            this.arrEntities[i].update(delta);
        }
    }

    resize(screenWidth: number, screenHeight: number): void
    {
    }

}

