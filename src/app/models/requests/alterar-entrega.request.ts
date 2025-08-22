import { StatusEntrega } from "../enums/status-entrega.enum";

export interface AlterarEntregaRequest {
    status: StatusEntrega;
}
