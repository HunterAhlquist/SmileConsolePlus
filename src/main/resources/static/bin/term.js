class Term extends App {
    termIn;
    termOutHistory = [];

    start() {
        this.termIn = "";
        Input.activateKeyboard(this.keyboardEvent.bind(this));
    }

    sleep() {
        Input.deactivateKeyboard(this.keyboardEvent.bind(this));
    }
    wake() {
        Input.activateKeyboard(this.keyboardEvent.bind(this));
    }
    update() {

    }
    render(buffer) {
        buffer = GFX.noiseShader(buffer);
        buffer = GFX.blueBorderShader(buffer, 4, SuperVGA.currentVGA.resolution.x);
        SuperVGA.currentVGA.textLayerContext.fillStyle = "white";
        for (let y=0; y < this.termOutHistory.length; y++) {
            SuperVGA.currentVGA.textLayerContext.fillText(
                this.termOutHistory[y], 4 * SuperVGA.currentVGA.pixelSizeX,
                y * SuperVGA.currentVGA.fontHeight + 4 * SuperVGA.currentVGA.pixelSizeX);
        }
        SuperVGA.currentVGA.textLayerContext.fillStyle = "yellow";
        SuperVGA.currentVGA.textLayerContext.fillText(this.termIn,
            4 * SuperVGA.currentVGA.pixelSizeX,
            (119 * SuperVGA.currentVGA.pixelSizeX));
        return buffer;
    }

    keyboardEvent(e) {
        if (e.key.length < 2) this.termIn += e.key;
        if (e.key === "Backspace" && this.termIn.length > 0) this.termIn = this.termIn.substr(0, this.termIn.length - 1);
        if (e.key === "Enter" && this.termIn.length > 0) {
            this.runCommand(this.termIn);
            this.termIn = "";
        }
    }

    clearHistory() {
        this.termOutHistory = [];
    }

    runCommand(command) {
        this.termOutHistory.push(command);
        if (command === "clear") {
            this.clearHistory();
            return;
        }
    }
}

system.apps.set("term", new Term());