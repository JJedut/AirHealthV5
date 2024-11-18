import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {UserModel} from "../models/UserModel";
import {Router} from "@angular/router";
import {LoginResponse} from "../models/LoginResponse";
import {environment} from "../../enviroments/enviroments";
import { jwtDecode } from "jwt-decode";
import {DeviceModel} from "../models/DeviceModel";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/Auth`;
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private deviceId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  getDeviceId(): string | null {
    return this.deviceId;
  }

  register(user: UserModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user)
  }

  login(userName: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { userName, password })
      .pipe(
        tap(res => {
          if (res) {
            localStorage.setItem('token', res.token);
            this.deviceId = res.deviceId;
            this.loggedInSubject.next(true);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.deviceId = null;
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAdmin() {
    const token = this.getToken();
    if (!token) {
      return '';
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.isAdmin || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string {
    const token = this.getToken();
    if (!token) {
      return '';
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  getUserName(): string {
    const token = this.getToken();
    if (!token) {
      return '';
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log('decodedToken: ',decodedToken)

      if (decodedToken.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;

    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
      return false;
    }
  }
}
