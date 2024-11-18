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

const routes: Routes = [
  //{ path: '**', redirectTo: 'login' },
  { path: 'device/:id', component: DashBoardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'api-keys', component: DeviceApiKeysComponent},
  { path: 'header', component: HeaderComponent },
  { path: 'add-device', component: AddDeviceComponent },
  { path: 'device-list', component: DeviceListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
