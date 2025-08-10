import { Component } from '@angular/core';
import {DeviceService} from "../../../../services/device.service";
import {AuthService} from "../../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeviceModel} from "../../../../models/DeviceModel";
import {AddDeviceModel} from "../../../../models/AddDeviceModel";

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.scss'
})
export class AddDeviceComponent {
  deviceForm!: FormGroup;
  addDeviceMessage: string = '';

  constructor(
    private deviceService: DeviceService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.deviceForm = this.fb.group({
      deviceName: ['', [Validators.required, Validators.minLength(3)]],
      apiKey: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      const newDevice: AddDeviceModel = {
        deviceName: this.deviceForm.value.deviceName,
        apiKey: this.deviceForm.value.apiKey,
        userId: this.authService.getUserId(),
      };

      this.deviceService.addDevice(newDevice).subscribe({
        next: (response) => {
          console.log('Device added successfully:', response);
          if (response) {
            this.deviceForm.reset();
            this.addDeviceMessage = 'Device added successfully.';
          } else {
            this.addDeviceMessage = 'API Key not found.';
          }
        },
        error: (err) => {
          console.error('Error adding device:', err);
        }
      });
    }
  }
}
