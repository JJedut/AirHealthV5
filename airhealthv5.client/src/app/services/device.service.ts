import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../enviroments/enviroments";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {DeviceModel} from "../models/DeviceModel";
import {AuthService} from "./auth.service";
import {ThresholdsModel} from "../models/Thresholds";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = `${environment.apiUrl}/Device`;
  private devicesSubject = new BehaviorSubject<DeviceModel[]>([]);
  private currentDeviceSubject = new BehaviorSubject<DeviceModel | null>(null);
  private currentDeviceid: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  get currentDevice$(): Observable<DeviceModel | null> {
    return this.currentDeviceSubject.asObservable();
  }

  get devices$(): Observable<DeviceModel[]> {
    return this.devicesSubject.asObservable();
  }

  get currentDeviceId(): string | null {
    return this.currentDeviceid || localStorage.getItem('activeDeviceId');
  }

  set currentDeviceId(deviceId: string) {
    this.currentDeviceid = deviceId;
  }

  updateDevices(devices: DeviceModel[]): void {
    this.devicesSubject.next(devices);
  }

  addDevice(command: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/Add`, command).pipe(
      tap((success) => {
        if (success) {
          const userId = this.authService.getUserId();
          this.getDevicesByUserId(userId).subscribe((devices) => {
            this.devicesSubject.next(devices);
          });
        }
      })
    );
  }

  getDevicesByUserId(userId: string): Observable<DeviceModel[]> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<DeviceModel[]>(`${this.apiUrl}/GetDevicesByUserId`, { params })
  }

  getDeviceById(deviceId: string): Observable<DeviceModel> {
    const params = new HttpParams()
      .set('deviceId', deviceId);
    return this.http.get<DeviceModel>(`${this.apiUrl}/GetDeviceById`, { params });
  }

  deleteDevice(deviceId: string): Observable<boolean> {
    const params = new HttpParams()
      .set('deviceId', deviceId);
    return this.http.delete<boolean>(`${this.apiUrl}/DeleteDevice`, { params }).pipe(
      tap((success) => {
        if (success) {
          const userId = this.authService.getUserId();
          this.getDevicesByUserId(userId).subscribe((devices) => {
            this.devicesSubject.next(devices);
          })
        }
      })
    );
  }

  saveSensorOrder(deviceId: string, sensorOrder: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/SaveSensorOrder`, {
      deviceId,
      sensorOrder,
    });
  }

  getSensorOrder(userId: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/GetSensorOrderByUserId/${userId}`);
  }

  setThresholds(deviceId: string, thresholds: ThresholdsModel): Observable<boolean> {
    const payload = {
      deviceId,
      ...thresholds,
    }
    return this.http.post<boolean>(`${this.apiUrl}/Thresholds`, payload)
  }

  getThresholdByDeviceId(deviceId: string): Observable<ThresholdsModel> {
    return this.http.get<ThresholdsModel>(`${this.apiUrl}/GetThresholdsByDeviceId/${deviceId}`);
  }
}
