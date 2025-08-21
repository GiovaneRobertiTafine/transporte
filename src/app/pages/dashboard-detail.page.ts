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
            <div>
                <h3>Detalhes da Entrega</h3>
                <button class="btn btn-primary btn-sm mb-3" [routerLink]="'/home/dashboard'">Voltar</button>
                <ng-container *ngIf="entrega; else emptyEntrega">
                    <ul class="list-group mb-3">
                        <li class="list-group-item">
                            <strong>Cliente: </strong>{{entrega.cliente}}</li>
                        <li class="list-group-item">
                            <strong>Data Envio:</strong>{{entrega.dataEnvio | date: 'dd/mm/yyyy'}}</li>
                        <li class="list-group-item">
                            <strong>Status: </strong>{{statusEntrega[entrega.status] | dePara: 'status-entrega'}}</li>
                        <li class="list-group-item">
                            <strong>Endereço: </strong>{{entrega.endereco}}</li>
                        <li class="list-group-item">
                            <strong>Produto: </strong>{{entrega.produto}}</li>
                        <li class="list-group-item">
                            <strong>Data estimada de entrega: </strong>{{entrega.dataEstimadaEntrega | date: 'dd/mm/yyyy'}}</li>
                        <li class="list-group-item">
                            <strong>Observações: </strong>{{entrega.observacoes}}</li>
                    </ul>
                    <h5>Histórico</h5>
                    <div class="table-responsive">
                        <table class="table">
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
                    </div>
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
