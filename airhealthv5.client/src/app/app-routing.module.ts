import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashBoardComponent} from "./components/pages/dash-borad/dash-board.component";
import {SettingsComponent} from "./components/pages/settings/settings.component";
import {LoginComponent} from "./components/pages/auth/login/login.component";
import {RegisterComponent} from "./components/pages/auth/register/register.component";
import {DeviceApiKeysComponent} from "./components/pages/devices/device-api-keys/device-api-keys.component";
import {HeaderComponent} from "./components/pages/header/header.component";
import {AddDeviceComponent} from "./components/pages/devices/add-device/add-device.component";
import {DeviceListComponent} from "./components/pages/devices/device-list/device-list.component";
import {authGuard} from "./guards/auth.guard";

const routes: Routes = [
  { path: 'device/:id', component: DashBoardComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'api-keys', component: DeviceApiKeysComponent, canActivate: [authGuard] },
  { path: 'header', component: HeaderComponent },
  { path: 'add-device', component: AddDeviceComponent, canActivate: [authGuard] },
  { path: 'device-list', component: DeviceListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
