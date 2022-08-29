class Kill extends App {
    start() {
        this.firstRun = false;
        system.goHome();
    }

    processParam(params) {
        if (params.length <= 0) {
            return false;
        }
        let name = params.shift();
        system.stopDemon(name);
        return true;
    }
}

system.apps.set("banish", new Kill());