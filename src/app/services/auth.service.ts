import { inject, Injectable, Signal, signal } from '@angular/core';
import { AuthState } from '../states/auth.state';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authState = inject(AuthState);

    verificacaoInicialAutenticacao(): void {
        const token = localStorage.getItem('token');
        const usuario = localStorage.getItem('usuario');
        if (token && usuario) {
            this.authState.autenticar(token, usuario);
        } else {
            this.authState.desautenticar();
        }
    }

}
