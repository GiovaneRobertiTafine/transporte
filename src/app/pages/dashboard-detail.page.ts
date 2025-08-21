import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { EntregasDto } from "../models/dto/entregas.dto";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { DeParaPipe } from "../pipes/de-para.pipe";

@Component({
    selector: 'page-dashboard-detail',
    template: `
        <div>
            <button [routerLink]="'/home/dashboard'">Voltar</button>
            <div>
                <h1>Detalhes da Entrega</h1>
                <ng-container *ngIf="entrega; else emptyEntrega">
                    <ul >
                        <li>Cliente: {{entrega.cliente}}</li>
                        <li>Data Envio: {{entrega.dataEnvio | date: 'dd/mm/yyyy'}}</li>
                        <li>Status: {{statusEntrega[entrega.status] | dePara: 'status-entrega'}}</li>
                        <li>Status: {{entrega.endereco}}</li>
                        <li>Status: {{entrega.produto}}</li>
                        <li>Status: {{entrega.dataEstimadaEntrega | date: 'dd/mm/yyyy'}}</li>
                        <li>Status: {{entrega.observacoes}}</li>
                    </ul>
                    <h5>Histórico</h5>
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let historico of entrega.historico; trackBy: trackByIndex">
                                <td>{{historico.data | date: 'dd/mm/yyyy'}}</td>
                                <td>{{statusEntrega[historico.status] | dePara: 'status-entrega'}}</td>
                            </tr>
                        </tbody>
                    </table>
                </ng-container>
                <ng-template #emptyEntrega>
                    <p>Nenhuma entrega selecionada.</p>
                </ng-template>
            </div>
        </div>
    `,
    standalone: true,
    imports: [CommonModule, RouterModule, DeParaPipe]
})
export class DashboardDetailPage {
    protected entrega: EntregasDto = history?.state || null;
    protected statusEntrega = StatusEntrega;
    trackByIndex(index: number): number {
        return index;
    }

}
