/**
 * @implements App
 */
class Netconf extends App {
    firstRun

    /**
     * Start fires on the first run of an app
     */
    start() {

    }

    /**
     * Update fires every "cpu cycle"
     */
    update() {

    }

    /**
     * The render function is where you apply any shaders to the frame buffer object
     */
    render(buffer) {
        let newBuffer = GFX.noiseShader();
        return GFX.drawRect(newBuffer, 2, [1,1,1,0.5], [1,0,0,0.25], 64, 120, 40, 20);
    }

    /**
     * Function that fires when the app is switched from the active app.
     * Disable any bound input here.
     */
    sleep() {

    }

    /**
     * Function that fires when the app is returned to the active app
     * Re-enable any bound input here.
     */
    wake() {

    }

    processParam(params) {
        return true;
    }
}

system.apps.set("net", new Netconf());