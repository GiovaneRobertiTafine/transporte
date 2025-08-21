import { Pipe } from "@angular/core";

@Pipe({
    name: 'dePara',
    standalone: true
})
export class DeParaPipe {
    transform(value: string | number, dePara: { [key: string]: string; }): string | number {
        return dePara[value.toString()] || value;
    }
}
