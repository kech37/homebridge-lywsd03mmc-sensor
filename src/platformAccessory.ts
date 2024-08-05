import { PlatformAccessory } from "homebridge";

import { MiLYWSD03MMCSensorPlatform } from "./platform.js";

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class MiLYWSD03MMCSensorAccessory {
  constructor(
    private readonly platform: MiLYWSD03MMCSensorPlatform,
    private readonly accessory: PlatformAccessory
  ) {
    // set accessory information
    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, "Xiaomi Mi")
      .setCharacteristic(this.platform.Characteristic.Model, "LYWSD03MMC")
      .setCharacteristic(
        this.platform.Characteristic.SerialNumber,
        "A4:C1:38:70:2A:60"
      );

    const temperatureService =
      this.accessory.getService("Temperature") ||
      this.accessory.addService(
        this.platform.Service.TemperatureSensor,
        "Temperature",
        "MiTemperatureUniqueIdentifier"
      );

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
