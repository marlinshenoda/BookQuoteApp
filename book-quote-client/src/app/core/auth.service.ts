import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  token: string;
  userName: string;
}

const TOKEN_KEY = 'bookquote_token';
const USER_KEY = 'bookquote_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isLoggedIn = signal(!!localStorage.getItem(TOKEN_KEY));
  readonly userName = signal(localStorage.getItem(USER_KEY) ?? '');

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  register(userName: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
        userName,
        email,
        password
      })
      .pipe(tap((res) => this.persistSession(res)));
  }

  login(userName: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
        userName,
        password
      })
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.isLoggedIn.set(false);
    this.userName.set('');
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private persistSession(response: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, response.userName);
    this.isLoggedIn.set(true);
    this.userName.set(response.userName);
  }
}
