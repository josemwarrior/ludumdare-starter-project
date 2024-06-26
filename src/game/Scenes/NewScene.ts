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
import { UserData } from "../UserData";

export class NewScene extends Container implements IScene
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
        this.arrEntities = []

        ManagerScene.app.renderer.backgroundColor = Palette.BROWN_LIGHT;

        setTimeout(() => {
            this.addControl()
        }, 10)


        this.addChild(this.layerEntities);
        this.addChild(this.layerHUD);

        // Add dialog box to the Scene
        this.layerHUD.addChild(DialogBox.getInstance());
        
        // Add background
        // const background = new Sprite(Loader.shared.resources['room00'].texture!);
        // background.scale.set(SCALE);
        // this.layerEntities.addChild(background);

        // Add Entities
        const sprite = new Sprite(Loader.shared.resources['tile_01'].texture!);
        sprite.scale.set(SCALE);
        this.layerEntities.addChild(sprite);

        const player = new AnimationEntity(Loader.shared.resources['frames'].spritesheet?.animations['player']!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(32 * SCALE, 0 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);

        const block = new Entity(Loader.shared.resources['block'].texture!, EntityType.BLOCK);
        block.scale.set(SCALE);
        block.position.set(16 * SCALE, 16 * SCALE);
        this.layerEntities.addChild(block);
        this.arrEntities.push(block);
        block.callback = () => {
            DialogBox.getInstance().showText('You can\'t move here')
        }

        const potion = new Entity(Loader.shared.resources['potion'].texture!, EntityType.ITEM);
        potion.scale.set(SCALE);
        potion.position.set(24 * SCALE, 24 * SCALE);
        this.layerEntities.addChild(potion);
        this.arrEntities.push(potion);
        potion.callback = () => {
            DialogBox.getInstance().showText('You found a potion!')
            UserData.potions = 1
            // Remove potion from scene
            this.layerEntities.removeChild(potion)
            // Remove potion from array of Entities
            this.arrEntities.splice(this.arrEntities.indexOf(potion), 1)
        }

    }

    addControl()
    {
        // Add keyboard listener
        Keyboard.getInstance().subscribe('ArrowLeft', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.LEFT, 'NewScene')
            }
        });

        // right
        Keyboard.getInstance().subscribe('ArrowRight', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.RIGHT    , 'NewScene')
            }
        });
        // up
        Keyboard.getInstance().subscribe('ArrowUp', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.UP   , 'NewScene')
            }
        });
        // down
        Keyboard.getInstance().subscribe('ArrowDown', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.DOWN , 'NewScene')
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

