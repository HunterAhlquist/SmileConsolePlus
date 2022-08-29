class SmileOS {
    static currentOS; //singleton in js, damn that's ridiculous.
    version = "2.0";
    demons; //map <string, demon>
    apps; //map <string, app>
    activeApp;

    constructor() {
        SmileOS.currentOS = this;
        this.apps = new Map();
        this.demons = new Map();
        window.addEventListener("load", () => {
            this.switchApp(this.apps.get("term"));
        })
    }

    update() {
        if (this.activeApp != null) this.activeApp.update();
        for (let demon of this.demons.values()) {
            demon.update();
        }
    }

    render(buffer) {
        if (this.activeApp != null) return this.activeApp.render(buffer);
        else return buffer;
    }

    switchApp(app) {
        if (this.activeApp != null) {
            this.activeApp.sleep();
            //this.apps
        }
        this.activeApp = app;
        if (app.firstRun === true) {
            vga.textBuffer.set(app, []);
            this.activeApp.start();
            this.activeApp.firstRun = false;
        } else {
            this.activeApp.wake();
        }
    }

    runDemon() {

    }
    stopDemon() {

    }
}

/**
 * Background process, only one instance of the process can exist
 */
class Demon {

    start() {

    }

    update() {

    }

    end() {

    }
}

/**
 * Foreground process, only one instance of the process can exist
 */
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
