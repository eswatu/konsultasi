import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User | null>(null);
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}users/authenticate`, { username, password }, { withCredentials: false })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                console.log("dari service ", user);
                this.userSubject.next(user);
                return user;
            }));
    }
    refreshToken() {
        const currentuser = this.userValue;
        return this.http.post<any>(`${environment.apiUrl}users/refresh-token`, {currentuser}, { withCredentials: true })
            .pipe(map((user) => {
                this.userSubject.next(user);
                this.startRefreshTokenTimer();
                return user;
            }));
    }
    
    logout() {
        this.http.post<any>(`${environment.apiUrl}users/revoke-token`, {}, { withCredentials: true }).subscribe();
        this.stopRefreshTokenTimer();
        // remove user from local storage to log user out
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }



    // helper methods

    private refreshTokenTimeout?: NodeJS.Timeout;

    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        const jwtBase64 = this.userValue!.jwtToken!.split('.')[1];
        const jwtToken = JSON.parse(atob(jwtBase64));

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1);
        const timeout = expires.getTime() - Date.now() - (6 * 1000);
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), 600);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}
