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
import { HouseScene } from "./HouseScene";

export class GameOverScene extends Container implements IScene
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

        UserData.beatTheGame = true

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
        const background = new Sprite(Loader.shared.resources['GameOverScene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        if (!UserData.carRepaired)
        {
            DialogBox.getInstance().showText('Because you were walking you took too long and the summoning became too powerful. It has grown so powerful that it now rules the village, and soon the world... you have lost.', this.restartGame.bind(this))
        } 
        else
        {
            DialogBox.getInstance().showText('You chose wrong, that item has given the summon enormous power and now it rules the village, and soon the world...you have lost.', this.restartGame.bind(this))
        }

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

    
    restartGame() 
    {
        UserData.reset()
        setTimeout(() =>
        {
            DialogBox.getInstance().showText('You have been given a second chance, do not fail this time.', () =>
            {
                this.changeScene(new HouseScene(), 5, 7)

            });
        }, 1000)
    }

}

