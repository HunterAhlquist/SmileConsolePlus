class SuperVGA {
    pause;

    colorDisplayArea;
    colorDisplay;

    textLayer;
    textLayerContext;
    fontSize;
    textAreaSize;
    fontHeight;

    refreshRate;
    resolution;
    framebuffer;

    pixelSizeX;
    pixelSizeY;

    gpu;
    render;
    blank;

    constructor(canvas, sizeX, sizeY) {
        this.pause = false;

        this.colorDisplayArea = canvas;
        this.resolution = {
            x: 128,
            y: 128
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

        //create renderer kernel
        this.render = this.gpu.createKernel(function (buffer, sizeX, sizeY) {
            let x = Math.floor(this.thread.x / sizeX);
            let y = Math.floor(this.thread.y / sizeY);
            this.color(buffer[x][y][0], buffer[x][y][1], buffer[x][y][2], buffer[x][y][3]);
        }).setOutput([sizeX, sizeY]).setGraphical(true);

        this.render(this.framebuffer, this.pixelSizeX, this.pixelSizeY);
        this.colorDisplay = this.render.canvas;
        this.colorDisplayArea.appendChild(this.colorDisplay);

        //create text overlay canvas
        document.getElementById("text").innerHTML = "<canvas id='textCanvas' width='" + sizeX + "' height='" + sizeY + "'>";
        this.textLayer = document.getElementById("textCanvas");
        this.textLayerContext = this.textLayer.getContext('2d');
        this.textLayerContext.fillStyle = "rgb(255,255,255)";
        this.fontSize = 5;
        this.textLayerContext.textBaseline = "top";

        setInterval(function() {
            if (this.pause) return;
            this.framebuffer = this.blank();
            this.textLayerContext.clearRect(0, 0, this.textLayer.width, this.textLayer.height);
            cpu.os.activeApp.render();
            this.render(this.framebuffer, this.pixelSizeX, this.pixelSizeY);
            this.textLayerContext.font = this.fontSize * this.pixelSizeX + "px c64";
            this.fontHeight = this.fontSize * this.pixelSizeY;


        }.bind(this), 1000 / this.refreshRate);
    }


}

class CPU {
    os;
    pause;

    constructor(os) {
        this.os = os;
        setInterval(this.execute.bind(this));
        this.pause = false;
    }

    execute() {
        if (this.pause) return;
        this.os.activeApp.update();
    }
}

