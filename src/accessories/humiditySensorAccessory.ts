import { MiLYWSD03MMCSensorPlatform } from '../platform.js';
import { PlatformAccessory } from 'homebridge';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class HumiditySensorAccessory {
  constructor(
    private readonly platform: MiLYWSD03MMCSensorPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    const humidityService =
      this.accessory.getService('Humidity') ||
      this.accessory
        .addService(this.platform.Service.HumiditySensor, 'Humidity')
        .setCharacteristic(
          this.platform.Characteristic.CurrentRelativeHumidity,
          0,
        );

    setInterval(() => {
      const randomHumi = Math.round(Math.random() * 100);
      humidityService.updateCharacteristic(
        this.platform.Characteristic.CurrentRelativeHumidity,
        randomHumi,
      );
      // this.platform.log.debug('Triggering Relative Humidity Updated:', randomHumi,);
    }, 3 * 1000);
  }
}
