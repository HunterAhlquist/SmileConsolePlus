class SmileOS {
    /**
     * @type {SmileOS}
     */
    static currentOS; //singleton in js, damn that's ridiculous.
    /**
     * @type {string}
     */
    version = "2.0";
    /**
     * @type {Map<string, Demon>}
     */
    demons; //map <string, demon>
    /**
     * @type {Map<string, App>}
     */
    apps; //map <string, app>
    /**
     * @type {App}
     */
    shellApp; //app
    /**
     * @type {App}
     */
    activeApp; //app

    constructor() {
        SmileOS.currentOS = this;
        this.apps = new Map();
        this.demons = new Map();
        window.addEventListener("load", () => {
            this.shellApp = this.apps.get("term");
            this.switchApp(this.shellApp);
            this.runDemon("shellman");
        })
    }

    goHome() {
        this.switchApp(this.shellApp);
    }

    update() {
        for (let demon of this.demons.values()) {
            demon.update();
        }
        if (this.activeApp != null) this.activeApp.update();
    }
    /**
     * The render function is where you apply any shaders to the frame buffer object
     * @param buffer {[[number], [number]]}
     * @return {[[number], [number]]}
     */
    render(buffer) {
        if (this.activeApp != null) {
            let newBuffer = this.activeApp.render(buffer);
            if (newBuffer === undefined || Util.isEmpty(newBuffer)) {
                return buffer;
            } else {
                return newBuffer;
            }
        }
        else return buffer;
    }

    /**
     *
     * @param app {App}
     */
    switchApp(app) {
        if (this.activeApp != null && this.activeApp.firstRun) {
            this.activeApp.sleep();
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

    /**
     *
     * @param name {string}
     */
    runDemon(name) {
        if (this.demons.has(name)) {
            let demon = this.demons.get(name);
            if (demon.active === false) { //first run
                demon.start();
                demon.active = true;
            }
        }
    }

    /**
     *
     * @param name {string}
     */
    stopDemon(name) {
        if (this.demons.has(name)) {
            let demon = this.demons.get(name);
            if (demon.active === true) {
                demon.end();
                demon.active = false;
            }
        }
    }
}

/**
 * Background process, only one instance of the process can exist
 */
class Demon {
    /**
     * @type {boolean}
     */
    active = false;

    /**
     * @interface Demon
     */
    start() {
        console.warn("Default start, please override all methods for demons.");
    }

    /**
     * @interface Demon
     */
    update() {
        console.warn("Default update, please override all methods for demons.");
    }

    /**
     * @interface Demon
     */
    end() {
        console.warn("Default end, please override all methods for demons.");
    }

    /**
     * Parameters to pass, returns true if valid
     * @param params {string[]}
     * @return {boolean}
     * @interface Demon
     */
    processParam(params) {
        console.warn("Default processParam, please override all methods for demons.");
        return true;
    }
}

/**
 * Foreground process, only one instance of the process can exist
 */
class App {
    /**
     * @type {boolean}
     */
    firstRun = true;

    /**
     * Start fires on the first run of an app
     * @interface App
     */
    start() {
        console.warn("Default start, please override all methods for apps.");
    }

    /**
     * Update fires every "cpu cycle"
     * @interface App
     */
    update() {
        console.warn("Default update, please override all methods for apps.");
    }

    /**
     * The render function is where you apply any shaders to the frame buffer object
     * @param buffer {[[number], [number]]}
     * @return {[[number], [number]]}
     * @interface App
     */
    render(buffer) {
        console.warn("Default render, please override all methods for apps.");
        return buffer;
    }

    /**
     * Function that fires when the app is switched from the active app.
     * Disable any bound input here.
     * @interface App
     */
    sleep() {
        console.warn("Default sleep, please override all methods for apps.");
    }

    /**
     * Function that fires when the app is returned to the active app
     * Re-enable any bound input here.
     * @interface App
     */
    wake() {
        console.warn("Default wake, please override all methods for apps.");
    }

    /**
     * Parameters to pass, returns true if valid
     * @param params {string[]}
     * @return {boolean}
     * @interface App
     */
    processParam(params) {
        console.warn("Default processParam, please override all methods for apps.");
        return true;
    }
}
