import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthService } from '@app/auth/auth.service';
import { User } from '@app/_models';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const jwt = this.authenticationService.getToken()
        const authRequest = request.clone({setHeaders: {authorization: `Bearer ${jwt}`}})
        return next.handle(authRequest).pipe(
            catchError((err, caught) => {
                if (err.status === 401) {
                    this.router.navigate(['/login', {queryParams: {redirectUrl: this.router.routerState.snapshot.url}}])
                }
                return throwError(err)
            })
        );
    }
}