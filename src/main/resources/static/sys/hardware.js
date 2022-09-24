

class SuperVGA {
    static currentVGA;
    pause;

    //image layer
    colorDisplayArea;
    colorDisplay;
    pixelSizeX;
    pixelSizeY;

    //text layer
    textLayer;
    textLayerContext;
    textAreaSize;
    canvasTxt;

    //parameters
    refreshRate;
    resolution;

    //output color
    framebuffer;
    gpu;
    rasterizer;
    blank;
    textBuffer;

    constructor(canvas, sizeX, sizeY) {
        SuperVGA.currentVGA = this;
        this.pause = false;
        this.textBuffer = new Map();

        this.colorDisplayArea = canvas;
        this.resolution = {
            x: HardwareSettings.resX,
            y: HardwareSettings.resY
        }
        this.textAreaSize = {width: this.resolution.x, height: this.resolution.y};
        this.canvasTxt = window.canvasTxt.default;
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
        this.context = this.colorDisplay.getContext('webgl2');

        //create text overlay canvas
        document.getElementById("text").innerHTML =
            "<canvas id='textCanvas' width='" + sizeX + "' height='" + sizeY + "'>";
        this.textLayer = document.getElementById("textCanvas");
        this.textLayerContext = this.textLayer.getContext('2d', { premultipliedAlpha: false });
        this.textLayerContext.fillStyle = "rgb(255,255,255)";

        requestAnimationFrame(this.renderLoop.bind(this));
    }

    renderLoop() {
        if (this.pause) return;
        setTimeout(function () {
            this.framebuffer = this.blank();
            this.framebuffer = system.render(this.framebuffer);
            this.rasterizer(this.framebuffer, this.pixelSizeX, this.pixelSizeY);
            this.textLayerContext.clearRect(0, 0, this.textLayer.width, this.textLayer.height);
            if (system !== undefined && system.activeApp !== undefined) {
                for (let layer of this.textBuffer.get(system.activeApp)) {
                    this.drawText(layer);
                }
            }
            requestAnimationFrame(this.renderLoop.bind(this));
        }.bind(this), 1000 / this.refreshRate);
    }

    drawText(layer) {
        this.canvasTxt.font = layer.font;
        this.canvasTxt.fontSize = layer.fontSize;
        this.canvasTxt.align = layer.horizontalAlign;
        this.canvasTxt.vAlign = layer.verticalAlign;
        this.textLayerContext.fillStyle = layer.fontColor;

        this.canvasTxt.drawText(this.textLayerContext, layer.text,
            layer.posX * this.pixelSizeX,
            layer.posY * this.pixelSizeY,
            layer.sizeX * this.pixelSizeX,
            layer.sizeY * this.pixelSizeY);
    }
}

class TextLayer {
    text = "New Text";
    font = "c64";
    fontSize = 12;
    fontColor = "Yellow";
    verticalAlign = "top";
    horizontalAlign = "left";

    posX;
    posY;
    sizeX;
    sizeY;


    constructor(posX, posY, sizeX, sizeY) {
        this.posX = posX;
        this.posY = posY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
}

class CPU {
    os;
    pause;
    static deltaTime = 0;
    static uptime = 0;
    static startTime = Date.now() / 1000;

    constructor(os) {
        this.os = os;
        setInterval(this.execute.bind(this), 0);
        this.pause = false;
    }

    execute() {
        if (this.pause) return;
        let preTime = Date.now();
        this.os.update();
        CPU.deltaTime = Math.abs(Date.now() - preTime);
        CPU.uptime = (Date.now() / 1000) - CPU.startTime;
    }
}

class Storage {

}

