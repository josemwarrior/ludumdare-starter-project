import { Graphics, Rectangle, Sprite, Texture } from "pixi.js";

// class button for pixijs
export class Button extends Sprite 
{
    private textureIdle: Texture;
    private textureHover: Texture;
    private textureDown: Texture;
    private textureDisabled: Texture;
    private callback: Function;
    private isDown: boolean;
    private isOver: boolean;
    private btnMenu: boolean;
    private txtMenu: string;

    constructor(textures: [Texture, Texture, Texture, Texture?], x: number, y: number, xOffset: number, yOffset: number, width: number, height: number, callback?: Function, btnMenu?: boolean, txtMenu?: string) 
    {
        super(textures[0]);
        this.x = x;
        this.y = y;
        // this.width = width;
        // this.height = height;
        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = new Rectangle(xOffset, yOffset, width, height);
        this.on('pointerdown', this.onButtonDown);
        this.on('pointerup', this.onButtonUp);
        this.on('pointerupoutside', this.onButtonUp);
        this.on('pointerover', this.onButtonOver);
        this.on('pointerout', this.onButtonOut);
        this.textureIdle = textures[0];
        this.textureHover = textures[1];
        this.textureDown = textures[2];
        if (textures.length > 3) this.textureDisabled = textures[3]!;
        if (callback != undefined) this.callback = callback;
        if (btnMenu != undefined)
        {
            this.btnMenu = btnMenu;
            const graphics = new Graphics();
            graphics.lineStyle(3, 0xFFFFFF);
            graphics.beginFill(0x000000, 0);
            graphics.drawRect(width/-2, height/-2, width, height);
            graphics.endFill();
            this.addChild(graphics);
        }
        else
        {
            this.btnMenu = false;
        }
        if (this.txtMenu != undefined) this.txtMenu = txtMenu!;
        
    }

    onButtonOut(arg0: string, onButtonOut: any) 
    {
        this.isOver = false;
        if (this.isDown) 
        {
            return;
        }
        this.texture = this.textureIdle;
    }

    onButtonOver(arg0: string, onButtonOver: any) 
    {
        this.isOver = true;
        if (this.isDown) 
        {
            return;
        }
        this.texture = this.textureHover;
    }

    onButtonUp(arg0: string, onButtonUp: any) 
    {
        this.isDown = false;
        if (this.isOver) 
        {
            this.texture = this.textureHover;
        }
        else 
        {
            this.texture = this.textureIdle;
        }
        this.callback();
    }

    onButtonDown(): void 
    {
        this.isDown = true;
        this.alpha = 1;
        this.texture = this.textureDown;
    }

}
