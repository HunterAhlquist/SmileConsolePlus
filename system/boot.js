const vga = new SuperVGA(document.getElementById("color"), window.innerHeight * 0.9, window.innerHeight * 0.9);
const system = new SmileOS();
const cpu = new CPU(system);

document.addEventListener('visibilitychange', function() {
    if(document.hidden) {
        cpu.pause = true;
        vga.pause = true;
    }
    else {
        cpu.pause = false;
        vga.pause = false;
    }
});