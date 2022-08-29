class ShellMan extends Demon {
    inputEvent

    start() {
        this.inputEvent = this.input.bind(this);
        document.addEventListener('keydown', this.inputEvent);
    }

    update() {

    }

    end() {
        system.apps.get("term").consoleRect.text += "You can't banish this demon.";
        document.removeEventListener('keydown', this.inputEvent);
        setTimeout(function() {
            system.runDemon("shellman");
        }, 1000);
    }

    processParam(params) {
        return true;
    }

    input(evt) {
        let key = evt.key;
        if (key ===  "Home" && !(system.activeApp instanceof Term)) {
            system.goHome();
        }
    }
}

system.demons.set("shellman", new ShellMan());