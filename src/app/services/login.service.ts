import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoginRequest } from "../models/requests/login.request";
import { catchError, Observable, of, throwError } from "rxjs";
import { LoginDto } from "../models/dto/login.dto";
import { environment } from "src/environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private readonly API_URL_AUTH = environment.API_URL_AUTH;
    private header = new HttpHeaders({
        'x-api-key': environment.AUTH_TOKEN
    });

    private httpClient = inject(HttpClient);

    login(
        request: LoginRequest
    ): Observable<LoginDto> {

        return this.httpClient.post<LoginDto>(
            this.API_URL_AUTH, request, { headers: this.header })
            .pipe(
                catchError((res: HttpErrorResponse) => {
                    return throwError(() => res.error.error);
                })
            );
    }
}
