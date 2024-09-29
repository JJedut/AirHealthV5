import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {SensorReadingModel} from "../models/SensorReadingModel";

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  private apiUrl = 'https://192.168.33.101:7096/api/SensorData'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  getSensorData(from?: Date, to?: Date): Observable<SensorReadingModel[]> {
    let params = new HttpParams();

    if (from) {
      const fromUtc = new Date(from.getTime() - (from.getTimezoneOffset() * 60000));
      params = params.append('From', fromUtc.toISOString());
    }

    if (to) {
      const toUtc = new Date(to.getTime() - (to.getTimezoneOffset() * 60000));
      params = params.append('To', toUtc.toISOString());
    }

    return this.http.get<SensorReadingModel[]>(`${this.apiUrl}/GetSensorData`, { params });
  }

}
