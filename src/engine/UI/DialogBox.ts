import { Container, Graphics, Loader, Sprite, Text, TextStyle } from "pixi.js"
import { SCALE } from "../../game/Cons"
import { Easing, Tween } from "tweedle.js"

export default class DialogBox extends Container
{

    private static instance: DialogBox
    private dialogBox: Graphics
    private showedDialog: boolean = false
    private wordWrapWidth: number = 92 * SCALE
    private styleDialog: TextStyle
    private lineHeigth: number = 8 * SCALE
    private textLines: string[] = []
    private intervalCharacter: number = 50
    private textDialog: Text
    private lineEnded: boolean = false
    private endDialog: Sprite
    private twnEndDialog: Tween<Sprite>

    private constructor()
    {
        super()

        this.dialogBox = new Graphics()
        this.dialogBox.beginFill(0x000000)
        this.dialogBox.drawRect(0, 0, 104 * SCALE, 19 * SCALE)
        this.dialogBox.endFill()
        this.dialogBox.position.set(12 * SCALE, 97 * SCALE)
        this.addChild(this.dialogBox)

        this.dialogBox.visible = this.showedDialog

        this.styleDialog = new TextStyle({
            fontFamily: 'Bitsy',
            fontSize: 5 * SCALE,
            fill: 'white',
        })

        this.endDialog = new Sprite(Loader.shared.resources['end_dialog'].texture!)
        this.endDialog.scale.set(SCALE)
        this.endDialog.position.set(107 * SCALE, 111 * SCALE)
        this.addChild(this.endDialog)
        this.endDialog.alpha = 0

    }

    public static getInstance(): DialogBox
    {
        if (!DialogBox.instance)
        {
            DialogBox.instance = new DialogBox()
        }
        return DialogBox.instance
    }

    public showText(text: string): void
    {
        if (this.showedDialog)
        {
            return
        }
        this.lineEnded = false
        this.calculateTextLines(text)
        this.showDialog()
        this.printAnimationText()
    }

    public isShowedDialog(): boolean
    {
        return this.showedDialog
    }

    public speedUpText(): void
    {
        this.intervalCharacter = 1
    }

    public showNextLines(): void
    {
        if (this.lineEnded)
        {
            this.lineEnded = false
            this.textLines.shift()
            this.textLines.shift()
            if (this.textLines.length == 0)
            {
                this.removeDialog()
            }
            else
            {
                this.printAnimationText()
            }
            
        }
    }
    
    private removeDialog()
    {
        this.showedDialog = false
        this.dialogBox.visible = this.showedDialog
        this.textLines = []
        this.textDialog.text = ''
        this.twnEndDialog?.stop()
        this.endDialog.alpha = 0
    }

    private printAnimationText()
    {
        this.intervalCharacter = 50
        this.twnEndDialog?.stop()
        this.endDialog.alpha = 0
        if (this.textDialog)
        {
            this.removeChild(this.textDialog)
        }
        const styleAnimation = new TextStyle({
            fontFamily: 'Bitsy',
            fontSize: 5 * SCALE,
            fill: 'white',
            wordWrap: true,
            wordWrapWidth: this.wordWrapWidth,
            lineHeight: this.lineHeigth
        })
        let text = this.textLines[0]
        text += (this.textLines[1]!=undefined) ? ' ' + this.textLines[1] : ''
        this.textDialog = new Text('', styleAnimation)
        this.textDialog.position.set(this.dialogBox.x + 4 * SCALE, this.dialogBox.y + 4 * SCALE)
        this.addChild(this.textDialog)
        this.printCharacters(this.textDialog, text)
    }

    private printCharacters(drawText: Text, text: string)
    {
        if (text.length > drawText.text.length)
        {
            drawText.text = text.substring(0, drawText.text.length + 1)
            setTimeout(() => this.printCharacters(drawText, text), this.intervalCharacter)

            // Wait for the action of the player
            if (drawText.text.length === text.length)
            {
                this.lineEnded = true
                this.twnEndDialog = new Tween(this.endDialog).to({ alpha: 1 }, 1).repeatDelay(500).easing(Easing.Linear.None).repeat(Infinity).yoyo(true).start();
            }
        }
    }

    private showDialog()
    {
        this.showedDialog = true
        this.dialogBox.visible = this.showedDialog
    }

    private calculateTextLines(text: string)
    {
        let words = text.split(' ')
        let skipSpace = true
        let space: string
        let textLine = ''
        let checkTextLine = new Text(textLine, this.styleDialog)


        for (let i = 0; i < words.length; i++)
        {
            if (skipSpace)
            {
                space = ''
                skipSpace = false
            }
            else
            {
                space = ' '
            }

            checkTextLine.text = textLine + space + words[i]
            const lineWidth = checkTextLine.width
            if (lineWidth > this.wordWrapWidth)
            {
                this.textLines.push(textLine)
                textLine = words[i]
            }
            else
            {
                textLine = checkTextLine.text
            }

            if (i === words.length - 1)
            {
                this.textLines.push(textLine)
            }
        }
    }

}