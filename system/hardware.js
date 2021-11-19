class SuperVGA {
    pause;

    canvasArea;

    refreshRate;
    resolution;
    framebuffer;

    pixelSizeX;
    pixelSizeY;

    gpu;
    render;

    constructor(canvas, sizeX, sizeY) {
        this.pause = false;

        this.canvasArea = canvas;
        this.resolution = {
            x: 64,
            y: 64
        }
        this.refreshRate = 60;
        this.canvas = canvas;
        this.framebuffer = [[], []];
        for (let x=0; x < this.resolution.x; x++) {
            this.framebuffer[x] = [];
            this.framebuffer[x].length = this.resolution.x;
            for (let y=0; y < this.resolution.y; y++) {
                this.framebuffer[x][y] = [Math.random(), Math.random(), Math.random()];
            }
        }
        this.pixelSizeX = sizeX / this.resolution.x;
        this.pixelSizeY = sizeY / this.resolution.y;
        this.gpu = new GPU();
        //create renderer kernel
        this.render = this.gpu.createKernel(function (buffer, sizeX, sizeY) {
            let x = Math.floor(this.thread.x / sizeX);
            let y = Math.floor(this.thread.y / sizeY);
            this.color(buffer[x][y][0], buffer[x][y][1], buffer[x][y][2], 1);
        }).setOutput([sizeX, sizeY]).setGraphical(true);

        setInterval(function() {
            if (vga.pause) return;
            vga.render(vga.framebuffer, vga.pixelSizeX, vga.pixelSizeY);
            vga.canvas.appendChild(vga.render.canvas);
        }, 1000 / this.refreshRate);
    }
}

class CPU {
    cache;
    pause;

    constructor(os) {
        this.cache = os;
        setInterval(this.execute);
        this.pause = false;
    }

    execute() {
        if (cpu.pause) return;
        cpu.cache.activeApp.update();
    }
}

