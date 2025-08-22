import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { FiltroEntregas } from "../models/constants/entregas.constant";
import { CommonModule, NgFor } from "@angular/common";
import { DeParaPipe } from "../pipes/de-para.pipe";
import { FiltroDeParaDashboard } from "../models/types/dashboard.type";
import { ObterEntregasRequest } from "../models/requests/obter-entregas.request";
import { FormsModule, NgModel } from "@angular/forms";
import { BehaviorSubject, catchError, EMPTY, map, of, switchMap } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { EntregaService, ErrorResponse } from "../services/entrega.service";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { StatusEntregaColorDirective } from "../directives/status-entrega-color.directive";
import { Router } from "@angular/router";
import { EntregasDto } from "../models/dto/entregas.dto";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'page-dashboard',
    template: `
        <h3>Dashboard de Entregas</h3>
        <div class="card">
            <div class="d-lg-flex align-items-center p-3 gap-3 col-lg-6 col-auto">
                <select class="form-select col mb-3 mb-lg-0" name="filtro" id="filtro-select" [(ngModel)]="filtro.status" placeholder="Selecione por Status">
                    <option [ngValue]="undefined">Todos</option>
                    <option *ngFor="let item of listaFiltro; trackBy trackByIndex" [ngValue]="item.value">
                        {{item.display}}
                    </option>
                </select>
                <input class="form-control col mb-3 mb-lg-0" type="text" name="filtro-input" [(ngModel)]="filtro.clienteCodigo" placeholder="Código ou Cliente" />
                <button class="btn btn-primary col-auto" (click)="aplicarFiltro()">Buscar</button>
            </div>
            <div class="border-top">
                <div class="table-responsive">
                    <table class="table">
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
                                <td>{{item.dataEnvio | date: 'dd/MM/yyyy'}}</td>
                                <td>
                                    <span class="p-1 rounded-2" [status]="item.status">
                                        {{statusEntrega[item.status] | dePara: 'status-entrega'}}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="d-flex justify-content-end align-itens-center pe-3">
                <ngb-pagination [collectionSize]="0" />
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
        .dashboard-table {
            ngb-pagination {
                float: right;
            }
        }
        tr>th {
            white-space: nowrap;
        }
    `],
    imports: [
        CommonModule,
        DeParaPipe,
        FormsModule,
        StatusEntregaColorDirective,
        NgbPaginationModule
    ],
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
        clienteCodigo: undefined,
        status: undefined
    };

    protected request$ = new BehaviorSubject<ObterEntregasRequest>(this.filtro);

    protected entregasDto = toSignal(
        this.request$.pipe(
            switchMap((req) => {
                return this.entregaService.obterEntregas(req)
                    .pipe(
                        map(response => response.resultado),
                        catchError((error: ErrorResponse) => {
                            console.log(error);
                            return EMPTY;
                        })
                    );
            })
        )
        , { initialValue: [] });

    aplicarFiltro(): void {
        this.request$.next(this.filtro);
    }

    detalharEntrega(entrega: EntregasDto): void {
        this.router.navigate(['/home/dashboard', entrega.id], { state: entrega });
    }
}
