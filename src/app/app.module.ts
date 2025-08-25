import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr';
import { EntregaService } from './services/entrega.service';
import { LoginService } from './services/login.service';
import { AuthService } from './services/auth.service';
import { dashboardInterceptor } from './interceptors/dashboard.interceptor';
import { NgChartsModule } from 'ng2-charts';

function initializeApp(authService: AuthService) {
    return () => authService.verificacaoInicialAutenticacao();
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        BrowserAnimationsModule,
        NgxSpinnerModule,
        ToastrModule.forRoot({
            timeOut: 3000,
        }),
        NgChartsModule
    ],
    providers: [
        provideHttpClient(
            withInterceptors([dashboardInterceptor])
        ),
        EntregaService, LoginService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AuthService],
            multi: true,
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
