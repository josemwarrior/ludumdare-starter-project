import { Container, InteractionEvent, Loader, Rectangle, Sprite, Texture } from "pixi.js";

export type SliderParams = {
  width?: number;
  height?: number;
  margin?: number;
  fillColor?: number;
  defaultValue?: number;
  max?: number;
  min?: number;
  bg_file?: string;
  onInit?: boolean;
  onChange?: (value: number, sliderValue: number) => void;
};

export class Slider extends Container {

  private bg: Sprite;
  private fg: Sprite;
  private thumb: Sprite;
  private isDown: boolean;
  private _value: number;
  private onChange: (value: number, sliderValue: number) => void;
  private _max: number;
  private _min: number;
  private _bgwidth: number;
  private _bgheight: number;


  constructor(params: SliderParams) {
    super();
    this.isDown = false;
    this._value = Math.min(params.defaultValue || 0, 1);
    this._max = params.max || 100;
    this._min = params.min || 0;
    this.onChange = params.onChange || (() => { });

    this._bgwidth = params.width || 100;
    this._bgheight = params.height || 100;

    const bg_file = params.bg_file || 'slider_fill';
    this.bg = new Sprite(Loader.shared.resources[bg_file].texture!);
    this.addChild(this.bg);
    this.bg.interactive = true;
    this.bg.buttonMode = true;
    this.bg.width = this._bgwidth;
    this.bg.height = this._bgheight;
    const margin = params.margin || 10;
    this.bg.hitArea = new Rectangle(-margin, -margin, this._bgwidth + (margin*2), this._bgheight + (margin*2) + margin);

    this.bg.on('pointerdown', this.onDown, this);
    this.bg.on('pointermove', this.onMove, this);
    this.bg.on('pointerup', this.onUp, this);
    this.bg.on('pointerupoutside', this.onUp, this);

    const transparent = params.fillColor === undefined;
    this.fg = new Sprite(Loader.shared.resources['slider_fill'].texture!);
    this.fg.tint = params.fillColor || 0x00FFFF;
    this.addChild(this.fg);
    this.fg.width = this._bgwidth;
    this.fg.height = this._bgheight;
    if (transparent) {
      this.fg.alpha = 0;
    }

    this.thumb = new Sprite(Loader.shared.resources['slider_thumb'].texture!);
    this.addChild(this.thumb);
    this.thumb.anchor.set(0.5, 0);

    this.update();

    if (params.onInit) this.updateResult();

  }

   public updateResult() {
    const result = Math.round(this._min + ( (this._max - this._min) * this.value ));
    this.onChange(result, this.value);
  }

  onDown(e: InteractionEvent) {
    this.isDown = true;
    this.onMove(e); 
  }

  onMove(e: InteractionEvent) {
    if (!this.isDown) {
      return;
    }
    const x = e.data.getLocalPosition(this).x;
    this.value = x / this._bgwidth;
    this.updateResult();
  }

  onUp() {
    this.isDown = false;
  }

  update() {

    // try to fix the thumb position
    // trunc the width of the fg to the number of possible values
    const clamp = Math.round(this.value * this._max) / this._max;
    this.fg.width = clamp * this._bgwidth;
    this.thumb.position.set(this.fg.width, this.fg.height);
  }

  public get value() {
    return this._value;
  }

  public set value(val: number) {
    val = Math.min(Math.max(val, 0), 1);
    this._value = val;
    this.update();
  }
}
