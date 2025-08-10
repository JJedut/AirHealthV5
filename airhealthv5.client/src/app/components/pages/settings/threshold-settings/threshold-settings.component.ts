import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {DeviceService} from "../../../../services/device.service";
import {DeviceModel} from "../../../../models/DeviceModel";
import {ThresholdsModel, ThresholdsValue} from "../../../../models/Thresholds";
import {SensorDataService} from "../../../../services/sensor-data.service";
import {FormatKeyToTitle} from "../../../../utils/FormatKeyToTitle";

@Component({
  selector: 'app-threshold-settings',
  templateUrl: './threshold-settings.component.html',
  styleUrl: './threshold-settings.component.scss'
})
export class ThresholdSettingsComponent implements OnInit {
  thresholdForm!: FormGroup;
  devices: DeviceModel[] = [];
  selectedDevice!: DeviceModel;
  message: string = '';
  threshold!: ThresholdsModel;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private deviceService: DeviceService,
    private sensorDataService: SensorDataService
  ) {}

  ngOnInit() {
    this.loadDevices();

    this.deviceService.devices$.subscribe((devices: DeviceModel[]) => {
      this.devices = devices;
      if (this.devices.length > 0) {
        this.selectDevice(this.devices[0]);
      }
    });
  }

  selectDevice(device: DeviceModel) {
    this.message = '';
    this.selectedDevice = device;
    this.threshold = this.selectedDevice.thresholds ?? { sensorThresholds: {} };
    console.log('threshold',this.threshold);
    this.buildFormFromThresholds();
  }

  buildFormFromThresholds() {
    const group: { [key: string]: FormControl } = {};

    for (const [sensor, values] of Object.entries(this.threshold.sensorThresholds)) {
      group[`${sensor}_min`] = new FormControl(values.min ?? null);
      group[`${sensor}_max`] = new FormControl(values.max ?? null);
      group[`${sensor}_minCritical`] = new FormControl(values.minCritical ?? null);
      group[`${sensor}_maxCritical`] = new FormControl(values.maxCritical ?? null);
    }

    this.thresholdForm = new FormGroup(group);
  }

  buildThresholdsFromForm(): ThresholdsModel {
    const formValue = this.thresholdForm.value;
    const sensorThresholds: Record<string, ThresholdsValue> = {};

    // keys like "Temperature_min", "Humidity_maxCritical"
    Object.keys(formValue).forEach(key => {
      const [sensor, type] = key.split('_'); // e.g. "Temperature", "min"
      if (!sensorThresholds[sensor]) {
        sensorThresholds[sensor] = {};
      }

      // Map form control suffix to ThresholdsValue keys
      if (type === 'min') sensorThresholds[sensor].min = formValue[key];
      else if (type === 'max') sensorThresholds[sensor].max = formValue[key];
      else if (type === 'minCritical') sensorThresholds[sensor].minCritical = formValue[key];
      else if (type === 'maxCritical') sensorThresholds[sensor].maxCritical = formValue[key];
    });

    return { sensorThresholds };
  }

  loadDevices(): void {
    const userId = this.authService.getUserId();
    this.deviceService.getDevicesByUserId(userId).subscribe({
      next: (devices) => {
        this.devices = devices;
      },
      error: (err) => console.error('Error fetching devices', err)
    });
  }

  createDefaultThresholdsFromSensorData(sensorData: Record<string, any>): ThresholdsModel {
    const sensorThresholds: Record<string, ThresholdsValue> = {};

    Object.keys(sensorData).forEach(sensorKey => {
      sensorThresholds[sensorKey] = {
        min: null,
        max: null,
        minCritical: null,
        maxCritical: null,
      };
    });

    return { sensorThresholds };
  }

  createThresholdsFromLatestSensorData() {
    if (!this.selectedDevice || !this.selectedDevice.deviceId) {
      this.message = 'No device selected.';
      return;
    }

    this.sensorDataService.getLatestSensorReading(this.selectedDevice.deviceId).subscribe({
      next: (res) => {
        if (!res) {
          this.message = 'No sensor data found.';
          return;
        }

        const sensorData = res.sensorData;
        const newThresholds = this.createDefaultThresholdsFromSensorData(sensorData);

        this.deviceService.setThresholds(this.selectedDevice.deviceId, newThresholds).subscribe({
          next: () => {
            this.message = 'Thresholds created from latest sensor data keys.';
            this.selectedDevice.thresholds = newThresholds;
            this.threshold = newThresholds;
            this.buildFormFromThresholds();
          },
          error: (err) => {
            this.message = 'Failed to save thresholds.';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.message = 'Failed to get latest sensor data.';
        console.error(err);
      }
    });
  }

  getSensorKeys(): string[] {
    return Object.keys(this.threshold.sensorThresholds);
  }

  hasThresholds(): boolean {
    return !!this.threshold && Object.keys(this.threshold.sensorThresholds).length > 0;
  }

  onSubmit() {
    if (this.thresholdForm.invalid) return;

    const deviceId: string = this.selectedDevice.deviceId;
    const thresholdsToSave = this.buildThresholdsFromForm();

    this.deviceService.setThresholds(deviceId, thresholdsToSave).subscribe({
      next: () => {
        this.message = 'Success';
        this.loadDevices();
      },
      error: (error) => {
        this.message = `Error: ${error.message}`;
      }
    })
  }

  onReset() {
    this.buildFormFromThresholds();
  }

  protected readonly FormatKeyToTitle = FormatKeyToTitle;
}
