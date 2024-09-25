import { AuthService } from '@app/auth/auth.service';

export function appInitializer(authenticationService: AuthService) {
    return () => authenticationService.getToken();
}