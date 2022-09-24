class GFX {

    static noiseShader = vga.gpu.createKernel(function() {
        let random = Math.min(Math.random(), 0.05);
        return [random, random, random, 1];
    }).setOutput([vga.resolution.x, vga.resolution.y]);

    static blueBorderShader = vga.gpu.createKernel(function(buffer, thickness, res) {
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

}