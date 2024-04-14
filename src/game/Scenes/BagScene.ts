import { Container, Graphics, Loader, Sprite, Text, TextStyle } from "pixi.js";
import { IScene } from "../../engine/Scenes/IScene";
import { SCREEN_HEIGHT, SCREEN_WIDTH, SCALE } from "../Cons";
import DialogBox from "../../engine/UI/DialogBox";
import { Keyboard } from "../../engine/Input/Keyboard";
import { Group } from "tweedle.js";
import IEntitie, { EntityType } from "../../engine/Entities/IEntity";
import { ManagerScene } from "../../engine/Scenes/ManagerScene";
import { WinnerScene } from "./WinnerScene";
import { Palette } from "../../engine/Utils/Palette";
import PlayerController from "../../engine/Entities/PlayerController";
import { Entity } from "../../engine/Entities/Entity";
import { AnimationEntity } from "../../engine/Entities/AnimationEntity";
import { UserData } from "../UserData";
import { Sound } from "@pixi/sound";
import { MapScene } from "./MapScene";
import { TownScene } from "./TownScene";
import { GameOverScene } from "./GameOverScene";

export class BagScene extends Container implements IScene
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
        const background = new Sprite(Loader.shared.resources['BagScene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        const player = new Entity(Loader.shared.resources['hand'].texture!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(UserData.spawnPointX * 8 * SCALE, UserData.spawnPointY * 8 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);

        if (UserData.stepsAdventure === 0)
            DialogBox.getInstance().showText("This is your inventory. You can only choose a single item to repair your car; once you select it, you won't be able to choose another. To select it, simply pick it up with the cursor. Think, what's the most suitable item to repair a car?");

        if (UserData.stepsAdventure === 1)
            DialogBox.getInstance().showText("Think carefully, what can heal a frightened man...");

        if (UserData.stepsAdventure === 2)
            DialogBox.getInstance().showText('You: "I only have one item left, I\'ll have to try my luck... now or never!..."');

        if (!UserData.isWrecnchPicked)
        {
            const wrench = new Entity(Loader.shared.resources['wrench'].texture!, EntityType.ITEM);
            wrench.scale.set(SCALE);
            wrench.position.set(7 * 8 * SCALE, 5 * 8 * SCALE);
            this.layerEntities.addChild(wrench);
            this.arrEntities.push(wrench);
            wrench.callback = () =>
            {
                UserData.isWrecnchPicked = true
                if (UserData.stepsAdventure === 2)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new WinnerScene(), 4, 10)
                }
                if (UserData.stepsAdventure === 1)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new TownScene(), 4, 10)
                }
                if (UserData.stepsAdventure === 0)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new MapScene(), 2, 10)
                }
            }
        }

        if (!UserData.isGarlicPicked)
        {
            const garlic = new Entity(Loader.shared.resources['garlic'].texture!, EntityType.ITEM);
            garlic.scale.set(SCALE);
            garlic.position.set(12 * 8 * SCALE, 8 * 8 * SCALE);
            this.layerEntities.addChild(garlic);
            this.arrEntities.push(garlic);
            garlic.callback = () =>
            {
                UserData.isGarlicPicked = true
                if (UserData.stepsAdventure === 2)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new GameOverScene(), 4, 10)
                }
                if (UserData.stepsAdventure === 1)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new TownScene(), 4, 10)
                }
                if (UserData.stepsAdventure === 0)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new MapScene(), 2, 10)
                }

            }
        }

        if (!UserData.isPoisonPicked)
        {
            const poison = new Entity(Loader.shared.resources['poison'].texture!, EntityType.ITEM);
            poison.scale.set(SCALE);
            poison.position.set(2 * 8 * SCALE, 8 * 8 * SCALE);
            this.layerEntities.addChild(poison);
            this.arrEntities.push(poison);
            poison.callback = () =>
            {
                UserData.isPoisonPicked = true
                if (UserData.stepsAdventure === 2)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new GameOverScene(), 4, 10)
                }
                if (UserData.stepsAdventure === 1)
                {
                    UserData.manCured = true
                    UserData.stepsAdventure++
                    this.changeScene(new TownScene(), 4, 10)
                }
                if (UserData.stepsAdventure === 0)
                {
                    UserData.stepsAdventure++
                    this.changeScene(new MapScene(), 2, 10)
                }
            }
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

}

