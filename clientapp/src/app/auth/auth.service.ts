import { IUser } from "@app/_models/IUser"
import { BehaviorSubject, catchError, filter, flatMap, map, Observable, tap, throwError } from "rxjs"
import { Role } from "./auth.enum";
import { Injectable } from "@angular/core";
import { User } from "@app/_models";
import { transformError } from "@app/_helpers/common";
import { CacheService } from "./cache.service";
import { jwtDecode } from 'jwt-decode';

export interface IAuthStatus {
  isAuthenticated: boolean;
  userRole: Role;
  userId: string;
}

export interface IAuthService {
    readonly authStatus$: BehaviorSubject<IAuthStatus>
    readonly currentUser$: BehaviorSubject<IUser>
    login(username: string, password: string): Observable<void>
    logout(clearToken?: boolean): void
    getToken(): string
}

export interface IServerAuthResponse {
  accessToken: string;
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated : false,
  userRole: Role.None,
  userId: ''
}

@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());

  constructor() {
    super();
  }
  protected abstract authProvider(username: string, password: string): Observable<IServerAuthResponse>
  protected abstract transformJwtToken(token: unknown): IAuthStatus
  protected abstract getCurrentuser(): Observable<User>

  login(username: string, password: string): Observable<void> {
    this.clearToken()
    const loginResponse$ = this.authProvider(username, password)
    .pipe(
      map((value) => {
        this.setToken(value.accessToken)
        const token = jwtDecode(value.accessToken)
        return this.transformJwtToken(token)
      }),
      tap((status) => this.authStatus$.next(status)),
      filter((status: IAuthStatus) => status.isAuthenticated),
      flatMap(() => this.getCurrentuser()),
      map(user => this.currentUser$.next(user)),
      catchError(transformError)
    )
    loginResponse$.subscribe({
      error: err => {
        this.logout()
        return throwError(err)
      },
    })
    return loginResponse$
  }
  logout(clearToken?: boolean): void {
    if (clearToken) {
      this.clearToken()
    }
    setTimeout(() => this.authStatus$.next(defaultAuthStatus),0)
  }
  getToken(): string {
    throw new Error("Method not implemented.");
  }

  protected setToken(jwt: string) {
    this.setItem('jwt', jwt)
  }
  getTokenSourceMapRange(): string {
    return this.getItem('jwt') ?? ''
  }
  protected clearToken() {
    this.removeItem('jwt')
  }

}
