import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlterarStatusEntregaComponent } from './alterar-status-entrega.component';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EntregaService } from '../services/entrega.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { By } from '@angular/platform-browser';
import { EntregasDto } from '../models/dto/entregas.dto';
import { StatusEntrega } from '../models/enums/status-entrega.enum';
import { AlterarEntregaRequest } from '../models/requests/alterar-entrega.request';

describe('AlterarStatusEntregaComponent', () => {
    let component: AlterarStatusEntregaComponent;
    let fixture: ComponentFixture<AlterarStatusEntregaComponent>;
    let entregaServiceSpy: jasmine.SpyObj<EntregaService>;
    let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
    let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

    const mockEntrega: EntregasDto = {
        id: '1',
        cliente: 'Cliente Teste',
        dataEnvio: new Date(),
        status: StatusEntrega.PENDENTE,
        endereco: 'Rua Teste',
        produto: 'Produto X',
        dataEstimadaEntrega: new Date(),
        historico: []
    };

    beforeEach(async () => {
        entregaServiceSpy = jasmine.createSpyObj('EntregaService', ['alterarStatusEntrega']);
        toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
        spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

        await TestBed.configureTestingModule({
            imports: [AlterarStatusEntregaComponent, FormsModule],
            providers: [
                { provide: EntregaService, useValue: entregaServiceSpy },
                { provide: ToastrService, useValue: toastrServiceSpy },
                { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AlterarStatusEntregaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('botão deve estar desabilitado se não houver entrega ou status', () => {
        component.entrega = null;
        component['status'] = undefined;
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
        expect(button.disabled).toBeTrue();
    });

    it('deve mostrar erro se a entrega estiver cancelada', () => {
        component.entrega = { ...mockEntrega, status: StatusEntrega.CANCELADA };
        component['status'] = StatusEntrega.EM_ROTA;

        component.alterarStatusEntrega();

        expect(toastrServiceSpy.error).toHaveBeenCalledWith('Entrega com status cancelada.');
        expect(entregaServiceSpy.alterarStatusEntrega).not.toHaveBeenCalled();
    });

    it('deve alterar status com sucesso', () => {
        const updatedEntrega = { ...mockEntrega, status: StatusEntrega.ENTREGUE };
        component.entrega = mockEntrega;
        component['status'] = StatusEntrega.ENTREGUE;

        entregaServiceSpy.alterarStatusEntrega.and.returnValue(of(updatedEntrega));

        spyOn(component.emitAlterado, 'emit');

        component.alterarStatusEntrega();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(entregaServiceSpy.alterarStatusEntrega).toHaveBeenCalledWith(mockEntrega.id, { status: StatusEntrega.ENTREGUE } as AlterarEntregaRequest);
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
        expect(toastrServiceSpy.success).toHaveBeenCalledWith('Entrega alterada com sucesso.');
        expect(component.emitAlterado.emit).toHaveBeenCalledWith(updatedEntrega);
    });

    it('deve tratar erro ao alterar status', () => {
        component.entrega = mockEntrega;
        component['status'] = StatusEntrega.ENTREGUE;

        entregaServiceSpy.alterarStatusEntrega.and.returnValue(throwError(() => 'Erro de teste'));

        component.alterarStatusEntrega();

        expect(spinnerServiceSpy.show).toHaveBeenCalled();
        expect(spinnerServiceSpy.hide).toHaveBeenCalled();
        expect(toastrServiceSpy.error).toHaveBeenCalledWith('Erro de teste');
    });

    it('deve usar trackByIndex corretamente', () => {
        const result = component.trackByIndex(1, { value: StatusEntrega.PENDENTE, display: 'Pendente' });
        expect(result).toBe(1);
    });
});
