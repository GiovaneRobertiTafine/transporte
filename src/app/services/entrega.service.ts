import { inject, Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { EntregasDto } from "../models/dto/entregas.dto";
import { ObterEntregasRequest } from "../models/requests/obter-entregas.request";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { NovaEntregaRequest } from "../models/requests/nova-entrega.request";
import { environment } from "src/environments/environment.development";
import { AlterarEntregaRequest } from "../models/requests/alterar-entrega.request";

export type ErrorResponse = { Codigo: HttpStatusCode; Descricao: string; };
export type ResponsePaginado<T> = { resultado: T; tamanhoColecao: number; };

@Injectable({
    providedIn: 'root'
})
export class EntregaService {

    private httpClient = inject(HttpClient);
    private readonly API_URL = environment.API_URL;

    obterEntregas(filtro?: ObterEntregasRequest): Observable<ResponsePaginado<EntregasDto[]>> {
        if (filtro?.status === undefined) {
            delete filtro?.status;
        }
        if (filtro?.clienteCodigo === undefined) {
            delete filtro?.clienteCodigo;
        }
        return this.httpClient.get<ResponsePaginado<EntregasDto[]>>(`${this.API_URL}/entrega`, {
            params: { ...filtro }
        }).pipe(
            catchError(this.handleError),
        );
    }

    obterEntregaPorCodigo(codigo: string): Observable<EntregasDto> {
        return this.httpClient.get<EntregasDto>(`${this.API_URL}/entrega/${codigo}`)
            .pipe(
                catchError(this.handleError),
            );
    };


    novaEntrega(request: NovaEntregaRequest): Observable<void> {
        return this.httpClient.post<void>(`${this.API_URL}/entrega`, {
            ...request
        }).pipe(
            catchError(this.handleError),
        );
    };

    alterarStatusEntrega(codigo: string, request: AlterarEntregaRequest): Observable<EntregasDto> {
        return this.httpClient.put<EntregasDto>(`${this.API_URL}/entrega/${codigo}`, {
            ...request
        }).pipe(
            catchError(this.handleError),
        );
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage: ErrorResponse = { Codigo: 520 as HttpStatusCode, Descricao: 'Ocorreu um erro desconhecido!' };
        console.log('Error occurred:', error);
        if (error.error instanceof ErrorEvent) {
            errorMessage = { Codigo: error.status, Descricao: `Erro: ${error.error.message}` };
        } else {
            switch (error.status) {
                case 0:
                case HttpStatusCode.ServiceUnavailable:
                    errorMessage = { Codigo: HttpStatusCode.ServiceUnavailable, Descricao: 'Serviço indisponível.' };
                    break;
                case HttpStatusCode.BadRequest:
                    errorMessage = { Codigo: error.status, Descricao: error.error.Descricao || 'Requisição inválida.' };
                    break;
                case HttpStatusCode.InternalServerError:
                    errorMessage = { Codigo: error.status, Descricao: error.error.Descricao || 'Erro interno do servidor.' };
                    break;
                default:
                    errorMessage = { Codigo: error.status, Descricao: error.error.Descricao || errorMessage.Descricao };
                    break;
            }
        }

        return throwError(() => errorMessage);
    }
}
