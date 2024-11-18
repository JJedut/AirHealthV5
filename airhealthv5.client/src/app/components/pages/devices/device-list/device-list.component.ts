import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {DeviceService} from "../../../../services/device.service";
import {DeviceModel} from "../../../../models/DeviceModel";

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.scss'
})
export class DeviceListComponent implements OnInit {
  devices: DeviceModel[] = [];

  constructor(
    private authService: AuthService,
    private deviceService: DeviceService
  ) {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices(): void {
    const userId = this.authService.getUserId();
    this.deviceService.getDevicesByUserId(userId).subscribe({
      next: (devices) => {
        console.log('Devices:', devices)
        this.devices = devices;
      },
      error: (err) => console.error('Error fetching devices', err)
    });
  }

  deleteDevice(id: string): void {
    this.deviceService.deleteDevice(id).subscribe({
      next: () => {
        this.loadDevices();
        console.log('Device deleted successfully');
      },
      error: (error) => {
        console.error('Failed to delete device:', error);
      }
    });
  }
}
