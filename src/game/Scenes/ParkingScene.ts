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

export class ParkingScene extends Container implements IScene
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
        const background = new Sprite(Loader.shared.resources['ParkingScene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        const player = new Entity(Loader.shared.resources['hero'].texture!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(UserData.spawnPointX * 8 * SCALE, UserData.spawnPointY * 8 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);

        const array_blocks = [
            [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7],
            [1, 8],
            [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9], [9, 9], [10, 9], [11, 9], [12, 9], [13, 9]]


        for (let i = 0; i < array_blocks.length; i++)
        {
            const block = new Entity(Loader.shared.resources['block'].texture!, EntityType.BLOCK);
            block.scale.set(SCALE);
            block.position.set(array_blocks[i][0] * 8 * SCALE, array_blocks[i][1] * 8 * SCALE);
            this.layerEntities.addChild(block);
            block.visible = false
            this.arrEntities.push(block);
        }

        const sign = new Entity(Loader.shared.resources['block'].texture!, EntityType.ITEM);
        sign.scale.set(SCALE);
        sign.position.set(5 * 8 * SCALE, 8 * 8 * SCALE);
        this.layerEntities.addChild(sign);
        this.arrEntities.push(sign);
        sign.callback = () =>
        {
            DialogBox.getInstance().showText('"Local house of the Disaster Unsummoner. We also work on Thursdays."')
        }
        sign.visible = false

        // Exits
        const exit = new Entity(Loader.shared.resources['exit'].texture!, EntityType.ITEM);
        exit.scale.set(SCALE);
        exit.visible = false
        exit.position.set(11 * 8 * SCALE, 8 * 8 * SCALE);
        this.layerEntities.addChild(exit);
        this.arrEntities.push(exit);
        exit.callback = () =>
        {
            DialogBox.getInstance().showText('You: "Damn it, this clunker hasn\'t started in a month, I\'ll have to fix it with some item from my inventory."', () =>
            {
                this.changeScene(new BagScene(), 7, 11)
            })

        }

        // DialogBox.getInstance().showText('hello')
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

