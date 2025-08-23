import { Directive, ElementRef, inject, Input } from "@angular/core";
import { AbstractControl, FormGroup, FormGroupDirective, NgForm } from "@angular/forms";

@Directive({
    selector: '[focusInvalid]',
    exportAs: 'focusInvalid',
    standalone: true
})
export class FormInvalidFocus {
    @Input('selectorInvalid') selectorInvalid: string | string[] = '.ng-invalid';
    private el = inject(ElementRef);
    private formGroupDir = inject(FormGroupDirective, { optional: true });
    private ngForm = inject(NgForm, { optional: true });

    public focus(): void {
        this.markAllAsTouched();

        let invalidControl = null;
        if (typeof (this.selectorInvalid) === 'string') {
            invalidControl = this.el.nativeElement.querySelector(this.selectorInvalid);
        }
        else if (Array.isArray(this.selectorInvalid)) {
            for (const el of this.selectorInvalid) {
                const control = this.el.nativeElement.querySelector(el);
                if (control) {
                    invalidControl = control;
                    break;
                }
            }
        }
        if (invalidControl) {
            invalidControl.focus();
        }
    }

    private markAllAsTouched(): void {
        const form: FormGroup | null = this.formGroupDir?.control || this.ngForm?.control || null;
        if (form) {
            Object.values(form.controls).forEach((ctrl: AbstractControl) => {
                ctrl.markAsTouched();
            });
        }
    }
}
