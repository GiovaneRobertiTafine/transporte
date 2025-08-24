import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthState } from "../states/auth.state";
import { inject } from "@angular/core";

export const canActivateDashboard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authState = inject(AuthState);
    const router = inject(Router);
    console.warn(authState.estaAutenticado());
    console.warn(authState.token, authState.usuario);
    if (!authState.estaAutenticado()) {
        authState.desautenticar();
        router.navigate(['/login']);
        return false;
    }
    return true;
};
