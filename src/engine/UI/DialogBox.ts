import { Container, Graphics, Text, TextStyle } from "pixi.js"
import { SCALE } from "../../game/Cons"

export default class DialogBox extends Container
{

    private static instance: DialogBox
    private dialogBox: Graphics
    private showedDialog: boolean = false
    private wordWrapWidth: number = 96 * SCALE
    private styleDialog: TextStyle
    private lineHeigth: number = 8 * SCALE
    private textLines: string[] = []
    private intervalCharacter: number = 50

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

        setTimeout(() => {
            this.intervalCharacter = 1
        }, 1000)
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
        this.calculateTextLines(text)
        this.showDialog()
        this.printAnimationText()
    }

    printAnimationText()
    {
        const styleAnimation = new TextStyle({
            fontFamily: 'Bitsy',
            fontSize: 5 * SCALE,
            fill: 'white',
            wordWrap: true,
            wordWrapWidth: this.wordWrapWidth,
            lineHeight: this.lineHeigth
        })
        const text = this.textLines[0] + ' ' + this.textLines[1]
        const drawText = new Text('', styleAnimation)
        drawText.position.set(this.dialogBox.x + 4 * SCALE, this.dialogBox.y + 4 * SCALE)
        this.addChild(drawText)
        this.printCharacters(drawText, text)
    }

    printCharacters(drawText: Text, text: string)
    {
        if (text.length > drawText.text.length)
        {
            drawText.text = text.substring(0, drawText.text.length + 1)
            setTimeout(() => this.printCharacters(drawText, text), this.intervalCharacter)
        }
    }

    private printLines()
    {
        const firstLine = new Text(this.textLines[0], this.styleDialog)
        firstLine.position.set(this.dialogBox.x + 4 * SCALE, this.dialogBox.y + 4 * SCALE)
        const secondLine = new Text(this.textLines[1], this.styleDialog)
        secondLine.position.set(this.dialogBox.x + 4 * SCALE, this.dialogBox.y + 4 * SCALE + this.lineHeigth)
        this.addChild(firstLine)
        this.addChild(secondLine)
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