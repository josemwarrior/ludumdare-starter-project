import { Container, Graphics, Rectangle, Text, TextStyle, Texture } from "pixi.js";

// class button for pixijs
export class MenuButton extends Container {

    private callback: Function;
    private isDown: boolean;
    private isOver: boolean;
    private txtMenu: Text;
    private fill: Graphics;
    private circle: Graphics;
    

    constructor(txtMenu: string, offset: number, x: number, y: number, callback?: Function, fontSize: number = 22) {
        super();

        this.x = x;
        this.y = y;

        const style = new TextStyle({
            fontFamily: 'Inter',
            fontSize: fontSize,
            fontStyle: 'normal',
            fill: "white",
            fontWeight: "900",
            align: 'center'
        });
        this.txtMenu = new Text(txtMenu, style);

        this.addChild(this.txtMenu);

        // this.width = width;
        // this.height = height;
        this.interactive = true;
        this.buttonMode = true;
        this.isDown = false;
        
        const virtualWidth = this.txtMenu.width + (offset * 2);
        const virtualHeight = this.txtMenu.height + (offset * 2);

        this.hitArea = new Rectangle(-offset, -offset, virtualWidth, virtualHeight);
        this.on('pointerdown', this.onButtonDown);
        this.on('pointerup', this.onButtonUp);
        this.on('pointerupoutside', this.onButtonUp);
        this.on('pointerover', this.onButtonOver);
        this.on('pointerout', this.onButtonOut);
        if (callback != undefined) this.callback = callback;

        const graphics = new Graphics();
        graphics.lineStyle(3, 0xFFFFFF);
        graphics.beginFill(0x000000, 0);
        graphics.drawRect(-offset, -offset, virtualWidth, virtualHeight);
        graphics.endFill();
        this.addChild(graphics);

        const fill = new Graphics();
        fill.beginFill(0xFFFFFF);
        fill.drawRect(-offset, -offset, virtualWidth, virtualHeight);
        fill.endFill();
        fill.alpha = 0;
        this.fill = fill;
        this.addChild(this.fill);

        // copy the fill in a new graphic
        const maskForButton = new Graphics();
        maskForButton.beginFill(0xFFFFFF);
        maskForButton.drawRect(-offset, -offset, virtualWidth, virtualHeight);
        maskForButton.endFill();
        maskForButton.alpha = fill.alpha;
        this.addChild(maskForButton);

        // draw a circle of 70% of the half of the width for when the button is pressed
        const circle = new Graphics();
        circle.beginFill(0xFFFFFF);
        const radius = (virtualWidth * 0.70) / 2;
        circle.drawCircle(-offset + virtualWidth/2 , -offset + virtualHeight/2, radius);
        circle.endFill();
        circle.alpha = 0;
        this.circle = circle;
        this.circle.mask = maskForButton;
        this.addChild(this.circle);

    }

    onButtonOut(arg0: string, onButtonOut: any) {
        this.isOver = false;
        if (this.isDown) {
            return;
        }
        this.fill.alpha = 0;
        //this.texture = this.textureIdle;
    }

    onButtonOver(arg0: string, onButtonOver: any) {
        this.isOver = true;
        if (this.isDown) {
            return;
        }
        this.fill.alpha = 0.5;
        //this.texture = this.textureHover;
    }

    onButtonUp(arg0: string, onButtonUp: any) {
        this.isDown = false;
        if (this.isOver) {
            //this.texture = this.textureHover;
        }
        else {
            //this.texture = this.textureIdle;
        }
        this.alpha = 1;
        this.fill.alpha = 0;
        this.circle.alpha = 0;
        this.callback();
    }

    onButtonDown(): void {
        this.isDown = true;
        this.circle.alpha = 0.35;
        this.fill.alpha = 0;
    }

    //Change text of the button
    setText(text: string): void {
        this.txtMenu.text = text;
    }

}
