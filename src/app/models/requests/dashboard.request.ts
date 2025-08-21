import { EntregasDto } from "../dto/entregas.dto";

export interface FiltroDashboardRequest {
    key?: (keyof Pick<EntregasDto, 'id' | 'cliente' | 'status'>),
    value?: string;
}
