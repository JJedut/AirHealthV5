import { Component } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserModel} from "../../../../models/UserModel";
import {DeviceService} from "../../../../services/device.service";
import {DeviceModel} from "../../../../models/DeviceModel";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private deviceService: DeviceService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.get('username')?.value,
        this.loginForm.get('password')?.value
      ).subscribe(
        () => {
          this.successMessage = 'Login successful!';
          this.router.navigate([`device/${this.authService.getDeviceId()}`]);
        },
        (error) => {
          this.successMessage = '';
          this.errorMessage = error.error || 'Login failed';
        }
      );
    }
  }

  moveToRegister() {
    this.router.navigate(['register']);
  }
}
