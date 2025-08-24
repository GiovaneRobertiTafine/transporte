import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LoginForm, LoginRequest } from "../models/requests/login.request";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { finalize } from "rxjs";
import { LoginService } from "../services/login.service";
import { Router } from "@angular/router";
import { AuthState } from "../states/auth.state";

@Component({
    selector: "page-login",
    template: `
        <div class="w-100 h-100 d-flex justify-content-center align-items-start align-items-md-center">
            <div class="card h-auto mt-3 mt-md-0">
                <div class="card-header">
                    <div class="box-icon-logo mx-auto">
                        <img src="assets/icons/truck.svg" width="50" heigth="50" alt="logotipo">
                    </div>
                </div>
                <div class="card-body">
                    <form [formGroup]="loginForm" (ngSubmit)="login()" id="formulario">
                        <div class="mb-3">
                            <label class="form-label" for="email">E-mail</label>
                            <input class="form-control" id="email" aria-describedby="email" formControlName="email" />
                            <div class="small text-danger" id="produto-required" role="alert" *ngIf="loginForm.get('email')?.hasError('email') && 
                            loginForm.get('email')?.touched">
                                Insira um e-mail válido
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="senha">Senha</label>
                            <input class="form-control" type="password" id="senha" aria-describedby="senha" autocomplete="on"
                                formControlName="password" />
                        </div>
                        <button class="btn btn-primary w-100" label="Submit" type="submit" [disabled]="loginForm.invalid">Login</button>
                    </form>
                </div>
            </div>
        </div>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ReactiveFormsModule]
})
export class LoginPage {

    private fb = inject(FormBuilder);
    private ngxSpinnerService = inject(NgxSpinnerService);
    private toastrService = inject(ToastrService);
    private destroyRef = inject(DestroyRef);
    private loginService = inject(LoginService);
    private router = inject(Router);
    private authState = inject(AuthState);

    protected loginForm = this.fb.group<LoginForm>({
        email: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
        password: this.fb.control('', { nonNullable: true, validators: [Validators.required,] }),
    });

    login(): void {
        this.ngxSpinnerService.show();
        this.loginService.login(this.loginForm.value as LoginRequest)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => this.ngxSpinnerService.hide())
            )
            .subscribe({
                next: (res) => {
                    this.authState.autenticar(res.token!, this.loginForm.controls.email.value);
                    this.router.navigate(['/home']);
                },
                error: (error: string) => {
                    this.toastrService.error(error, 'Erro ao efetuar o login');
                }
            });
    }

}
