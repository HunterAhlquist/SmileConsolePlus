

class SuperVGA {
    /**
     * @type {SuperVGA}
     */
    static currentVGA;
    /**
     * @type {boolean}
     */
    pause;

    //image layer
    /**
     * @type {HTMLCanvasElement}
     */
    colorDisplayArea;
    /**
     * @type {HTMLCanvasElement}
     */
    colorDisplay;
    /**
     * @type {WebGL2RenderingContext}
     */
    colorDisplayContext;
    /**
     * @type {number}
     */
    pixelSizeX;
    /**
     * @type {number}
     */
    pixelSizeY;

    //text layer
    /**
     * @type {HTMLCanvasElement}
     */
    textLayer;
    /**
     * @type {CanvasRenderingContext2D}
     */
    textLayerContext;
    /**
     * @type {{width: number, height: number}}
     */
    textAreaSize;
    //?
    canvasTxtController;

    //parameters
    /**
     * @type {number}
     */
    refreshRate;
    /**
     * @type {{x: number, y: number}}
     */
    resolution;

    //output color
    /**
     * @type {[number[4],number[4]]}
     */
    framebuffer;

    gpu;
    /**
     * @type {function}
     */
    rasterizer;
    /**
     * @type {function}
     */
    blank;
    /**
     * @type {Map<App, TextLayer[]>}
     */
    textBuffer;

    /**
     *
     * @param canvas {HTMLCanvasElement}
     * @param sizeX {number}
     * @param sizeY {number}
     */
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
        this.canvasTxtController = window.canvasTxt.default;
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
            let x = Math.floor(this.thread.y / sizeX);
            let y = Math.floor(this.thread.x / sizeY);
            this.color(buffer[x][y][0], buffer[x][y][1], buffer[x][y][2], buffer[x][y][3]);
        }).setOutput([sizeX, sizeY]).setGraphical(true);

        //define mix functions
        this.gpu.addFunction(
            /**
             * Mix two colors together
             * @param fg {[number]} foreground color
             * @param bg {[number]} background color
             * @return {[number]} final color
             */
            function alphaBlend(fg, bg) {
                return [(bg[0] * (1-fg[3])) + (fg[0] * fg[3]),
                    (bg[1] * (1-fg[3])) + (fg[1] * fg[3]),
                    (bg[2] * (1-fg[3])) + (fg[2] * fg[3]),
                    bg[3] + fg[3]];
        });

        //create image canvas
        this.rasterizer(this.framebuffer, this.pixelSizeX, this.pixelSizeY);
        //noinspection JSUnresolvedVariable
        this.colorDisplay = this.rasterizer.canvas;
        this.colorDisplayArea.appendChild(this.colorDisplay);
        this.colorDisplayContext = this.colorDisplay.getContext('webgl2');

        //create text overlay canvas
        document.getElementById("text").innerHTML =
            "<canvas id='textCanvas' width='" + sizeX + "' height='" + sizeY + "'>";
        this.textLayer = document.getElementById("textCanvas");
        this.textLayerContext = this.textLayer.getContext('2d', { premultipliedAlpha: false });
        this.textLayerContext.fillStyle = "rgb(255,255,255)";

        requestAnimationFrame(this.renderLoop.bind(this));
    }

    renderLoop() {
        setTimeout(function () {
            if (!this.pause) {
                this.framebuffer = this.blank();
                this.framebuffer = system.render(this.framebuffer);
                this.rasterizer(this.framebuffer, this.pixelSizeX, this.pixelSizeY);
                this.textLayerContext.clearRect(0, 0, this.textLayer.width, this.textLayer.height);
                if (system !== undefined && system.activeApp !== undefined &&
                    this.textBuffer.has(system.activeApp)) {
                    for (let layer of this.textBuffer.get(system.activeApp)) {
                        this.drawText(layer);
                    }
                }
            }
            requestAnimationFrame(this.renderLoop.bind(this));
        }.bind(this), 1000 / this.refreshRate);
    }

    /**
     * Draw a text layer
     * @param layer {TextLayer}
     */
    drawText(layer) {
        this.canvasTxtController.font = layer.font;
        this.canvasTxtController.fontSize = layer.fontSize;
        this.canvasTxtController.align = layer.horizontalAlign;
        this.canvasTxtController.vAlign = layer.verticalAlign;
        this.textLayerContext.fillStyle = layer.fontColor;

        this.canvasTxtController.drawText(this.textLayerContext, layer.text,
            layer.posX * this.pixelSizeX,
            layer.posY * this.pixelSizeY,
            layer.sizeX * this.pixelSizeX,
            layer.sizeY * this.pixelSizeY);
    }
}

class TextLayer {
    /**
     * @type {string}
     */
    text = "New Text";
    /**
     * @type {string}
     */
    font = "c64";
    /**
     * @type {number}
     */
    fontSize = 12;
    /**
     * @type {string}
     */
    fontColor = "Yellow";
    /**
     * @type {string}
     */
    verticalAlign = "top";
    /**
     * @type {string}
     */
    horizontalAlign = "left";

    /**
     * @type {number}
     */
    posX;
    /**
     * @type {number}
     */
    posY;
    /**
     * @type {number}
     */
    sizeX;
    /**
     * @type {number}
     */
    sizeY;


    constructor(posX, posY, sizeX, sizeY) {
        this.posX = posX;
        this.posY = posY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
}

class CPU {
    /**
     * @type {SmileOS}
     */
    os;
    /**
     * @type {boolean}
     */
    pause;
    /**
     * @type {number}
     */
    static deltaTime = 0;
    /**
     * @type {number}
     */
    static uptime = 0;
    /**
     * @type {number}
     */
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

