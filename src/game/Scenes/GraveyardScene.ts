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
import { Sound } from "@pixi/sound";
import { MapScene } from "./MapScene";
import { BagScene } from "./BagScene";

export class GraveyardScene extends Container implements IScene
{

    public arrEntities: IEntitie[] = []
    public layerEntities: Container = new Container()
    public layerHUD: Container = new Container()

    constructor()
    {
        super();
    }

    start()
    {
        this.arrEntities = []

        ManagerScene.app.renderer.backgroundColor = Palette.BROWN_LIGHT;

        setTimeout(() =>
        {
            this.addControl()
        }, 10)

        this.addChild(this.layerEntities);
        this.addChild(this.layerHUD);

        // Add dialog box to the Scene
        this.layerHUD.addChild(DialogBox.getInstance());

        // Add background
        const background = new Sprite(Loader.shared.resources['GraveyardScene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        const player = new Entity(Loader.shared.resources['hero'].texture!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(UserData.spawnPointX * 8 * SCALE, UserData.spawnPointY * 8 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);


        DialogBox.getInstance().showText('You: "Alright, creature of the underworld, your time has come!"')

        const lastMove = new Entity(Loader.shared.resources['block'].texture!, EntityType.BLOCK);
        lastMove.scale.set(SCALE);
        lastMove.visible = false
        lastMove.position.set(7 * 8 * SCALE, 5 * 8 * SCALE);
        this.layerEntities.addChild(lastMove);
        this.arrEntities.push(lastMove);
        lastMove.callback = () =>
        {
            this.doLastMove()
        }

        const lastMove2 = new Entity(Loader.shared.resources['block'].texture!, EntityType.BLOCK);
        lastMove2.scale.set(SCALE);
        lastMove2.visible = false
        lastMove2.position.set(8 * 8 * SCALE, 5 * 8 * SCALE);
        this.layerEntities.addChild(lastMove2);
        this.arrEntities.push(lastMove2);
        lastMove2.callback = () =>
        {
            this.doLastMove()
        }

    }

    doLastMove()
    {
        this.changeScene(new BagScene(), 7, 11)
    }

    changeScene(scene: IScene, spawnX: number, spawnY: number)
    {
        UserData.spawnPointX = spawnX
        UserData.spawnPointY = spawnY 
        this.arrEntities = []
        this.layerEntities.removeChildren()
        this.layerHUD.removeChildren()
        Keyboard.getInstance().clear()
        ManagerScene.switchScene(scene)
    }

    addControl()
    {
        // Add keyboard listener
        Keyboard.getInstance().subscribe('ArrowLeft', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.LEFT, 'EmptyScene')
            }
        });

        // right
        Keyboard.getInstance().subscribe('ArrowRight', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.RIGHT, 'EmptyScene')
            }
        });
        // up
        Keyboard.getInstance().subscribe('ArrowUp', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.UP, 'EmptyScene')
            }
        });
        // down
        Keyboard.getInstance().subscribe('ArrowDown', () =>
        {
            if (!this.checkText())
            {
                PlayerController.movePlayer(this.arrEntities, PlayerController.DOWN, 'EmptyScene')
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

