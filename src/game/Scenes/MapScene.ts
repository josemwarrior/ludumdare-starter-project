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
import { BagScene } from "./BagScene";
import { TownScene } from "./TownScene";
import { GraveyardScene } from "./GraveyardScene";
import { GameOverScene } from "./GameOverScene";

export class MapScene extends Container implements IScene
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
        const background = new Sprite(Loader.shared.resources['MapScene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        if (UserData.stepsAdventure === 1)
        {
            if (UserData.isGarlicPicked)
            {
                UserData.carRepaired = true
                DialogBox.getInstance().showText("Jesus Christ, these garlic heads have worked very well. Ok, let's go to that village and see what the problem is there.");
            }
            else
            {
                UserData.carRepaired = false
                DialogBox.getInstance().showText("Good heavens, there's no one who understands these modern-day vehicles. Well, I'll walk to that village and see what the problem is.");
            }
        }

        const avatar = (UserData.carRepaired) ? 'car' : 'hero'
        const player = new Entity(Loader.shared.resources[avatar].texture!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(UserData.spawnPointX * 8 * SCALE, UserData.spawnPointY * 8 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);

        if (UserData.stepsAdventure === 1)
        {
            const entryCity = new Entity(Loader.shared.resources['entryCity'].texture!, EntityType.ITEM);
            entryCity.scale.set(SCALE);
            entryCity.position.set(7 * 8 * SCALE, 3 * 8 * SCALE);
            this.layerEntities.addChild(entryCity);
            this.arrEntities.push(entryCity);
            entryCity.callback = () =>
            {
                this.changeScene(new TownScene(), 7, 14)
            }
        }

        const entryGraveyard = new Entity(Loader.shared.resources['entryCity'].texture!, EntityType.ITEM);
        entryGraveyard.scale.set(SCALE);
        entryGraveyard.position.set(12 * 8 * SCALE, 10 * 8 * SCALE);
        this.layerEntities.addChild(entryGraveyard);
        this.arrEntities.push(entryGraveyard);
        entryGraveyard.callback = () =>
        {
            if (UserData.stepsAdventure === 1 && UserData.carRepaired)
            {
                DialogBox.getInstance().showText("I have to go to that village first.")
            }

            if (UserData.stepsAdventure === 2 && UserData.carRepaired)
            {
                this.changeScene(new GraveyardScene(), 7, 14)
            }

            if (!UserData.carRepaired)
            {
                this.changeScene(new GameOverScene(), 0, 0)
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

