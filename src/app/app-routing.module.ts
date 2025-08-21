import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent() {
            return import('./templates/home.template').then(m => m.HomePage);
        },
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
                path: '**',
                redirectTo: 'dashboard'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
