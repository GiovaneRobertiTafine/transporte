import { Pipe } from "@angular/core";
import { StatusEntrega } from "../models/enums/status-entrega.enum";

export const DeParaPipeObj: { [index: string]: () => Record<any, string>; } = {
    'status-entrega': () => {
        return {
            CANCELADA: 'Cancelada',
            COLETADO: 'Coletado',
            EM_ROTA: 'Em Rota',
            ENTREGUE: 'Entregue',
            PEDIDO_CRIADO: 'Pedido Criado',
            PENDENTE: 'Pendente',
            SAIU_ENTREGA: 'Saiu para Entrega'
        } as Record<(keyof typeof StatusEntrega), string>;
    },
};

@Pipe({
    name: 'dePara',
    standalone: true
})
export class DeParaPipe {
    transform(value: string | number, dePara: string): string | number {
        return DeParaPipeObj[dePara]()[value.toString()] || value;
    }
}
