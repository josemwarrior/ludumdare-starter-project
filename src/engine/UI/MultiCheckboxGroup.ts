import { Container, Loader, Rectangle, Resource, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Direction } from "../../game/Cons";

export class MultiCheckboxGroup extends Container
{
    private checkboxList: Checkbox[] = [];
    private callback: Function;
    private selected: number[] = [];
    private isMultiSelect: boolean;

    constructor(x: number, y: number, separation: number, direction: number, labels: string[], defaultSelection: number[], callback: Function, style: TextStyle, atLeastOne: boolean = false) 
    {
        super();
        this.x = x;
        this.y = y;
        this.callback = callback;
        this.isMultiSelect = true;
        this.selected = defaultSelection;
        labels.forEach((label, index) =>    
        {
            const checkbox = new Checkbox(20, label, style);
            if (direction == Direction.HORIZONTAL) checkbox.x = index * separation;
            else
            {
                checkbox.y = index * separation + this.y;
            }
            this.checkboxList.push(checkbox);
        });

        this.addChild(...this.checkboxList);
        this.checkboxList.forEach((checkbox, index) => 
        {
            checkbox.on('pointerdown', () => 
            {
                if (this.isMultiSelect)
                {
                    const selectedIndex = this.selected.indexOf(index);
                    if (selectedIndex >= 0)
                    {
                        if (atLeastOne && this.selected.length == 1) return;
                        this.selected.splice(selectedIndex, 1);
                        this.callback(this.selected);
                        checkbox.deselect();
                    } else
                    {
                        this.selected.push(index);
                        this.callback(this.selected);
                        checkbox.select();
                    }
                } else
                {
                    this.selected = [index];
                    this.callback(index);
                    checkbox.select();
                    // deselect all other checkboxes
                    this.checkboxList.forEach((c, i) =>
                    {
                        if (i != index) c.deselect();
                    });
                }
            });
        });
        if (this.selected.length > 0) this.selected.forEach(index => this.checkboxList[index].select());

        this.callback(this.selected);
    }

    getSelected(): number[]
    {
        return this.selected;
    }

    setSelected(index: number[]): void
    {
        this.selected = index;
        // deselect all checkboxes
        this.checkboxList.forEach(c => c.deselect());
        // select the ones in the index array
        index.forEach(i => this.checkboxList[i].select());
        this.callback(index);
    }

}

export class Checkbox extends Sprite
{
    private textureIdle: Texture<Resource>;
    private textureSelected: Texture<Resource>;
    private isSelected: boolean = false;
    private text: Text;

    constructor(offset: number, label: string, style: TextStyle)
    {
        super(Loader.shared.resources["checkbox_unchecked"].texture!);
        this.interactive = true;
        this.buttonMode = true;
        this.hitArea = new Rectangle(-offset, -offset * 3, this.texture.width + (offset * 2), this.texture.height + (offset * 2));
        this.textureIdle = this.texture;
        this.textureSelected = Loader.shared.resources["checkbox_checked"].texture!;
        this.text = new Text(label, style);
        this.text.x = this.texture.width + 20;
        this.addChild(this.text);
        this.anchor.set(0, 1);
        this.y = this.texture.height;
        this.text.y = - this.texture.height;
    }

    select(): void
    {
        this.isSelected = true;
        this.texture = this.textureSelected;
    }

    deselect(): void
    {
        this.isSelected = false;
        this.texture = this.textureIdle;
    }
}
