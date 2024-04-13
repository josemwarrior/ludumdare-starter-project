export class Keyboard {

    private static instance: Keyboard;
    public state: Map<string, boolean>;
  
    private constructor() {
      this.state = new Map<string, boolean>();
      this.setupListeners();
    }
  
    public static getInstance(): Keyboard {
      if (!Keyboard.instance) {
        Keyboard.instance = new Keyboard();
      }
      return Keyboard.instance;
    }
  
    private setupListeners() {
      document.addEventListener("keydown", this.isKeyDown.bind(this));
      document.addEventListener("keyup", this.isKeyUp.bind(this));
    }
  
    private isKeyDown(e: KeyboardEvent): void {
      this.state.set(e.code, true);
    }
  
    private isKeyUp(e: KeyboardEvent): void {
      this.state.set(e.code, false);
    }

    subscribe(key: string, callback: () => void)
    {
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.code === key)
            {
                callback();
            }
        });
    }

  }
  