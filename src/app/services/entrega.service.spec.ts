import { TestBed } from '@angular/core/testing';
import { EntregaService, ErrorResponse, ResponsePaginado } from './entrega.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { EntregasDto } from '../models/dto/entregas.dto';
import { StatusEntrega } from '../models/enums/status-entrega.enum';
import { ObterEntregasRequest } from '../models/requests/obter-entregas.request';
import { NovaEntregaRequest } from '../models/requests/nova-entrega.request';
import { AlterarEntregaRequest } from '../models/requests/alterar-entrega.request';

describe('EntregaService', () => {
    let service: EntregaService;
    let httpMock: HttpTestingController;

    const API_URL = environment.API_URL;

    const mockEntrega: EntregasDto = {
        id: '123',
        cliente: 'Cliente Teste',
        dataEnvio: new Date(),
        status: StatusEntrega.PENDENTE,
        endereco: 'Rua Teste',
        produto: 'Produto X',
        dataEstimadaEntrega: new Date(),
        historico: []
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EntregaService]
        });
        service = TestBed.inject(EntregaService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('deve obter entregas (GET)', () => {
        const filtro: ObterEntregasRequest = { status: StatusEntrega.PENDENTE };
        const mockResponse: ResponsePaginado<EntregasDto[]> = {
            resultado: [mockEntrega],
            tamanhoColecao: 1
        };

        service.obterEntregas(filtro).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${API_URL}/entrega?status=${filtro.status}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('deve obter entrega por código (GET)', () => {
        service.obterEntregaPorCodigo('123').subscribe((res) => {
            expect(res).toEqual(mockEntrega);
        });

        const req = httpMock.expectOne(`${API_URL}/entrega/123`);
        expect(req.request.method).toBe('GET');
        req.flush(mockEntrega);
    });

    it('deve criar nova entrega (POST)', () => {
        const request: NovaEntregaRequest = {
            cliente: 'Cliente Teste',
            dataEnvio: new Date(),
            status: StatusEntrega.PENDENTE,
            endereco: 'Rua Teste',
            produto: 'Produto X',
            dataEstimadaEntrega: new Date(),
            observacoes: 'Teste observação'
        };

        service.novaEntrega(request).subscribe((res) => {
            expect(res).toBeNull();
        });

        const req = httpMock.expectOne(`${API_URL}/entrega`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(request);
        req.flush(null);
    });

    it('deve alterar status da entrega (PUT)', () => {
        const request: AlterarEntregaRequest = { status: StatusEntrega.ENTREGUE };

        service.alterarStatusEntrega('123', request).subscribe((res) => {
            expect(res).toEqual(mockEntrega);
        });

        const req = httpMock.expectOne(`${API_URL}/entrega/123`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(request);
        req.flush(mockEntrega);
    });

    describe('handleError', () => {
        it('deve tratar erro 400 (BadRequest)', () => {
            const mockError = new HttpErrorResponse({
                status: HttpStatusCode.BadRequest,
                error: { Descricao: 'Requisição inválida personalizada' }
            });

            service.obterEntregas().subscribe({
                next: () => fail('Deveria falhar com erro 400'),
                error: (err: ErrorResponse) => {
                    expect(err.Codigo).toBe(HttpStatusCode.BadRequest);
                    expect(err.Descricao).toBe('Requisição inválida personalizada');
                }
            });

            const req = httpMock.expectOne(`${API_URL}/entrega`);
            req.flush({ Descricao: 'Requisição inválida personalizada' }, { status: 400, statusText: 'Bad Request' });
        });

        it('deve tratar erro 500 (InternalServerError)', () => {
            service.obterEntregaPorCodigo('123').subscribe({
                next: () => fail('Deveria falhar com erro 500'),
                error: (err: ErrorResponse) => {
                    expect(err.Codigo).toBe(HttpStatusCode.InternalServerError);
                    expect(err.Descricao).toContain('Erro interno do servidor');
                }
            });

            const req = httpMock.expectOne(`${API_URL}/entrega/123`);
            req.flush({ Descricao: 'Erro interno do servidor' }, { status: 500, statusText: 'Server Error' });
        });

        it('deve tratar erro de rede (status 0)', () => {
            service.obterEntregas().subscribe({
                next: () => fail('Deveria falhar com erro de rede'),
                error: (err: ErrorResponse) => {
                    expect(err.Codigo).toBe(HttpStatusCode.ServiceUnavailable);
                    expect(err.Descricao).toBe('Serviço indisponível.');
                }
            });

            const req = httpMock.expectOne(`${API_URL}/entrega`);
            req.error(new ProgressEvent('Network error'), { status: 0, statusText: 'Unknown Error' });
        });
    });
});
