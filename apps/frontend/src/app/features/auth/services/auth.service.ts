import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';

import { HttpService } from '../../../core/services/http.service';
import { LoginRequest, RegisterRequest, RegisterResponse, TokenResponse } from '../../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'dru.auth.token';
  private readonly tokenState = signal<string | null>(this.restoreToken());

  constructor(
    private readonly http: HttpService,
    private readonly router: Router,
  ) {}

  login(credentials: LoginRequest) {
    return this.http.post<TokenResponse>('/auth/login', credentials).pipe(
      tap((response) => this.persistToken(response.access_token)),
      map(() => void 0),
    );
  }

  register(payload: RegisterRequest) {
    return this.http.post<RegisterResponse>('/auth/register', payload);
  }

  logout(): void {
    this.persistToken(null);
    this.router.navigate(['/auth']);
  }

  getToken(): string | null {
    return this.tokenState();
  }

  isAuthenticated(): boolean {
    return Boolean(this.tokenState());
  }

  private persistToken(token: string | null): void {
    this.tokenState.set(token);
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private restoreToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
