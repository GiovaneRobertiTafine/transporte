import { Directive, ElementRef, inject, Input } from "@angular/core";

@Directive({
    selector: '[focusInvalid]',
    exportAs: 'focusInvalid',
    standalone: true
})
export class FormInvalidFocus {
    @Input('selectorInvalid') selectorInvalid: string | string[] = '.ng-invalid';
    private el = inject(ElementRef);

    public focus(): void {
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
}
