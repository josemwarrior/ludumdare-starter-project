import { DisplayObject } from "pixi.js";

export interface IScene extends DisplayObject 
{
    start(): void;
    
    update(framesPassed: number): void;

    resize(screenWidth: number, screenHeight: number): void;
}
