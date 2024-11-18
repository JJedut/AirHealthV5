import { Injectable } from '@angular/core';
import {environment} from "../../enviroments/enviroments";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiKeyModel} from "../models/ApiKeyModel";

@Injectable({
  providedIn: 'root'
})
export class DeviceApiKeyService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  generateApiKey(userId: string, keyName: string): Observable<{ apiKey: string }> {
    return this.http.post<{ apiKey: string }>(`${this.apiUrl}/GenerateApiKey`, { userId, keyName })
  }

  getAllUserApiKeys(userId: string): Observable<ApiKeyModel[]> {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<ApiKeyModel[]>(`${this.apiUrl}/ApiKeys`, { params })
  }

  deleteDeviceApiKey(keyId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { keyId };

    return this.http.delete(`${this.apiUrl}/DeleteDeviceApiKey`, { headers, body });
  }
}
