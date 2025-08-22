import { StatusEntrega } from "../enums/status-entrega.enum";

export interface EntregasDto {
    id: string;
    cliente: string;
    dataEnvio: Date;
    status: StatusEntrega;
    endereco: string;
    produto: string;
    dataEstimadaEntrega: Date;
    observacoes?: string;
    historico: HistoricoEntrega[];
}

export interface HistoricoEntrega {
    data: Date;
    status: StatusEntrega;
}
