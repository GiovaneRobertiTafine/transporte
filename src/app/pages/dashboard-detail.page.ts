import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { EntregasDto } from "../models/dto/entregas.dto";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { DeParaPipe } from "../pipes/de-para.pipe";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { EntregaService } from "../services/entrega.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize } from "rxjs";
import { StatusEntregaColorDirective } from "../directives/status-entrega-color.directive";
import { AlterarStatusEntregaComponent } from "../components/alterar-status-entrega.component";

@Component({
    selector: 'page-dashboard-detail',
    template: `
        <div>
            <div>
                <h3>Detalhes da Entrega {{entregaId}}</h3>
                <div class="d-flex justify-content-between align-itens-center mb-3">
                    <button class="btn btn-primary btn-sm align-self-center" [routerLink]="'/home/dashboard'">Voltar</button>
                    <component-alterar-status-entrega [entrega]="entrega()!" (emitAlterado)="obterDetalhesEntrega()"/>
                </div>
                <ng-container *ngIf="entrega(); else emptyEntrega">
                    <ul class="list-group mb-3">
                        <li class="list-group-item">
                            <strong>Cliente: </strong>{{entrega()?.cliente}}</li>
                        <li class="list-group-item">
                            <strong>Data Envio: </strong>{{entrega()?.dataEnvio | date: 'dd/MM/yyyy'}}</li>
                        <li class="list-group-item">
                            <strong>Status: </strong>
                            <span class="p-1 rounded-2" [status]="entrega()?.status!">
                                {{entrega()? (statusEntrega[entrega()?.status!] | dePara: 'status-entrega'): ''}}
                            </span>
                        </li>
                        <li class="list-group-item">
                            <strong>Endereço: </strong>{{entrega()?.endereco}}</li>
                        <li class="list-group-item">
                            <strong>Produto: </strong>{{entrega()?.produto}}</li>
                        <li class="list-group-item">
                            <strong>Data estimada de entrega: </strong>{{entrega()?.dataEstimadaEntrega | date: 'dd/MM/yyyy'}}</li>
                        <li class="list-group-item">
                            <strong>Observações: </strong>{{entrega()?.observacoes}}</li>
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
                                <tr *ngFor="let historico of entrega()?.historico; trackBy: trackByIndex">
                                    <td>{{historico.data | date: 'dd/MM/yyyy - HH:mm'}}</td>
                                    <td>
                                        <span class="p-1 rounded-2" [status]="historico.status">
                                            {{statusEntrega[historico.status] | dePara: 'status-entrega'}}
                                        </span>
                                    </td>
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, DeParaPipe, StatusEntregaColorDirective, AlterarStatusEntregaComponent]
})
export class DashboardDetailPage implements OnInit {
    protected statusEntrega = StatusEntrega;
    protected entrega = signal<EntregasDto | null>(null);
    trackByIndex(index: number): number {
        return index;
    }

    entregaId: string | null = null;

    private route = inject(ActivatedRoute);
    private ngxSpinnnerService = inject(NgxSpinnerService);
    private toastrService = inject(ToastrService);
    private entregaService = inject(EntregaService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        this.entregaId = this.route.snapshot.paramMap.get('id') ?? null;
        this.obterDetalhesEntrega();
    }

    obterDetalhesEntrega(): void {
        if (this.entregaId) {
            this.ngxSpinnnerService.show();
            this.entregaService.obterEntregaPorCodigo(this.entregaId)
                .pipe(
                    takeUntilDestroyed(this.destroyRef),
                    finalize(() => this.ngxSpinnnerService.hide())
                )
                .subscribe({
                    next: (entrega) => {
                        this.entrega.set(entrega);
                    },
                    error: (error) => {
                        this.toastrService.error(error.Descricao, 'Erro ao obter detalhes da entrega.');
                    }
                });
        }
    }

}
