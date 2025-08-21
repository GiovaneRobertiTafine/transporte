import { EntregasDto } from "../dto/entregas.dto";

export interface ObterEntregasRequest {
    key?: (keyof Pick<EntregasDto, 'id' | 'cliente' | 'status'>),
    value?: string;
}
