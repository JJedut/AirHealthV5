import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {DeviceService} from "../../../../services/device.service";
import {DeviceModel} from "../../../../models/DeviceModel";
import {Thresholds} from "../../../../models/Thresholds";

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
  threshold!: Thresholds;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private deviceService: DeviceService,
  ) {}

  ngOnInit() {
    this.initForm();

    this.deviceService.devices$.subscribe((devices: DeviceModel[]) => {
      this.devices = devices;

      if (this.devices.length > 0) {
        this.selectDevice(this.devices[0]);
      }
    });
  }

  selectDevice(device: DeviceModel) {
    this.selectedDevice = device;
    this.threshold = this.selectedDevice.thresholds;
    console.log('threshold',this.threshold);
    this.loadThresholdsToForm();
  }

  initForm() {
    this.thresholdForm = this.fb.group({
      temperatureMin: [null],
      humidityMin: [null],
      pressureMin: [null],
      gasResistanceMin: [null],
      mqTwoMin: [null],
      pm1Min: [null],
      pm25Min: [null],
      pm10Min: [null],

      temperatureMax: [null],
      humidityMax: [null],
      pressureMax: [null],
      gasResistanceMax: [null],
      mqTwoMax: [null],
      pm1Max: [null],
      pm25Max: [null],
      pm10Max: [null],

      temperatureMinCritical: [null],
      humidityMinCritical: [null],
      pressureMinCritical: [null],
      gasResistanceMinCritical: [null],
      mqTwoMinCritical: [null],
      pm1MinCritical: [null],
      pm25MinCritical: [null],
      pm10MinCritical: [null],

      temperatureMaxCritical: [null],
      humidityMaxCritical: [null],
      pressureMaxCritical: [null],
      gasResistanceMaxCritical: [null],
      mqTwoMaxCritical: [null],
      pm1MaxCritical: [null],
      pm25MaxCritical: [null],
      pm10MaxCritical: [null],
    });
  }

  loadThresholdsToForm() {
    if (this.threshold) {
      this.thresholdForm.patchValue({
        temperatureMin: this.threshold.temperatureMin ?? null,
        humidityMin: this.threshold.humidityMin ?? null,
        pressureMin: this.threshold.pressureMin ?? null,
        gasResistanceMin: this.threshold.gasResistanceMin ?? null,
        mqTwoMin: this.threshold.mqTwoMin ?? null,
        pm1Min: this.threshold.pm1Min ?? null,
        pm25Min: this.threshold.pm25Min ?? null,
        pm10Min: this.threshold.pm10Min ?? null,

        temperatureMax: this.threshold.temperatureMax ?? null,
        humidityMax: this.threshold.humidityMax ?? null,
        pressureMax: this.threshold.pressureMax ?? null,
        gasResistanceMax: this.threshold.gasResistanceMax ?? null,
        mqTwoMax: this.threshold.mqTwoMax ?? null,
        pm1Max: this.threshold.pm1Max ?? null,
        pm25Max: this.threshold.pm25Max ?? null,
        pm10Max: this.threshold.pm10Max ?? null,

        temperatureMinCritical: this.threshold.temperatureMinCritical ?? null,
        humidityMinCritical: this.threshold.humidityMinCritical ?? null,
        pressureMinCritical: this.threshold.pressureMinCritical ?? null,
        gasResistanceMinCritical: this.threshold.gasResistanceMinCritical ?? null,
        mqTwoMinCritical: this.threshold.mqTwoMinCritical ?? null,
        pm1MinCritical: this.threshold.pm1MinCritical ?? null,
        pm25MinCritical: this.threshold.pm25MinCritical ?? null,
        pm10MinCritical: this.threshold.pm10MinCritical ?? null,

        temperatureMaxCritical: this.threshold.temperatureMaxCritical ?? null,
        humidityMaxCritical: this.threshold.humidityMaxCritical ?? null,
        pressureMaxCritical: this.threshold.pressureMaxCritical ?? null,
        gasResistanceMaxCritical: this.threshold.gasResistanceMaxCritical ?? null,
        mqTwoMaxCritical: this.threshold.mqTwoMaxCritical ?? null,
        pm1MaxCritical: this.threshold.pm1MaxCritical ?? null,
        pm25MaxCritical: this.threshold.pm25MaxCritical ?? null,
        pm10MaxCritical: this.threshold.pm10MaxCritical ?? null,
      });
    }
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

  onSubmit() {
    if (this.thresholdForm.invalid) return;

    const deviceId: string = this.selectedDevice.deviceId;

    this.deviceService.setThresholds(deviceId, this.thresholdForm.value).subscribe({
      next: () => {
        this.message = 'Success';
        this.loadDevices();
      },
      error: (error) => {
        this.message = 'error';
      }
    })
  }

  onReset() {
    this.thresholdForm.reset();
  }
}
