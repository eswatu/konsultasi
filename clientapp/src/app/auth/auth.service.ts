import { IUser } from "@app/_models/IUser"
import { BehaviorSubject, catchError, filter, flatMap, map, Observable, pipe, tap, throwError } from "rxjs"
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
  private getAndUpdateuserIfAuthenticated = pipe(
    filter((status: IAuthStatus) => status.isAuthenticated),
    flatMap(() => this.getCurrentuser()),
    map((user: IUser) => this.currentUser$.next(user)),
    catchError(transformError)
  )
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());

  constructor() {
    super();
    if (this.hasExpiredToken()) {
      this.logout(true)
    } else {
      this.authStatus$.next(this.getAuthStatusFromToken())
    // To load user on browser refresh,
    // resume pipeline must activate on the next cycle
    // Which allows for all services to constructed properly
    setTimeout(() => this.resumeCurrentUser$.subscribe(), 0)
    }
  }
  protected abstract authProvider(username: string, password: string): Observable<IServerAuthResponse>
  protected abstract transformJwtToken(token: unknown): IAuthStatus
  protected abstract getCurrentuser(): Observable<User>
  protected hasExpiredToken():boolean {
    const jwt = this.getToken()
    if (jwt) {
      const payload = jwtDecode(jwt) as any
      return Date.now() >= payload.exp * 1000
    }
    return true
  }
  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(jwtDecode(this.getToken()))
  }
  protected readonly resumeCurrentUser$ = this.authStatus$.pipe(
    this.getAndUpdateuserIfAuthenticated
  )

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
      this.getAndUpdateuserIfAuthenticated
    )

    loginResponse$.subscribe({
      error: (err) => {
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
    return this.getItem('jwt') ?? ''
  }
  protected setToken(jwt: string) {
    this.setItem('jwt', jwt)
  }
  protected clearToken() {
    this.removeItem('jwt')
  }

}
