import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DeviceService} from "../../../services/device.service";
import {DeviceModel} from "../../../models/DeviceModel";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  userName: string = '';
  isUserLoggedIn: boolean = false;
  firstLatter: string = '';
  devices: DeviceModel[] = [];
  activeDeviceId: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    ) {}

  ngOnInit() {
    this.activeDeviceId = localStorage.getItem('activeDeviceId');

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.getUserName();
        this.getLatter();
        this.loadDevices();
      } else {
        this.userName = '';
        this.firstLatter = '';
        this.devices = [];
        localStorage.removeItem('activeDeviceId');
      }
    });

    this.deviceService.devices$.subscribe((devices: DeviceModel[]) => {
      this.devices = devices;
    })
  }

  checkLoginStatus() {
    this.isUserLoggedIn = this.authService.isLoggedIn();
  }

  getLatter() {
    this.firstLatter = Array.from(this.userName)[0];
  }

  getUserName() {
    this.userName = this.authService.getUserName()
  }

  logout() {
    this.authService.logout();
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement) {
    if (!targetElement.closest('.profile')) {
      this.isDropdownOpen = false;
    }
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  navigateToAddDevice() {
    this.router.navigate(['add-device']);
  }

  navigateToDevice(deviceId: string) {
    this.activeDeviceId = deviceId;
    localStorage.setItem('activeDeviceId', deviceId);
    this.router.navigate([`device/${deviceId}`]);
  }

  navigateToDeviceList() {
    this.router.navigate(['device-list']);
  }
}
