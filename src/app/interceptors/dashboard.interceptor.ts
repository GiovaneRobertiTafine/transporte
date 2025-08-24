import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthState } from "../states/auth.state";

export const dashboardInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(AuthState).token();
    const auth = req.clone({
        headers:
            req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(auth);
};
