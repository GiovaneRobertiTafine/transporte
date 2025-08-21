import { CommonModule } from "@angular/common";
import { Component, DestroyRef, inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { NovaEntregaForm, NovaEntregaRequest } from "../models/requests/nova-entrega.request";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { EntregaService } from "../services/entrega.service";
import { FormInvalidFocus } from "../directives/form-invalid-focus.directive";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: 'page-nova-entrega',
    template: `
        <div class="nova-entrega-container">
            <h1>Nova Entrega</h1>
            <form [formGroup]="entregaForm" (ngSubmit)="novaEntrega(); focusFormInvalid.focus()" 
                focusInvalid #focusFormInvalid="focusInvalid" [selectorInvalid]="selectorInvalid">
                <label for="cliente">Cliente:</label>
                <input type="text" id="cliente" name="cliente" formControlName="cliente">
                <div class="msg-control-invalid" *ngIf="entregaForm.get('cliente')?.hasError('required') && 
                    entregaForm.get('cliente')?.touched">
                    Cliente é requerido.
                </div>

                
                <label for="endereco">Endereço:</label>
                <input type="text" id="endereco" name="endereco" formControlName="endereco">
                <div class="msg-control-invalid" *ngIf="entregaForm.get('endereco')?.hasError('required') && 
                    entregaForm.get('endereco')?.touched">
                    Endereço é requerido.
                </div>

                <label for="dataEstimadaEntrega">Data estimada de Entrega:</label>
                <input type="date" id="dataEstimadaEntrega" name="dataEstimadaEntrega" formControlName="dataEstimadaEntrega">
                <div class="msg-control-invalid" *ngIf="entregaForm.get('dataEstimadaEntrega')?.hasError('required') && 
                    entregaForm.get('dataEstimadaEntrega')?.touched">
                    Data é requerido.
                </div>
                <div class="msg-control-invalid" *ngIf="entregaForm.get('dataEstimadaEntrega')?.hasError('menorQueHoje') && 
                    entregaForm.get('dataEstimadaEntrega')?.touched">
                    A data precisa ser posterior a hoje.
                </div>

                <label for="produto">Produto:</label>
                <input type="text" id="produto" name="produto" formControlName="produto">
                <div class="msg-control-invalid" *ngIf="entregaForm.get('produto')?.hasError('required') && 
                    entregaForm.get('produto')?.touched">
                    Produto é requerido.
                </div>
                
                <label for="observacoes">Observações:</label>
                <input type="text" id="observacoes" name="observacoes" formControlName="observacoes">

                <button type="submit">Criar Entrega</button>
            </form>
        </div>
    `,
    styles: [`
    `],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInvalidFocus]
})
export class NovaEntregaPage {
    private formBuilder = inject(FormBuilder);
    private entregaService = inject(EntregaService);
    protected selectorInvalid: string | string[] = '.ng-invalid';
    private destroyRef = inject(DestroyRef);

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
            return;
        }

        this.entregaService.novaEntrega(this.entregaForm.value as NovaEntregaRequest)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    alert('Entrega criada com sucesso!');
                    this.entregaForm.reset();
                },
                error: (error) => {
                    alert(`Erro ao criar entrega: ${error.Descricao}`);
                }
            });
        console.log(this.entregaForm.value);
        console.log(this.entregaForm.valid);
    }
}
