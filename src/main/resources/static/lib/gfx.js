class GFX {
    /**
     * @type {function}
     * @return {[[number], [number]]}
     */
    static noiseShader = vga.gpu.createKernel(function() {
        let random = Math.min(Math.random(), 0.05);
        return [random, random, random, 1];
    }).setOutput([vga.resolution.x, vga.resolution.y]);

    /**
     * @type {function}
     */
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

    /**
     * @type {function}
     * @param buffer {[[number], [number]]}
     * @param thickness {number}
     * @param outlineColor {[number]}
     * @param bgColor {[number]}
     * @param posX {number}
     * @param posY {number}
     * @param sizeX {number}
     * @param sizeY {number}
     */
    static drawRect = vga.gpu.createKernel(
        /**
         *
         * @param buffer {[[number], [number]]}
         * @param thickness {number}
         * @param outlineColor {number[4]}
         * @param bgColor {number[4]}
         * @param posX {number}
         * @param posY {number}
         * @param sizeX {number}
         * @param sizeY {number}
         * @return {number[4]}
         */
        function(buffer, thickness, outlineColor, bgColor,
                 posX, posY, sizeX, sizeY){
            let bufferCol = buffer[this.thread.y][this.thread.x];
            let x = this.thread.x;
            let y = this.thread.y;
            if ((x >= posX - (thickness - 1) && x <= posX && y >= posY && y < posY + sizeY) ||
                (y >= posY - (thickness - 1) && y <= posY && x >= posX&& x < posX + sizeX) ||
                (x >= posX + (sizeX - thickness) && x < posX + sizeX && y >= posY && y < posY + sizeY) ||
                (y >= posY + (sizeY - thickness) && y < posY + sizeY && x >= posX && x < posX + sizeX) ||
                (y === posY-1 && x === posX-1)) {
                    return alphaBlend(outlineColor, bufferCol);
                } else if (x > posX && x < posX + sizeX && y > posY && y < posY + sizeY) {
                return alphaBlend(bgColor, bufferCol);
            }


            return bufferCol;
        }).setOutput([vga.resolution.x, vga.resolution.y]);
}