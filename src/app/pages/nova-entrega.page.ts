import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { NovaEntregaForm, NovaEntregaRequest } from "../models/requests/nova-entrega.request";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { EntregaService } from "../services/entrega.service";
import { FormInvalidFocus } from "../directives/form-invalid-focus.directive";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { finalize } from "rxjs";

@Component({
    selector: 'page-nova-entrega',
    template: `
        <div>
            <h3>Nova Entrega</h3>
            <form [formGroup]="entregaForm" (ngSubmit)="novaEntrega(); focusFormInvalid.focus()" 
                focusInvalid #focusFormInvalid="focusInvalid" [selectorInvalid]="selectorInvalid">
                <div class="mb-3">
                    <label class="form-label" for="cliente">Cliente:</label>
                    <input type="text" class="form-control" id="cliente" name="cliente" formControlName="cliente"
                    [attr.aria-invalid]="entregaForm.get('cliente')?.invalid && entregaForm.get('cliente')?.touched"
                    aria-describedby="cliente-required">
                    <div class="small text-danger" id="cliente-required" role="alert" *ngIf="entregaForm.get('cliente')?.hasError('required') && 
                        entregaForm.get('cliente')?.touched">
                        Cliente é requerido.
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label" for="endereco">Endereço:</label>
                    <input type="text" class="form-control" id="endereco" name="endereco" formControlName="endereco"
                    [attr.aria-invalid]="entregaForm.get('endereco')?.invalid && entregaForm.get('endereco')?.touched"
                    aria-describedby="endereco-required">
                    <div class="small text-danger" id="endereco-required" role="alert" *ngIf="entregaForm.get('endereco')?.hasError('required') && 
                        entregaForm.get('endereco')?.touched">
                        Endereço é requerido.
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="dataEstimadaEntrega">Data estimada de Entrega:</label>
                    <input class="form-control" type="date" id="dataEstimadaEntrega" name="dataEstimadaEntrega" formControlName="dataEstimadaEntrega"
                    [attr.aria-invalid]="entregaForm.get('dataEstimadaEntrega')?.invalid && entregaForm.get('dataEstimadaEntrega')?.touched"
                    aria-describedby="data-estimada-entrega-required data-estimada-entrega-menor">
                    <div class="small text-danger" id="data-estimada-entrega-required" role="alert" *ngIf="entregaForm.get('dataEstimadaEntrega')?.hasError('required') && 
                        entregaForm.get('dataEstimadaEntrega')?.touched">
                        Data é requerido.
                    </div>
                    <div class="small text-danger" id="data-estimada-entrega-menor" role="alert" *ngIf="entregaForm.get('dataEstimadaEntrega')?.hasError('menorQueHoje') && 
                        entregaForm.get('dataEstimadaEntrega')?.touched">
                        A data precisa ser posterior a hoje.
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label" for="produto">Produto:</label>
                    <input type="text" class="form-control" id="produto" name="produto" formControlName="produto"
                    [attr.aria-invalid]="entregaForm.get('produto')?.invalid && entregaForm.get('produto')?.touched"
                    aria-describedby="produto-required">
                    <div class="small text-danger" id="produto-required" role="alert" *ngIf="entregaForm.get('produto')?.hasError('required') && 
                        entregaForm.get('produto')?.touched">
                        Produto é requerido.
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label" for="observacoes">Observações:</label>
                    <textarea type="text" class="form-control" id="observacoes" name="observacoes" formControlName="observacoes">
                    </textarea>
                </div>

                <button class="btn btn-primary" type="submit">Criar Entrega</button>
            </form>
        </div>
    `,
    styles: [`
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule, FormInvalidFocus]
})
export class NovaEntregaPage {
    private formBuilder = inject(FormBuilder);
    private entregaService = inject(EntregaService);
    protected selectorInvalid: string | string[] = '.ng-invalid';
    private destroyRef = inject(DestroyRef);
    private ngxSpinnerService = inject(NgxSpinnerService);
    private toastService = inject(ToastrService);

    private menorQueHoje(control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }

        const inputDate = new Date(control.value);
        const today = new Date();

        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (inputDate < today) {
            return { 'menorQueHoje': true };
        }
        return null;
    }

    protected entregaForm = this.formBuilder.nonNullable.group<NovaEntregaForm>({
        cliente: new FormControl('', { validators: [Validators.required] }),
        endereco: new FormControl('', { validators: [Validators.required] }),
        dataEstimadaEntrega: new FormControl('', { validators: [Validators.required, this.menorQueHoje] }),
        produto: new FormControl('', { validators: [Validators.required] }),
        observacoes: new FormControl('', { validators: [] }),
        dataEnvio: new FormControl(''),
        status: new FormControl<StatusEntrega>(StatusEntrega.PEDIDO_CRIADO)
    });

    novaEntrega(): void {
        if (this.entregaForm.invalid) {
            this.entregaForm.markAsTouched();
            return;
        }
        this.ngxSpinnerService.show();
        this.entregaService.novaEntrega(this.entregaForm.value as NovaEntregaRequest)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.ngxSpinnerService.hide())
            )
            .subscribe({
                next: () => {
                    this.toastService.success('Entrega criada com sucesso.');
                    this.entregaForm.reset();
                },
                error: (error) => {
                    this.toastService.error(error, 'Erro ao criar entrega.');
                }
            });
    }
}
