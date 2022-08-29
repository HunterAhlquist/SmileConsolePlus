//system.switchApp(system.apps.get("term"));

document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
        cpu.pause = true;
        vga.pause = true;
    } else {
        cpu.pause = false;
        vga.pause = false;
    }
});