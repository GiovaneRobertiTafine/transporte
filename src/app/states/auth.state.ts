import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthState {
    private _token = signal('');
    private _usuario = signal('');

    public token = this._token.asReadonly();
    public usuario = this._usuario.asReadonly();

    autenticar(token: string, usuario: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', usuario);

        this._token.set(token);
        this._usuario.set(usuario);
    }

    desautenticar(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        this._token.set('');
        this._usuario.set('');
    }

    estaAutenticado(): boolean {
        console.log(this._token(), this._usuario());
        return !!(this._token() && this.usuario());
    }

}
