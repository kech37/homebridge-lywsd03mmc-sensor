import { PlatformAccessory } from "homebridge";

import { MiLYWSD03MMCSensorPlatform } from "../platform.js";

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class TemperatureSensorAccessory {
  constructor(
    private readonly platform: MiLYWSD03MMCSensorPlatform,
    private readonly accessory: PlatformAccessory
  ) {
    const temperatureService =
      this.accessory.getService("Temperature") ||
      this.accessory
        .addService(this.platform.Service.TemperatureSensor, "Temperature")
        .setCharacteristic(this.platform.Characteristic.CurrentTemperature, 0);

    setInterval(() => {
      const randomTemp = Math.round(1 + Math.random() * 36);
      temperatureService.updateCharacteristic(
        this.platform.Characteristic.CurrentTemperature,
        randomTemp
      );
      this.platform.log.debug("Triggering Temperature Updated:", randomTemp);
    }, 3 * 1000);
  }
}
