import { EntregasDto } from "../dto/entregas.dto";

export const FiltroEntregas: (keyof Omit<EntregasDto, 'dataEnvio'>)[] = [
    'id',
    'cliente',
    'status'
]

