import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, QueryList, signal, ViewChild, ViewChildren } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, defer, delay, finalize, take } from "rxjs";
import { RelatorioService } from "../services/relatorio.service";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { CommonModule, DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { BaseChartDirective, NgChartsModule } from "ng2-charts";
import { ChartConfiguration, ChartData } from "chart.js";
import { StatusEntrega } from "../models/enums/status-entrega.enum";
import { DeParaPipe } from "../pipes/de-para.pipe";

@Component({
    selector: 'page-relatorio',
    template: `
        <div>
            <h3>Relatório de Entregas</h3>
            <div class="row mx-0 gx-2">
                <div class="col-12 p-3 position-relative" aria-labelledby="relatorio-qtd-atrasadas">
                    <h5 id="relatorio-qtd-atrasadas">Quantidade de Entregas Atrasadas</h5>
                    <p *ngIf="qtdAtrasadas() !== null">
                        Total de entregas atrasadas: <strong>{{qtdAtrasadas()}}</strong>
                    </p>
                    <ngx-spinner name="relatorio-qtd-atrasadas" [fullScreen]="false" type="ball-scale-multiple"/>
                </div>
                <div class="col-12 col-md-auto position-relative">
                    <div class="card p-3">
                        <h5 id="relatorio-qtd-por-status">Quantidade de Entregas por Status</h5>
                        <div>
                            <canvas 
                                baseChart
                                type="pie"
                                [data]="chartQtdPorStatus"
                                [options]="pieChartOptions"
                                aria-label="chart-relatorio-qtd-por-status"
                                >
                            </canvas>
                        </div>
                        <ng-template #vazioTotalPorStatus>
                            Sem valor para este gráfico
                        </ng-template>
                    </div>

                    <ngx-spinner name="relatorio-qtd-por-status" [fullScreen]="false" type="ball-scale-multiple"/>
                </div>
                <div class="col-12 col-md-auto position-relative">
                    <div class="card p-3">
                        <h5 id="relatorio-qtd-por-status">
                            Quantidade de Entregas no intervalo de {{dataInicial | date: 'dd/MM/yyyy'}} à 
                            {{dataFinal | date: 'dd/MM/yyyy'}}</h5>
                        <canvas 
                            baseChart
                            type="bar"
                            [data]="chartQtdEntregaDia"
                            [options]="barChartOptions"
                            aria-label="chart-relatorio-qtd-por-status"
                            >
                        </canvas>
                    </div>

                    <ngx-spinner name="relatorio-qtd-entrega-por-dia" [fullScreen]="false" type="ball-scale-multiple"/>

                </div>
            </div>
        </div>
    `,
    standalone: true,
    imports: [
        CommonModule,
        NgxSpinnerModule,
        NgChartsModule,
    ],
    providers: [DeParaPipe, DatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatorioPage implements AfterViewInit {
    @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
    private viewInitialized = signal(false);
    protected dataInicial = new Date();
    protected dataFinal = new Date(this.dataInicial.getTime() + 7 * 24 * 60 * 60 * 1000);
    // private intervaloData = this.criarArrayDatas(this.dataInicial, this.dataFinal);

    private deParaPipe = inject(DeParaPipe);
    private datePipe = inject(DatePipe);

    public pieChartOptions: ChartConfiguration['options'] = {
        plugins: {
            legend: {
                display: true,
            },
        },
        responsive: true,
    };
    public barChartOptions: ChartConfiguration['options'] = {
        plugins: {
            legend: {
                display: false,
            },
        },
        responsive: true,
    };

    public chartQtdPorStatus: ChartData<'pie', number[], string | string[]> = {
        labels: [
        ],
        datasets: [
            {
                data: []
            }
        ],
    };

    public chartQtdEntregaDia: ChartData<'bar', number[], string | string[]> = {
        labels: [
        ],
        datasets: [
            {
                data: []
            }
        ],
    };

    criarArrayDatas(dataInicio: Date, dataFim: Date) {
        const datas = [];
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);

        for (let data = new Date(inicio); data <= fim; data.setDate(data.getDate() + 1)) {
            datas.push(new Date(data));
        }

        return datas;
    }

    private relatorioService = inject(RelatorioService);
    private ngxSpinnerService = inject(NgxSpinnerService);
    private toastrService = inject(ToastrService);

    protected qtdAtrasadas = toSignal(
        defer(() => {
            this.ngxSpinnerService.show('relatorio-qtd-atrasadas');
            return this.relatorioService.obterQuantidadeEntregaAtrasada().pipe(
                finalize(() => this.ngxSpinnerService.hide('relatorio-qtd-atrasadas')),
                take(1),
                catchError((_) => {
                    this.toastrService.error('Erro ao obter quantidade de entregas atrasadas');
                    return [null];
                })
            );
        })
        , { initialValue: null });

    protected totalPorStatus = toSignal(
        defer(() => {
            this.ngxSpinnerService.show('relatorio-qtd-por-status');
            return this.relatorioService.obterQuantidadePorStatus().pipe(
                finalize(() => this.ngxSpinnerService.hide('relatorio-qtd-por-status')),
                take(1),
                catchError((error) => {
                    this.toastrService.error('Erro as obter o total de entregas por status');
                    return [null];
                })
            );
        })
        , { initialValue: null });

    protected qtdEntregaPorDia = toSignal(
        defer(() => {
            this.ngxSpinnerService.show('relatorio-qtd-entrega-por-dia');
            const dataInicio = this.dataInicial;
            const dataFim = this.dataFinal;
            dataInicio.setHours(0, 0, 0);
            dataFim.setHours(23, 59, 59);
            return this.relatorioService.obterEntregaPorIntervaloDia({
                dataInicio: dataInicio.toDateString(),
                dataFim: dataFim.toDateString()
            }).pipe(
                finalize(() => this.ngxSpinnerService.hide('relatorio-qtd-entrega-por-dia')),
                take(1),
                catchError((error) => {
                    this.toastrService.error('Erro as obter o total de entregas por intervalo de datas.');
                    return [null];
                })
            );
        })
        , { initialValue: null });

    efChartQtdPorStatus = effect(() => {
        const totalPorStatus = this.totalPorStatus();
        if (totalPorStatus && this.viewInitialized() && this.chartQtdPorStatus) {
            this.chartQtdPorStatus.datasets[0].data = [...totalPorStatus.map((v) => v.quantidade)];
            this.chartQtdPorStatus.labels = [...Object.keys(StatusEntrega)
                .filter((key) => isNaN(Number(key)))
                .map(key => this.deParaPipe.transform(key, 'status-entrega') as string)];

            this.charts.forEach((chart, index) => {
                if ((chart.ctx as any)['canvas'].ariaLabel === 'chart-relatorio-qtd-por-status')
                    chart.update();
            });
        }
    });

    efChartQtdEntregaPorDia = effect(() => {
        const qtdEntregaPorDia = this.qtdEntregaPorDia();
        if (qtdEntregaPorDia && this.viewInitialized() && this.chartQtdEntregaDia) {
            this.chartQtdEntregaDia.datasets[0].data =
                [...qtdEntregaPorDia.map((v) => v.quantidade)];
            this.chartQtdEntregaDia.labels =
                [...qtdEntregaPorDia.map((d) => this.datePipe.transform(d.dia, 'dd/MM/yyyy') as string)];

            this.charts.forEach((chart, index) => {
                if ((chart.ctx as any)['canvas'].ariaLabel === 'chart-relatorio-qtd-por-status')
                    chart.update();
            });
        }
    });

    ngAfterViewInit(): void {
        this.viewInitialized.set(true);
    }
}
