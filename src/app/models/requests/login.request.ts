import { FormControl } from "@angular/forms";

export interface LoginRequest {
    email: string;
    password: string;
}

export type LoginForm = { [key in keyof LoginRequest]: FormControl };
