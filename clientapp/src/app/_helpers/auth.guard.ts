import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, CanLoad, Route } from '@angular/router';
import { Role } from '@app/auth/auth.enum';

import { AuthService } from '@app/auth/auth.service';
import { map, Observable, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }
    
    canLoad(route: Route, RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkLogin()
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkLogin(route)
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkLogin(childRoute)
    }

    protected checkLogin(route?: ActivatedRouteSnapshot): Observable<boolean> {
        return this.authService.authStatus$.pipe(
            map((authStatus) => {
                const roleMatch = this.checkRoleMatch(authStatus.userRole, route)
                const allowLogin = authStatus.isAuthenticated && roleMatch
                if (!allowLogin) {
                    this.router.navigate(['login'], {
                        queryParams: {
                            redirectUrl: this.getResolvedUrl(route)
                        },
                    })
                }
                return allowLogin
            }),
            take(1)
        )
    }

    private checkRoleMatch(role: Role, route?: ActivatedRouteSnapshot) {
        if (!route?.data?.expectedRole) {
            return true
        }
        return role === route.data.expectedRole
    }

    getResolvedUrl(route?: ActivatedRouteSnapshot): string {
        if (!route) {
            return ''
        }
        return route.pathFromRoot
        .map((r) => r.url.map((segment) => segment.toString())
        .join('/'))
        .join('/')
        .replace('//','/')
    }
}