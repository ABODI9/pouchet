import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import {
  JwtPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Role,
} from '../models/auth.model';
import { Router } from '@angular/router';

const TOKEN_KEY = 'access_token';
const API = '/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token$ = new BehaviorSubject<string | null>(
    localStorage.getItem(TOKEN_KEY),
  );
  /** تغيّر التوكن (أو null) */
  readonly token$ = this._token$.asObservable();

  /** مستخدم مستنتج من التوكن */
  readonly user$: Observable<JwtPayload | null> = this.token$.pipe(
    map((t) => this.decode(t)),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  );

  /** الدور كمجرى مستقل */
  readonly role$: Observable<Role | null> = this.user$.pipe(
    map((u) => u?.role ?? null),
  );

  /** خصائص مريحة للمكونات */
  get token(): string | null {
    return this._token$.value;
  }
  get user(): JwtPayload | null {
    return this.decode(this.token);
  }
  get role(): Role | null {
    return this.user?.role ?? null;
  }
  get isAuthenticated(): boolean {
    return !!this.token && !this.isExpired(this.token);
  }

  login(email: string, password: string): Observable<void> {
    const body: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${API}/auth/login`, body).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.access_token);
        this._token$.next(res.access_token);
      }),
      map(() => void 0),
    );
  }

  register(dto: RegisterRequest): Observable<void> {
    return this.http
      .post<void>(`${API}/auth/register`, dto)
      .pipe(map(() => void 0));
  }

  me() {
    return this.http.get<{ userId: string; email: string; role: Role }>(
      `${API}/auth/me`,
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._token$.next(null);
    this.router.navigateByUrl('/login');
  }

  // ---- helpers ----
  private decode(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  private isExpired(token: string | null): boolean {
    const p = this.decode(token);
    if (!p?.exp) return false;
    return Date.now() >= p.exp * 1000;
  }
}
