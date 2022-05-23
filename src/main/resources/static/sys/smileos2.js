class SmileOS {
    static currentOS; //singleton in js, damn that's ridiculous.

    version = "2.0";
    apps;
    activeApp; //map <string, app>

    constructor() {
        SmileOS.currentOS = this;
        this.apps = new Map();
    }

    update() {
        if (this.activeApp != null) this.activeApp.update();
    }

    render(buffer) {
        if (this.activeApp != null) return this.activeApp.render(buffer);
    }

    switchApp(app) {
        if (this.activeApp != null) this.activeApp.sleep();
        this.activeApp = app;
        if (app.firstRun === true) {
            this.activeApp.start();
            this.activeApp.firstRun = false;
        } else {
            this.activeApp.wake();
        }
    }


}

class App {
    firstRun = true;

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

