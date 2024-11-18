import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {DeviceApiKeysComponent} from "../devices/device-api-keys/device-api-keys.component";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  protected readonly UserSettingsComponent = UserSettingsComponent;
  protected readonly DeviceApiKeysComponent = DeviceApiKeysComponent;
  currentComponent: any = UserSettingsComponent;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  loadComponent(component: any) {
    this.currentComponent = component;
  }

  deleteAccount() {
    if (this.isAdmin) return;
    const userId = this.authService.getUserId();
    this.userService.deleteUser(userId).subscribe(
      response => {
        console.log('User deleted successfully');
        this.authService.logout();
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }
}
