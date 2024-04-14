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
import { ParkingScene } from "./ParkingScene";

export class HouseScene extends Container implements IScene
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

        

        this.addChild(this.layerEntities);
        this.addChild(this.layerHUD);

        // Add dialog box to the Scene
        this.layerHUD.addChild(DialogBox.getInstance());

        // Add background
        const background = new Sprite(Loader.shared.resources['house_scene'].texture!);
        background.scale.set(SCALE);
        this.layerEntities.addChild(background);

        // Add Entities
        // const sprite = new Sprite(Loader.shared.resources['tile_01'].texture!);
        // sprite.scale.set(SCALE);
        // this.layerEntities.addChild(sprite);

        const player = new Entity(Loader.shared.resources['hero'].texture!, EntityType.PLAYER);
        player.scale.set(SCALE);
        player.position.set(5 * 8 * SCALE, 7 * 8 * SCALE);
        this.layerEntities.addChild(player);
        this.arrEntities.push(player);


        const block_door = new Entity(Loader.shared.resources['block'].texture!, EntityType.BLOCK);
        block_door.visible = false
        block_door.scale.set(SCALE);
        block_door.position.set(11 * 8 * SCALE, 7 * 8 * SCALE);
        this.layerEntities.addChild(block_door);
        this.arrEntities.push(block_door);
        block_door.callback = () =>
        {
            DialogBox.getInstance().showText('You: "I should gather my equipment before heading out."')
        }

        const equipment = new Entity(Loader.shared.resources['equipment'].texture!, EntityType.ITEM);
        equipment.scale.set(SCALE);
        equipment.position.set(8 * 8 * SCALE, 9 * 8 * SCALE);
        this.layerEntities.addChild(equipment);
        this.arrEntities.push(equipment);
        equipment.visible = false;
        equipment.callback = () =>
        {

            // Get item
            UserData.equipment = 1
            this.layerEntities.removeChild(equipment)
            this.arrEntities.splice(this.arrEntities.indexOf(equipment), 1)

            // show message
            DialogBox.getInstance().showText('You: "Alright, now I\'m ready to give that evilsummoned what he deserves"')

            // Show exit
            const exit = new Entity(Loader.shared.resources['exit'].texture!, EntityType.ITEM);
            exit.scale.set(SCALE);
            exit.visible = false
            exit.position.set(11 * 8 * SCALE, 7 * 8 * SCALE);
            this.layerEntities.addChild(exit);
            this.arrEntities.push(exit);
            exit.callback = () =>
            {
                this.changeScene(new ParkingScene(), 2, 8)
            }

            // remove block door
            this.layerEntities.removeChild(block_door)
            this.arrEntities.splice(this.arrEntities.indexOf(block_door), 1)

        }

        const cleanHouse = new Entity(Loader.shared.resources['block'].texture!, EntityType.ITEM);
        cleanHouse.visible = false
        cleanHouse.scale.set(SCALE);
        cleanHouse.position.set(9 * 8 * SCALE, 7 * 8 * SCALE);
        this.layerEntities.addChild(cleanHouse);	
        this.arrEntities.push(cleanHouse);
        cleanHouse.callback = () =>
        {
            DialogBox.getInstance().showText('You: "Wow, I should clean up this dump someday."', () =>
            {
                // remove cleanHouse
                this.layerEntities.removeChild(cleanHouse)
                this.arrEntities.splice(this.arrEntities.indexOf(cleanHouse), 1)
            })
        }

        const array_blocks = [[4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [11, 4],
        [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10], [11, 10],
        [4, 5], [4, 6], [4, 7], [4, 8], [4, 9],
        [11, 5], [11, 6], [11, 8], [11, 9]
        ]

        for (let i = 0; i < array_blocks.length; i++)
        {
            const block = new Entity(Loader.shared.resources['block'].texture!, EntityType.BLOCK);
            block.scale.set(SCALE);
            block.position.set(array_blocks[i][0] * 8 * SCALE, array_blocks[i][1] * 8 * SCALE);
            this.layerEntities.addChild(block);
            block.visible = false
            this.arrEntities.push(block);
        }
        // Block the player for the intro scene
        UserData.canMove = false

        setTimeout(() =>
        {
            Sound.from(Loader.shared.resources['toctoc']).play();
        }, 3000);

        setTimeout(() =>
        {
            DialogBox.getInstance().showText('Knock knock!', () =>
            {
                setTimeout(() =>
                {
                    DialogBox.getInstance().showText('You: "..."', () =>
                    {
                        setTimeout(() =>
                        {
                            DialogBox.getInstance().showText('Familiar Voice: "Come on, I know you\'re there, I see your tin can with four wheels out here."', () =>
                            {
                                setTimeout(() =>
                                {
                                    DialogBox.getInstance().showText('You: (Damn it, I forgot to hide my car...)', () =>
                                    {
                                        setTimeout(() =>
                                        {
                                            DialogBox.getInstance().showText('Familiar Voice: "A summoning has appeared in the cemetery, might be the work of some kids. As a Second Grade Disaster Unsummoner, it\'s your responsibility to take care of it, and stop by the town first, there\'s been a bit of panic."', () =>
                                            {
                                                setTimeout(() =>
                                                {
                                                    DialogBox.getInstance().showText('You: (Geez, it\'s Thursday for heaven\'s sake, these little malevolent summoners don\'t know when to stop? I just want to finish my shift and get back home to play video games.)', () =>
                                                    {
                                                        setTimeout(() =>
                                                        {
                                                            DialogBox.getInstance().showText('Familiar Voice: "Alright, do as you please, it\'s going to be your responsibility if things get worse. I\'m heading home."', () =>
                                                            {
                                                                setTimeout(() =>
                                                                {
                                                                    DialogBox.getInstance().showText('You: "Damn it, I\'ll have to go deal with that stupid summoning. Can\'t forget to pick up my Equipment..."', () =>
                                                                    {
                                                                        UserData.canMove = true
                                                                        equipment.visible = true
                                                                    }
                                                                    );
                                                                }
                                                                    , 500);
                                                            }
                                                            );
                                                        }
                                                            , 500);
                                                    }
                                                    );
                                                }
                                                    , 500);
                                            }
                                            );
                                        }
                                            , 500);
                                    }
                                    );
                                }, 500);


                            });
                        }, 500);
                    });
                }, 2000);

            })
        }, 3000);

        this.addControl();
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

