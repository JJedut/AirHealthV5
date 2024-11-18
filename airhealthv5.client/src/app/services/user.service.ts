import { Injectable } from '@angular/core';
import {environment} from "../../enviroments/enviroments";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  updateUser(userId: string, userName: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateUser`, { userId, userName });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteUser`, {
      body: { userId },
    });
  }
}
