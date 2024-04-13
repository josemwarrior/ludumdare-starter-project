import { Sprite, Resource, Texture } from "pixi.js";
import IEntity, { EntityType } from "./IEntity";
import { SCALE } from "../../game/Cons";

export class Entity extends Sprite implements IEntity
{

    type: EntityType;
    normalizedX: number;
    normalizedY: number;
    public callback?: () => void;

    constructor(texture: Texture, type: EntityType, callback?: () => void)
    {
        super(texture);
        this.type = type;
        this.callback = callback;
    }
    
    move(direction: number): void
    {
        switch (direction)
        {
            case 0:
                this.x -= 8 * SCALE;
                break;
            case 1:
                this.x += 8 * SCALE;
                break;
            case 2:
                this.y -= 8 * SCALE;
                break;
            case 3:
                this.y += 8 * SCALE;
                break;
        }
    }

    update(delta: number): void
    {
        this.normalizedX = this.x / SCALE;
        this.normalizedY = this.y / SCALE;
    }

}

