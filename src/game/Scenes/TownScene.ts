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

export class TownScene extends Container implements IScene
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
        const background = new Sprite(Loader.shared.resources['TownScene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        const player = new Entity(Loader.shared.resources['hero'].texture!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(UserData.spawnPointX * 8 * SCALE, UserData.spawnPointY * 8 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);

        
        if (!UserData.manCured)
        {
            if (UserData.stepsAdventure === 1)
            {
                const manIllned = new AnimationEntity(Loader.shared.resources['frames'].spritesheet?.animations['player']!, EntityType.BLOCK)
                manIllned.scale.set(SCALE)
                manIllned.position.set(3 * 8 * SCALE, 10 * 8 * SCALE)
                this.layerEntities.addChild(manIllned);
                this.arrEntities.push(manIllned);
                manIllned.callback = () =>
                {
                    DialogBox.getInstance().showText('Frightened man: "My God, an invocation has appeared in the cemetery, we\'re all going to die!"', () =>
                    {
                        setTimeout(() =>
                        {
                            DialogBox.getInstance().showText('You: "I have to look for a good remedy to cure this good man in my inventory"', () =>
                            {
                                this.changeScene(new BagScene(), 7, 11)
                            })
                        }, 200);

                    })
                }
            }
            else
            { 
                // deadGuy
                const deadGuy = new Entity(Loader.shared.resources['deadGuy'].texture!, EntityType.BLOCK)
                deadGuy.scale.set(SCALE)
                deadGuy.position.set(3 * 8 * SCALE, 10 * 8 * SCALE)
                this.layerEntities.addChild(deadGuy);
                this.arrEntities.push(deadGuy);
                deadGuy.callback = () =>
                {
                    DialogBox.getInstance().showText('You: "It doesn\'t seem to be moving..."')
                }
            }
        }
        else
        {
            // Big guy
            const strongMan = new Entity(Loader.shared.resources['strongMan'].texture!, EntityType.BLOCK)
            strongMan.scale.set(SCALE)
            strongMan.position.set(3 * 8 * SCALE, 10 * 8 * SCALE)
            this.layerEntities.addChild(strongMan);
            this.arrEntities.push(strongMan);
            strongMan.callback = () =>
            {
                DialogBox.getInstance().showText('Strongman: "Never in my life have I felt so healthy.')
            }
        }

        if (UserData.stepsAdventure === 2)
        {
            const entryCity = new Entity(Loader.shared.resources['entryCity'].texture!, EntityType.ITEM);
            entryCity.scale.set(SCALE);
            entryCity.position.set(7 * 8 * SCALE, 15 * 8 * SCALE);
            this.layerEntities.addChild(entryCity);
            this.arrEntities.push(entryCity);
            entryCity.callback = () =>
            {
                this.changeScene(new MapScene(), 7, 4)
            }

        }

        let witnessGuyLine = ''
        if (UserData.stepsAdventure === 1)
        {
            // ese tio está un poco nervioso
            witnessGuyLine = 'Spectator:"That guy over there seems to be a bit nervous."'
        }
        else    
        {
            if (UserData.manCured)
            {
                witnessGuyLine = 'Spectator:"Wow, you\'re amazing."'
            }
            else
            {
                witnessGuyLine = 'Spectator:"It\'s the second time you\'ve messed up this month. Start looking for a new job..."'
            }
        }

        const witnessGuy = new Entity(Loader.shared.resources['staringGuy'].texture!, EntityType.BLOCK)
        witnessGuy.scale.set(SCALE)
        witnessGuy.position.set(9 * 8 * SCALE, 10 * 8 * SCALE)
        this.layerEntities.addChild(witnessGuy);
        this.arrEntities.push(witnessGuy);
        witnessGuy.callback = () =>
        {
            DialogBox.getInstance().showText(witnessGuyLine)
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

