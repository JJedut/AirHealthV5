import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../services/auth.service";
import {UserService} from "../../../../services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent implements OnInit {
  userEditForm!: FormGroup;
  userId: string = '';
  userName: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userEditForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.userEditForm.controls['username'].setValue(this.authService.getUserName());
  }

  deleteUser() {
    this.userService.deleteUser(this.userId).subscribe(
      response => {
        console.log('User deleted successfully');
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }

  onSubmit() {
    if (this.userEditForm.valid) {
      const newName = this.userEditForm.controls['username'].value;
      this.userService.updateUser(this.userId, newName).subscribe(
        response => {
          console.log('User updated successfully:', response);
        },
        error => {
          console.error('Error updating user:', error);
        }
      );
    }
  }
}
