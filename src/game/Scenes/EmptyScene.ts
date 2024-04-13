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

        this.addControl();

        this.addChild(this.layerEntities);
        this.addChild(this.layerHUD);

        // Add dialog box to the Scene
        this.layerHUD.addChild(DialogBox.getInstance());
        
        // Add Entities
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
            DialogBox.getInstance().showText('You can\'t move here')
        }

        const potion = new Entity(Loader.shared.resources['potion'].texture!, EntityType.ITEM);
        potion.scale.set(SCALE);
        potion.position.set(24 * SCALE, 24 * SCALE);
        this.layerEntities.addChild(potion);
        this.arrEntities.push(potion);
        potion.callback = () => {
            DialogBox.getInstance().showText('You found a potion!')
            UserData.potions = ++UserData.potions
            this.layerEntities.removeChild(potion)
        }

        DialogBox.getInstance().showText('hello')
    }

    addControl()
    {
        // Add keyboard listener
        Keyboard.getInstance().subscribe('ArrowLeft', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.LEFT)
            }
        });

        // right
        Keyboard.getInstance().subscribe('ArrowRight', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.RIGHT)
            }
        });
        // up
        Keyboard.getInstance().subscribe('ArrowUp', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.UP)
            }
        });
        // down
        Keyboard.getInstance().subscribe('ArrowDown', () =>
        {
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

