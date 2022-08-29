class Term extends App {
    borderSize = 4;
    indent = 3;
    consoleRect;
    inputRect;
    inputBuffer = "";
    charLimit = 25;

    inputEvent;

    /**
     * Start fires on the first run of an app
     */
    start() {
        this.consoleRect = new TextLayer(this.indent + this.borderSize,
            this.borderSize,
            vga.resolution.x - this.borderSize,
            (vga.resolution.y - this.borderSize) - 16);
        vga.textBuffer.get(this).push(this.consoleRect);
        this.consoleRect.fontSize = 22
        this.consoleRect.verticalAlign = "bottom";
        this.consoleRect.fontColor = "White";
        this.consoleRect.text = "";

        this.inputRect = new TextLayer(this.indent + this.borderSize,
            (vga.resolution.y - this.borderSize) - 8,
            vga.resolution.x - this.borderSize,
            8);
        this.inputRect.verticalAlign = "top";
        this.inputRect.fontSize = 22;
        this.inputRect.text = "";
        vga.textBuffer.get(this).push(this.inputRect);

        //input
        this.inputEvent = this.input.bind(this);
        document.addEventListener('keydown', this.inputEvent);
    }

    /**
     * Update fires every "cpu cycle"
     */
    update() {
        this.inputRect.text = "$>" + this.inputBuffer + ((Math.sin(CPU.uptime*10)) > 0 ? "_" : "");
    }

    /**
     * The render function is where you apply any shaders to the frame buffer object
     */
    render(buffer) {
        let result;
        result = GFX.noiseShader();
        return GFX.blueBorderShader(result, this.borderSize, vga.resolution.x);
    }

    /**
     * Function that fires when the app is switched from the active app.
     * Disable any bound input here.
     */
    sleep() {
        document.removeEventListener('keydown', this.inputEvent);
    }

    /**
     * Function that fires when the app is returned to the active app
     * Re-enable any bound input here.
     */
    wake() {
        document.addEventListener('keydown', this.inputEvent);
    }

    executeInput(input) {
        let splitCommand = this.inputBuffer.match(/(?:[^\s"']+|['"][^'"]*["'])+/g);
        let command = splitCommand.shift();
        if (system.apps.has(command)) {
            let app = system.apps.get(command);
            if (!app.processParam(splitCommand)) {
                this.consoleRect.text += input + ": incorrect parameters for command" + "\r\n";
                return;
            }
            system.switchApp(app);
            //this.consoleRect.text += input + "\r\n";
            return;
        }

        this.consoleRect.text += input + ": command not recognized" + "\r\n";
    }

    input(event) {
        let char = event.key
        if (char === "Backspace" &&
            this.inputBuffer.length > 0) {
            this.inputBuffer = this.inputBuffer.substring(0, this.inputBuffer.length-1);
            return;
        }
        if (char === "Enter" && this.inputBuffer.length > 0) {
            this.executeInput(this.inputBuffer);
            this.inputBuffer = "";
            return;
        }
        if (char.length === 1 && this.inputBuffer.length < this.charLimit) {
            this.inputBuffer += char;
        }
    }
}

system.apps.set("term", new Term());