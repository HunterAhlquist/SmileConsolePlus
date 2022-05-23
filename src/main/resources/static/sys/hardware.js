class SuperVGA {
    static currentVGA;
    pause;

    //text layer
    textLayer;
    textLayerContext;
    fontSize;
    textAreaSize;
    fontHeight;
    charGridMode;

    //image layer
    colorDisplayArea;
    colorDisplay;
    pixelSizeX;
    pixelSizeY;

    //parameters
    refreshRate;
    resolution;

    //output
    framebuffer;
    gpu;
    rasterizer;
    blank;

    constructor(canvas, sizeX, sizeY) {
        SuperVGA.currentVGA = this;
        this.pause = false;

        this.colorDisplayArea = canvas;
        this.resolution = {
            x: HardwareSettings.resX,
            y: HardwareSettings.resY
        }
        this.textAreaSize = {width: this.resolution.x, height: this.resolution.y};
        this.refreshRate = 60;
        this.framebuffer = [[], []];
        for (let x=0; x < this.resolution.x; x++) {
            this.framebuffer[x] = [];
            this.framebuffer[x].length = this.resolution.x;
            for (let y=0; y < this.resolution.y; y++) {
                this.framebuffer[x][y] = [0, 0, 0, 1];
            }
        }
        this.pixelSizeX = sizeX / this.resolution.x;
        this.pixelSizeY = sizeY / this.resolution.y;
        this.gpu = new GPU();

        //create blank kernel
        this.blank = this.gpu.createKernel(function () {
            return [0, 0, 0, 1];
        }).setOutput([this.resolution.x, this.resolution.y]);

        //create rasterizer kernel
        this.rasterizer = this.gpu.createKernel(function (buffer, sizeX, sizeY) {
            let x = Math.floor(this.thread.x / sizeX);
            let y = Math.floor(this.thread.y / sizeY);
            this.color(buffer[x][y][0], buffer[x][y][1], buffer[x][y][2], buffer[x][y][3]);
        }).setOutput([sizeX, sizeY]).setGraphical(true);

        //create image canvas
        this.rasterizer(this.framebuffer, this.pixelSizeX, this.pixelSizeY);
        this.colorDisplay = this.rasterizer.canvas;
        this.colorDisplayArea.appendChild(this.colorDisplay);

        //create text overlay canvas
        document.getElementById("text").innerHTML =
            "<canvas id='textCanvas' width='" + sizeX + "' height='" + sizeY + "'>";
        this.textLayer = document.getElementById("textCanvas");
        this.textLayerContext = this.textLayer.getContext('2d');
        this.textLayerContext.fillStyle = "rgb(255,255,255)";
        this.fontSize = 5;
        this.textLayerContext.textBaseline = "top";

        setInterval(function() {
            if (this.pause) return;
            this.framebuffer = this.blank();
            this.textLayerContext.clearRect(0, 0, this.textLayer.width, this.textLayer.height);
            this.framebuffer = cpu.os.render(this.framebuffer);
            this.rasterizer(this.framebuffer, this.pixelSizeX, this.pixelSizeY);
            this.textLayerContext.font = this.fontSize * this.pixelSizeX + "px c64";
            this.fontHeight = this.fontSize * this.pixelSizeY;
        }.bind(this), 1000 / this.refreshRate);
    }

    RenderCharGrid(chars) {

    }

    getLines(ctx, text, maxWidth) {
        let words = text.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let word = words[i];
            let width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}

class CPU {
    os;
    pause;
    static deltaTime;

    constructor(os) {
        this.os = os;
        setInterval(this.execute.bind(this));
        this.pause = false;
    }

    execute() {
        if (this.pause) return;
        let preTime = Date.now();
        this.os.update();
        CPU.deltaTime = Date.now() - preTime;
    }
}

