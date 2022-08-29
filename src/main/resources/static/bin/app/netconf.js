class Netconf extends App {
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
    render() {

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
}

system.apps.set("net", new Netconf());