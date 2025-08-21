import { FormControl } from "@angular/forms";
import { EntregasDto } from "../dto/entregas.dto";

export type NovaEntregaRequest = Omit<EntregasDto, 'id' | 'historico'>;

export type NovaEntregaForm = { [key in keyof NovaEntregaRequest]: FormControl };
