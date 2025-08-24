import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthState } from "../states/auth.state";
import { inject } from "@angular/core";

export const canActivateLogin: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authState = inject(AuthState);
    const router = inject(Router);

    if (authState.estaAutenticado()) {
        router.navigate(['/home']);
        return false;
    }
    return true;
};
