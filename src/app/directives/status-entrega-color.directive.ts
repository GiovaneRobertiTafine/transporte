import { Directive, ElementRef, inject, Input } from "@angular/core";
import { StatusEntrega } from "../models/enums/status-entrega.enum";

@Directive({
    selector: '[status]',
    standalone: true
})
export class StatusEntregaColorDirective {
    private el = inject(ElementRef);

    @Input() set status(status: StatusEntrega) {
        this.setColor(status);
    }

    private setColor(status: StatusEntrega): void {
        const colorMap: Record<StatusEntrega, string> = {
            [StatusEntrega.CANCELADA]: '#ffb3b3',
            [StatusEntrega.COLETADO]: '#b3d0ff',
            [StatusEntrega.EM_ROTA]: '#b3d0ff',
            [StatusEntrega.ENTREGUE]: '#b3ffc3',
            [StatusEntrega.PENDENTE]: '#fff7b3',
            [StatusEntrega.PEDIDO_CRIADO]: '#ffb3df',
            [StatusEntrega.SAIU_ENTREGA]: '#b3ffe8'
        };

        this.el.nativeElement.style.backgroundColor = colorMap[status] || 'none';
    }
}
