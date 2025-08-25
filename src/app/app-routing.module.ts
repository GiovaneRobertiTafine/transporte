import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateDashboard } from './guards/dashboard.guard';
import { canActivateLogin } from './guards/login.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent() {
            return import('./templates/home.template').then(m => m.HomePage);
        },
        canActivate: [canActivateDashboard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                children: [
                    {
                        path: '',
                        loadComponent() {
                            return import('./pages/dashboard.page').then(m => m.DashboardPage);
                        },
                    },
                    {
                        path: ':id',
                        loadComponent() {
                            return import('./pages/dashboard-detail.page').then(m => m.DashboardDetailPage);
                        }
                    }
                ]
            },
            {
                path: 'nova-entrega',
                loadComponent() {
                    return import('./pages/nova-entrega.page').then(m => m.NovaEntregaPage);
                },
            },
            {
                path: 'relatorio',
                loadComponent() {
                    return import('./pages/relatorio.page').then(m => m.RelatorioPage);
                }
            },
            {
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    },
    {
        path: 'login',
        loadComponent() {
            return import('./pages/login.page').then(m => m.LoginPage);
        },
        canActivate: [canActivateLogin]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
