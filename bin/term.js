class Term {
    termIn;
    termOutHistory = [];

    //shaders
    static;
    blueBorder;

    start() {
        this.termIn = "";
        this.static = vga.gpu.createKernel(function() {
            let random = Math.min(Math.random(), 0.05);
            return [random, random, random, 1];
        }).setOutput([vga.resolution.x, vga.resolution.y]);
        this.blueBorder = vga.gpu.createKernel(function(buffer, thickness, res) {
            let x = this.thread.x;
            let y = this.thread.y;
             if (y < thickness || y > res - (thickness + 1)) {
                 return [0, 0, Math.max(Math.random(), 0.9), 1];
             }
            if (x < thickness || x > res - (thickness + 1)) {
                return [0, 0, Math.max(Math.random(), 0.9), 1];
            }
             return [buffer[x][y][0], buffer[x][y][1], buffer[x][y][2], buffer[x][y][3]];
        }).setOutput([vga.resolution.x, vga.resolution.y]);
        this.termOutHistory.push("test1");
        this.termOutHistory.push("test2");
        this.termOutHistory.push("test3");
        this.termOutHistory.push("test4");

        this.keyboardEvent.bind(this);
        document.addEventListener('keydown', this.keyboardEvent.bind(this));


    }
    update() {
        cpu.os
    }
    render() {
        vga.framebuffer = this.static();
        vga.framebuffer = this.blueBorder(vga.framebuffer, 4, vga.resolution.x);
        vga.textLayerContext.fillStyle = "white";
        for (let y=0; y < this.termOutHistory.length; y++) {
            vga.textLayerContext.fillText(this.termOutHistory[y], 4 * vga.pixelSizeX, y * vga.fontHeight + 4 * vga.pixelSizeX);
        }
        vga.textLayerContext.fillStyle = "yellow";
        vga.textLayerContext.fillText(this.termIn, 4 * vga.pixelSizeX,  (119 * vga.pixelSizeX));
    }
    keyboardEvent(e) {
        if (e.key.length < 2) this.termIn += e.key;
        if (e.key === "Backspace" && this.termIn.length > 0) this.termIn = this.termIn.substr(0, this.termIn.length - 1);
        if (e.key === "Enter" && this.termIn.length > 0) {
            this.runCommand(this.termIn);
            this.termIn = "";
        }
    }

    runCommand(command) {

    }
}