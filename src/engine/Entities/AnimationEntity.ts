import { AnimatedSprite, Resource, Texture } from "pixi.js";
import IEntity, { EntityType } from "./IEntity";
import { SCALE } from "../../game/Cons";

export class AnimationEntity extends AnimatedSprite implements IEntity
{

    type: EntityType;
    private fps: number = .04;
    normalizedX: number;
    normalizedY: number;
    public callback?: () => void;

    constructor(frames: Texture<Resource>[], EntityType: EntityType, callback?: () => void)
    {
        super(frames);
        this.animationSpeed = this.fps;
        this.play();
        this.type = EntityType;
        
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
        super.update(delta);
        this.normalizedX = this.x / SCALE;
        this.normalizedY = this.y / SCALE;
    }

    EntityFrameChange(): void
    {
    }

}

