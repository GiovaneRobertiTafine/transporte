import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { FiltroEntregas } from "../models/constants/entregas.constant";
import { CommonModule, NgFor } from "@angular/common";
import { DeParaPipe } from "../pipes/de-para.pipe";
import { FiltroDeParaDashboard } from "../models/types/dashboard.type";
import { ObterEntregasRequest } from "../models/requests/obter-entregas.request";
import { FormsModule, NgModel } from "@angular/forms";
import { BehaviorSubject, catchError, EMPTY, of, switchMap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { EntregaService, ErrorResponse } from "../services/entrega.service";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { StatusEntregaColorDirective } from "../directives/status-entrega-color.directive";
import { Router } from "@angular/router";
import { EntregasDto } from "../models/dto/entregas.dto";

@Component({
    selector: 'page-dashboard',
    template: `
        <h1>Dashboard de Entregas</h1>
        <div class="dashboard-content card">
            <div class="dashboard-header">
                <select name="filtro" id="filtro-select" [(ngModel)]="filtro.key">
                    <option [value]="undefined" hidden>Selecione</option>
                    <option *ngFor="let item of listaFiltro; trackBy trackByIndex" [value]="item">
                        {{item | dePara: 'filtro-dashboard'}}
                    </option>
                </select>
                <input type="text" name="filtro-input" [(ngModel)]="filtro.value">
                <button class="btn btn-primary">Buscar</button>
            </div>
            <div class="dashboard-table">
                <table>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Data Envio</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let item of entregasDto(); trackBy trackByIndex" (click)="detalharEntrega(item)">
                            <td>{{item.id}}</td>
                            <td>{{item.cliente}}</td>
                            <td>{{item.dataEnvio | date: 'dd/mm/yyyy'}}</td>
                            <td [status]="item.status">
                                {{statusEntrega[item.status] | dePara: 'status-entrega'}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            padding: 16px;
        }
    `],
    imports: [CommonModule, NgFor, DeParaPipe, FormsModule, StatusEntregaColorDirective],
    providers: [EntregaService]
})
export class DashboardPage {
    protected listaFiltro = FiltroEntregas;
    protected statusEntrega = StatusEntrega;

    private entregaService = inject(EntregaService);
    private router = inject(Router);

    trackByIndex(index: number, item: any): number {
        return index;
    }

    protected filtro: ObterEntregasRequest = {
        key: undefined,
        value: undefined
    };

    protected request$ = new BehaviorSubject<ObterEntregasRequest>(this.filtro);

    protected entregasDto = toSignal(
        this.request$.pipe(
            switchMap((req) => {
                return this.entregaService.obterEntregas(req)
                    .pipe(
                        catchError((error: ErrorResponse) => {
                            console.log(error);
                            return EMPTY;
                        })
                    );
            })
        )
        , { initialValue: [] });

    detalharEntrega(entrega: EntregasDto): void {
        this.router.navigate(['/home/dashboard', entrega.id], { state: entrega });
    }
}
