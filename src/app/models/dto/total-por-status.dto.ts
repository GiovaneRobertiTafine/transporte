import { StatusEntrega } from "../enums/status-entrega.enum";

export interface TotalPorStatusDto {
    status: StatusEntrega;
    quantidade: number;
}
