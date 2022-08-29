class Term extends App {
    borderSize = 4;
    indent = 3;
    consoleRect;
    inputRect;
    inputBuffer = "";

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
        document.addEventListener('keydown', (evt) => this.input(evt));
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
        document.removeEventListener('keydown', (evt) => this.input(evt));
    }

    /**
     * Function that fires when the app is returned to the active app
     * Re-enable any bound input here.
     */
    wake() {
        document.addEventListener('keydown', (evt) => this.input(evt));
    }

    executeInput(input) {
        this.consoleRect.text += input + "\r\n";
    }

    input(evt) {
        let char = evt.key
        if (char === "Backspace" &&
            this.inputBuffer.length > 0) {
            this.inputBuffer = this.inputBuffer.substring(0, this.inputBuffer.length-1);
            return;
        }
        if (char === "Enter") {
            this.executeInput(this.inputBuffer);
            this.inputBuffer = "";
            return;
        }
        if (char.length === 1) {
            this.inputBuffer += char;
        }
    }
}

system.apps.set("term", new Term());