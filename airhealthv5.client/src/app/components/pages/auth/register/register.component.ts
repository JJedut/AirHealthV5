import { Component } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required],
      },
    );
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          this.successMessage = response?.message || 'Registration successful!';
          this.errorMessage = '';
        },
        (error) => {
          console.log('Error during registration:', error);
          this.successMessage = '';

          if (error.status === 409) {
            this.errorMessage = 'Username already exists.';
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid registration data.';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          }
        }
      );
    } else {
      this.successMessage = '';
      this.errorMessage = 'Form is invalid. Please check your inputs.';
    }
  }



  moveToLogin(): void {
    this.router.navigate(['login']);
  }
}
