import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SensorChartComponent } from './components/ui-elements/sensor-chart/sensor-chart.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TuiArcChart, TuiAxes, TuiLineChart, TuiLineChartHint, TuiLineDaysChart} from "@taiga-ui/addon-charts";
import { SensorLatestReadingComponent } from './components/ui-elements/sensor-latest-reading/sensor-latest-reading.component';
import { DashBoardComponent } from './components/pages/dash-borad/dash-board.component';
import {MatFormField} from "@angular/material/form-field";
import {MatDatepickerToggle, MatDateRangeInput, MatDateRangePicker} from "@angular/material/datepicker";
import { HeaderComponent } from './components/pages/header/header.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import {TuiSegmented} from "@taiga-ui/kit";
import { LoginComponent } from './components/pages/auth/login/login.component';
import { RegisterComponent } from './components/pages/auth/register/register.component';
import {JwtInterceptor} from "./interceptors/jwt.interceptor";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import { DeviceApiKeysComponent } from './components/pages/devices/device-api-keys/device-api-keys.component';
import { DeviceListComponent } from './components/pages/devices/device-list/device-list.component';
import { AddDeviceComponent } from './components/pages/devices/add-device/add-device.component';
import { ButtonComponent } from './components/atoms/button/button.component';
import {NgOptimizedImage} from "@angular/common";
import { UserSettingsComponent } from './components/pages/settings/user-settings/user-settings.component';
import { CensorKeyPipe } from './pipes/censor-key.pipe';
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";
import { ChartComponent } from './components/ui-elements/sensor-chart/chart/chart.component';
import { ThresholdSettingsComponent } from './components/pages/settings/threshold-settings/threshold-settings.component';
import { TableComponent } from './components/ui-elements/sensor-chart/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    SensorChartComponent,
    SensorLatestReadingComponent,
    DashBoardComponent,
    HeaderComponent,
    SettingsComponent,
    LoginComponent,
    RegisterComponent,
    DeviceApiKeysComponent,
    DeviceListComponent,
    AddDeviceComponent,
    ButtonComponent,
    UserSettingsComponent,
    CensorKeyPipe,
    ChartComponent,
    ThresholdSettingsComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    TuiLineChart,
    TuiLineChartHint,
    TuiAxes,
    TuiArcChart,
    TuiLineDaysChart,
    MatFormField,
    MatDateRangeInput,
    MatDatepickerToggle,
    MatDateRangePicker,
    TuiSegmented,
    ReactiveFormsModule,
    NgOptimizedImage,
    CdkDropList,
    CdkDrag
  ],
  providers: [
    //{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
