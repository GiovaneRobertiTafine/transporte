import { StatusEntrega } from "../enums/status-entrega.enum";

export interface ObterEntregasRequest {
    clienteCodigo?: string,
    status?: StatusEntrega;
}
