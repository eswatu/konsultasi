import { IUser } from "@app/_models/IUser"
import { BehaviorSubject, Observable } from "rxjs"
import { Role } from "./auth.enum";
import { Injectable } from "@angular/core";
import { User } from "@app/_models";

export interface IAuthStatus {
  isAuthenticated: boolean;
  userRole: Role;
  userId: string;
}
export interface IServerAuthResponse {
  accessToken: string;
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated : false,
  userRole: Role.None,
  userId: ''
}

export interface IAuthService {
    readonly authStatus$: BehaviorSubject<IAuthStatus>
    readonly currentUser$: BehaviorSubject<IUser>
    login(username: string, password: string): Observable<void>
    logout(clearToken?: boolean): void
    getToken(): string
  }

@Injectable()
export abstract class AuthService implements IAuthService {
  protected abstract authProvider(username: string, password: string): Observable<IServerAuthResponse>
  protected abstract transformJwtToken(token: unknown): IAuthStatus
  protected abstract getCurrentuser(): Observable<User>
  
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus);
  readonly currentUser$ = new BehaviorSubject<IUser>(new User());

  login(username: string, password: string): Observable<void> {
    throw new Error("Method not implemented.");
  }
  logout(clearToken?: boolean): void {
    throw new Error("Method not implemented.");
  }
  getToken(): string {
    throw new Error("Method not implemented.");
  }

}