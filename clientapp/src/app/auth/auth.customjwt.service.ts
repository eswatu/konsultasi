import { Observable, of } from "rxjs";
import { AuthService, IAuthStatus, IServerAuthResponse } from "./auth.service"
import { Injectable } from "@angular/core";
import { User } from "@app/_models";
import {sign} from 'fake-jwt-sign';
import { Role } from "./auth.enum";

@Injectable()
export class CustomJwt extends AuthService {
  
  private defaultUser = User.Build({
    _id: '5da01751da27cc462d265913',
    username: 'pegawai',
    name: 'Doguhan Uluca' ,
    role: Role.Admin,
    company: 'your company',
    contact: 'contacts',
    isActive: true
    })
  protected override transformJwtToken(token: IAuthStatus): IAuthStatus {
    return token;
  }
  protected override getCurrentuser(): Observable<User> {
    return of(this.defaultUser)
  }
  protected override authProvider(username: string, password: string): Observable<IServerAuthResponse> {
      username = username.toLowerCase()
      // validasi username
      const authStatus = {
        isAuthenticated: true,
        userId: this.defaultUser._id,
        userRole: username.includes('cashier')
          ? Role.Admin
          : username.includes('clerk')
          ? Role.User
          : Role.None,
      } as IAuthStatus;
      this.defaultUser.role = authStatus.userRole
      const authResponse = {
        accessToken: sign(authStatus, 'secret', {
          expiresIn: '1h',
          algorithm: 'none'
        }),
      } as IServerAuthResponse
      return of(authResponse)
  }
  constructor() {
    super();
    console.warn("You're using the InMemoryAuthService. Do not use this service in production.")
  }
}
