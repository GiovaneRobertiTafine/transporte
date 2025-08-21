import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { EntregasDto } from "../models/dto/entregas.dto";
import { ObterEntregasRequest } from "../models/requests/obter-entregas.request";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { catchError, delay } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { NovaEntregaRequest } from "../models/requests/nova-entrega.request";

export type ErrorResponse = { Codigo: HttpStatusCode, Descricao: string; };

@Injectable({
    providedIn: 'root'
})
export class EntregaService {

    obterEntregas(filtro?: ObterEntregasRequest): Observable<EntregasDto[]> {
        return of([
            {
                id: 123878,
                cliente: "Elisa Lanicia",
                dataEnvio: new Date(),
                status: StatusEntrega.PENDENTE,
                endereco: "Rua das Acácias, 1200 - São Paulo/SP",
                produto: "Notebook Dell XPS",
                dataEstimadaEntrega: new Date(),
                observacoes: "Entregar somente no período da tarde",
                historico: [
                    { data: new Date(), status: StatusEntrega.PEDIDO_CRIADO }
                ]
            },
            {
                id: 123902,
                cliente: "Sandra Santos",
                dataEnvio: new Date(),
                status: StatusEntrega.EM_ROTA,
                endereco: "Av. Paulista, 400 - São Paulo/SP",
                produto: "Smartphone Samsung S23",
                dataEstimadaEntrega: new Date(),
                observacoes: "",
                historico: [
                    { data: new Date(), status: StatusEntrega.PEDIDO_CRIADO },
                    { data: new Date(), status: StatusEntrega.COLETADO },
                    { data: new Date(), status: StatusEntrega.SAIU_ENTREGA }
                ]
            },
            {
                id: 123938,
                cliente: "Beta Conciira",
                dataEnvio: new Date(),
                status: StatusEntrega.ENTREGUE,
                endereco: "Rua Flores Belas, 777 - Curitiba/PR",
                produto: "Monitor LG UltraWide",
                dataEstimadaEntrega: new Date(),
                observacoes: "Cliente solicitou instalação",
                historico: [
                    { data: new Date(), status: StatusEntrega.PEDIDO_CRIADO },
                    { data: new Date(), status: StatusEntrega.COLETADO },
                    { data: new Date(), status: StatusEntrega.ENTREGUE }
                ]
            }]).pipe(
                catchError(this.handleError),
            );
    }

    novaEntrega(request: NovaEntregaRequest): Observable<void> {
        return of(void 0).pipe(
            delay(1000),
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
