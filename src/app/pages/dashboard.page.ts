import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'page-dashboard',
    template: `
        <h1>Dashboard de Entregas</h1>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage { }
