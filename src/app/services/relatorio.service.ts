import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment.development";
import { ErrorResponse, ResponsePaginado } from "./entrega.service";
import { TotalPorStatusDto } from "../models/dto/total-por-status.dto";
import { QuantidadeEntregaDia } from "../models/dto/quantidade-entrega-dia.dto";
import { QuantidadeEntregaDiaRequest } from "../models/requests/quantidade-entrega-dia.request";

@Injectable({
    providedIn: 'root'
})
export class RelatorioService {

    private httpClient = inject(HttpClient);
    private readonly API_URL = environment.API_URL;

    obterQuantidadeEntregaAtrasada(): Observable<number> {
        return this.httpClient.get<number>(`${this.API_URL}/relatorio/total-atrasadas`).pipe(
            catchError(this.handleError)
        );
    }

    obterQuantidadePorStatus(): Observable<TotalPorStatusDto[]> {
        return this.httpClient.get<TotalPorStatusDto[]>(`${this.API_URL}/relatorio/total-por-status`).pipe(
            catchError(this.handleError)
        );
    }

    obterEntregaPorIntervaloDia(request: QuantidadeEntregaDiaRequest): Observable<QuantidadeEntregaDia[]> {
        return this.httpClient.get<QuantidadeEntregaDia[]>(
            `${this.API_URL}/relatorio/quantidade-entrega-por-dia`,
            {
                params: { ...request as {} }
            }
        ).pipe(
            catchError(this.handleError)
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
