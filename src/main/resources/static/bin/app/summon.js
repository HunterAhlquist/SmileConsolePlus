/**
 * @implements App
 */
class Summon extends App {
    start() {
        this.firstRun = false;
        system.goHome();
    }

    processParam(params) {
        if (params.length <= 0) {
            return false;
        }
        let name = params.shift();
        system.runDemon(name);
        return true;
    }

    sleep() {
    }

    update() {
    }

    wake() {
    }

    render(buffer) {
        return undefined;
    }
}

system.apps.set("summon", new Summon());