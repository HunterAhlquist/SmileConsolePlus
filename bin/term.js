class Term {
    termIn = "";
    termOutHistory = [];

    //shaders
    randomColors;

    start() {
        this.randomColors = vga.gpu.createKernel(function() {
            return [Math.random(), Math.random(), Math.random()];
        }).setOutput([vga.resolution.x, vga.resolution.y]);
    }
    update() {
        vga.framebuffer = this.randomColors();
    }
}