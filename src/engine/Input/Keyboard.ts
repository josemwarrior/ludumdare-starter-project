export class Keyboard
{
    private static instance: Keyboard;
    public state: Map<string, boolean>;
    private pressedKeys: Set<string>;

    private constructor()
    {
        this.state = new Map<string, boolean>();
        this.pressedKeys = new Set<string>();
        this.setupListeners();
    }

    public static getInstance(): Keyboard
    {
        if (!Keyboard.instance)
        {
            Keyboard.instance = new Keyboard();
        }
        return Keyboard.instance;
    }

    private setupListeners()
    {
        document.addEventListener("keydown", this.isKeyDown.bind(this));
        document.addEventListener("keyup", this.isKeyUp.bind(this));
    }

    private isKeyDown(e: KeyboardEvent): void
    {
        this.state.set(e.code, true);
        if (!this.pressedKeys.has(e.code))
        {
            this.pressedKeys.add(e.code);
            this.handleKeyDownCallbacks(e.code);
        }
    }

    private isKeyUp(e: KeyboardEvent): void
    {
        this.state.set(e.code, false);
        this.pressedKeys.delete(e.code);
    }

    private handleKeyDownCallbacks(key: string): void
    {
        const callbacks = this.keyDownCallbacks.get(key) || [];
        callbacks.forEach(callback => callback());
    }

    private keyDownCallbacks: Map<string, (() => void)[]> = new Map();

    subscribe(key: string, callback: () => void): void
    {
        if (!this.keyDownCallbacks.has(key))
        {
            this.keyDownCallbacks.set(key, []);
        }
        this.keyDownCallbacks.get(key)?.push(callback);
    }

    public unSubscribe(key: string, callback: () => void): void
    {
        const callbacks = this.keyDownCallbacks.get(key) || [];
        const index = callbacks.indexOf(callback);
        if (index > -1)
        {
            callbacks.splice(index, 1);
        }
    }

    clear()
    {
        this.keyDownCallbacks.clear()
    }

}
