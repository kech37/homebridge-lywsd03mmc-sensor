import noble, { Peripheral } from '@abandonware/noble';

import EventEmitter from 'events';
import { Logging } from 'homebridge';
import { buffer } from 'stream/consumers';

export class BluetoothService extends EventEmitter {
    private readonly log: Logging;

    private readonly address: string;

    constructor(log: Logging, address: string) {
        super();

        this.log = log;
        this.address = address;

        this.registerEvents();
    }

    registerEvents() {
        noble.on('discover', this.onDiscover.bind(this));
        noble.on('scanStart', this.onScanStart.bind(this));
        noble.on('scanStop', this.onScanStop.bind(this));
        noble.on('stateChange', this.onStateChange.bind(this));
        noble.on('error', (error: unknown) => this.log.error('error', error));
    }

    start() {
        this.log.debug('Start scanning.');
        try {
            noble.startScanning([], true);
        } catch (error) {
            this.emit('error', error);
        }
    }

    stop() {
        noble.stopScanning();
    }

    async onDiscover(peripheral: Peripheral): Promise<void> {
        // TODO
        if (peripheral.advertisement.localName === 'Bedroom Mi Sensor') {
            this.log.debug(
                `onDiscover: id=${peripheral.id}, advertisement.localName=${peripheral.advertisement.localName}, address=${peripheral.address}, connectable=${peripheral.connectable}`,
            );
            await this.onConnect(peripheral);
        }
    }

    async onConnect(peripheral: Peripheral): Promise<void> {
        await noble.stopScanningAsync();

        await peripheral.connectAsync();

        peripheral.once('disconnect', this.onDisconnect.bind(this));

        const services = await peripheral.discoverServicesAsync(['180a', 'ebe0ccb07a0a4b0c8a1a6ff2997da3a6']);
        this.log.debug('onConnect: services', services);

        for (const service of services) {
            const characteristics = await service.discoverCharacteristicsAsync([]);
            this.log.debug('onConnect: characteristics', characteristics);

            for (const characteristic of characteristics) {
                characteristic.on('data', (data: Buffer, isNotification: boolean) => {
                    this.log.debug('onConnect: data: ', data, isNotification);
                });
                await characteristic.readAsync();
            }
        }

        await peripheral.disconnectAsync();
    }

    onDisconnect() {
        this.log.debug(`Disconnected.`);
    }

    onScanStart(): void {
        this.log.debug('onScanStart');
    }

    onScanStop(): void {
        this.log.debug('onScanStop');
    }

    onStateChange(state: string): void {
        this.log.debug('onStateChange', state);
        if (state === 'poweredOn') {
            this.start();
        } else {
            this.log.info(`Stop scanning. (${state})`);
            this.stop();
        }
    }
}
