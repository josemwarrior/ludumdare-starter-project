import { Container, Graphics } from "pixi.js";
import { Easing, Group, Tween } from "tweedle.js";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../game/Cons";

export class Fade 
{
    rect: Graphics;

    constructor(Layer: Container)
    {
        const rect_fg = new Graphics();
        rect_fg.beginFill(0x000000);
        rect_fg.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        rect_fg.endFill();
        Layer.addChild(rect_fg);
        this.rect = rect_fg;
        this.rect.visible = false;
    }

    fadeIn(): void
    {
        this.rect.visible = true;
        this.rect.alpha = 1;
        new Tween(this.rect).to({ alpha: 0 }, 1000).easing(Easing.Linear.None).start().onComplete(() =>
        {
            this.rect.visible = false;
        });
    }

    fadeOut(): void
    {
        this.rect.visible = true;
        this.rect.alpha = 0;
        new Tween(this.rect).to({ alpha: 1 }, 1000).easing(Easing.Linear.None).start()
    }


    update(): void
    {
        Group.shared.update();
    }

}