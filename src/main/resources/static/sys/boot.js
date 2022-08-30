class HardwareSettings {
    static physicalScreenScale = 0.9;
    static resX = 128;
    static resY = 128;
}

/**
 * @type {SuperVGA}
 */
const vga = new SuperVGA(document.getElementById("color"),
    750 * HardwareSettings.physicalScreenScale,
    750 * HardwareSettings.physicalScreenScale);
/**
 * @type {SmileOS}
 */
const system = new SmileOS();
/**
 * @type {CPU}
 */
const cpu = new CPU(system);
