import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, Output } from "@angular/core";
import { EntregasDto } from "../models/dto/entregas.dto";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FiltroEntregas } from "../models/constants/entregas.constant";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { EntregaService } from "../services/entrega.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AlterarEntregaRequest } from "../models/requests/alterar-entrega.request";
import { finalize } from "rxjs";

@Component({
    selector: 'component-alterar-status-entrega',
    template: `
        <div class="d-flex align-itens-center gap-3">
            <div class="form-floating">
                <select class="form-select mb-3 mb-lg-0" name="filtro" id="filtroStatus" [(ngModel)]="status" placeholder="Selecione por Status">
                    <option *ngFor="let item of listaFiltro; trackBy trackByIndex" [ngValue]="item.value">
                        {{item.display}}
                    </option>
                </select>
                <label for="filtroStatus">Status</label>
            </div>
            <button [disabled]="!entrega || !status" 
                    class="btn btn-primary align-self-center" 
                    (click)="alterarStatusEntrega()">
                    Alterar Status    
            </button>
        </div>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule]
})
export class AlterarStatusEntregaComponent {
    @Input({ required: true }) entrega: EntregasDto | null = null;
    @Output() emitAlterado = new EventEmitter<boolean>();

    protected listaFiltro = FiltroEntregas;
    protected status?: StatusEntrega = undefined;

    private ngxSpinnerService = inject(NgxSpinnerService);
    private toastrService = inject(ToastrService);
    private entregaService = inject(EntregaService);
    private destroyRef = inject(DestroyRef);

    trackByIndex(index: number, item: any): number {
        return index;
    }

    alterarStatusEntrega(): void {
        if (this.entrega?.status === StatusEntrega.CANCELADA) {
            this.toastrService.error("Entrega com status cancelada.");
            return;
        }
        this.ngxSpinnerService.show();
        this.entregaService.alterarStatusEntrega(this.entrega?.id!, { status: this.status } as AlterarEntregaRequest)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.ngxSpinnerService.hide())
            )
            .subscribe({
                next: (response) => {
                    this.toastrService.success("Entrega alterada com sucesso.");
                    this.emitAlterado.emit(true);
                },
                error: (error) => {
                    this.toastrService.error(error);
                }
            });
    }
}
