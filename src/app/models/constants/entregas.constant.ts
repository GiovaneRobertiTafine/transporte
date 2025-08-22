import { EntregasDto } from "../dto/entregas.dto";
import { StatusEntrega } from "../enums/status-entrega.enum";

export const FiltroEntregas: { value: StatusEntrega, display: string; }[] = [
    {
        value: StatusEntrega.PENDENTE,
        display: 'Pendente'
    },
    {
        value: StatusEntrega.EM_ROTA,
        display: 'Em Rota'
    },
    {
        value: StatusEntrega.ENTREGUE,
        display: 'Entregue'
    },
    {
        value: StatusEntrega.CANCELADA,
        display: 'Cancelado'
    },
    {
        value: StatusEntrega.PEDIDO_CRIADO,
        display: 'Pedido Criado'
    },
    {
        value: StatusEntrega.COLETADO,
        display: 'Coletado'
    },
    {
        value: StatusEntrega.SAIU_ENTREGA,
        display: 'Saiu para Entrega'
    }
]

