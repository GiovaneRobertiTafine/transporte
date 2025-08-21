import { EntregasDto } from "../dto/entregas.dto";

export const FiltroDashboard: (keyof Omit<EntregasDto, 'dataEnvio'>)[] = [
    'id',
    'cliente',
    'status'
]

