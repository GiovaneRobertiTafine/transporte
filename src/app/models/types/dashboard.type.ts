import { EntregasDto } from "../dto/entregas.dto";

export type FiltroDeParaDashboard = { [key in keyof Partial<Pick<EntregasDto, 'id' | 'cliente' | 'status'>>]: string };
