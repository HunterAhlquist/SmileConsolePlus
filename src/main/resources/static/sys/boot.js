class HardwareSettings {
    static physicalScreenScale = 0.9;
    static resX = 128;
    static resY = 128;
}

const vga = new SuperVGA(document.getElementById("color"),
    750 * HardwareSettings.physicalScreenScale,
    750 * HardwareSettings.physicalScreenScale);
const system = new SmileOS();
const cpu = new CPU(system);
