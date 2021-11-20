class SmileOS {
    version = "2.0";
    apps = [];
    activeApp;

    constructor() {
        this.activeApp = new Term();
        this.apps.push(this.activeApp);
        this.activeApp.start();
    }

    getLines(ctx, text, maxWidth) {
        let words = text.split(" ");
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let word = words[i];
            let width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
}
