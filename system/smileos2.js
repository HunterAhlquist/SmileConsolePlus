class SmileOS {
    version = "2.0";
    apps = [];
    activeApp;

    constructor() {
        this.activeApp = new Term();
        this.apps.push(this.activeApp);
        this.activeApp.start();
    }
}