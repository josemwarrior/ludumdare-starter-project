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

export class WinnerScene extends Container implements IScene
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
        const background = new Sprite(Loader.shared.resources['WinnerScene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        DialogBox.getInstance().showText('You: "Phew, who knew that wrench would deliver the coup de grace to this creature... it\'s been a hard day\'s work, I deserve an ice cream... this job is not paid for..."', () =>
        {
            setTimeout(() =>
            {
                DialogBox.getInstance().showText('The End.', this.tryNewGame.bind(this))
            }, 500);
        }
        )

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

    tryNewGame() 
    {
        UserData.reset()
        setTimeout(() =>
        {
            DialogBox.getInstance().showText('Do you want to give it another shot?', () =>
            {
                this.changeScene(new HouseScene(), 5, 7)
            });
        }, 3000)
    }

}

