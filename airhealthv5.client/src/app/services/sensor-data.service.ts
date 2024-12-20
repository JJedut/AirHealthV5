import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, Subscription, timer} from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SensorReadingModel } from '../models/SensorReadingModel';
import {environment} from "../../enviroments/enviroments";
import {PaginatedData} from "../models/DTO/PaginatedData";

@Injectable({
  providedIn: 'root'
})
export class SensorDataService implements OnDestroy {
  private apiUrl = `${environment.apiUrl}/SensorData`;
  private stopPolling$ = new Subject<void>();
  private subscription: Subscription | undefined;
  private sharedDataSource = new BehaviorSubject<SensorReadingModel[]>([]);
  sharedData$ = this.sharedDataSource.asObservable();

  constructor(private http: HttpClient) {}

  updateData(data: SensorReadingModel[]) {
    this.sharedDataSource.next(data);
  }

  getSensorData(deviceId: string | null, from?: Date, to?: Date): Observable<SensorReadingModel[][]> {
    let params = new HttpParams();

    if (from) {
      const fromUtc = new Date(from.getTime() - (from.getTimezoneOffset() * 60000));
      params = params.append('From', fromUtc.toISOString());
    }

    if (to) {
      const toUtc = new Date(to.getTime() - (to.getTimezoneOffset() * 60000));
      params = params.append('To', toUtc.toISOString());
    }

    if (deviceId) {
      params = params.append('DeviceId', deviceId);
    }

    return this.http.get<SensorReadingModel[][]>(`${this.apiUrl}/GetSensorData`, { params });
  }

  getSensorDataTable(
    deviceId: string | null,
    from: Date,
    to: Date,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedData> {
    let params = new HttpParams();
    const fromUtc = new Date(from.getTime() - (from.getTimezoneOffset() * 60000));
    const toUtc = new Date(to.getTime() - (to.getTimezoneOffset() * 60000));

    if (deviceId) {
      params = params
        .set('From', fromUtc.toISOString())
        .set('To', toUtc.toISOString())
        .set('DeviceId', deviceId)
        .set('PageSize', pageSize.toString())
        .set('PageNumber', pageNumber.toString());
    }

    return this.http.get<PaginatedData>(`${this.apiUrl}/GetSensorDataTable`, { params });
  }

  getLatestSensorReading(deviceId: string | null): Observable<SensorReadingModel> {
    let params = new HttpParams();
    if (deviceId) {
      params = params.append('DeviceId', deviceId);
    }

    console.log('DeviceId', deviceId)
    return this.http.get<SensorReadingModel>(`${this.apiUrl}/GetLatestSensorReading`, { params });
  }

  startPolling(deviceId: string | null): void {
    // Emit a new value every 30 seconds
    this.subscription = timer(0, 30000).pipe(
      switchMap(() => this.getLatestSensorReading(deviceId)),
      takeUntil(this.stopPolling$)
    ).subscribe(
      (data: SensorReadingModel) => {
        console.log('Latest Sensor Reading:', data);
      },
      error => {
        console.error('Error fetching sensor reading:', error);
      }
    );
  }

  stopPolling(): void {
    this.stopPolling$.next();
    this.subscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
