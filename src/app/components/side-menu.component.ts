import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ListaItensSideMenu } from "../models/constants/side-menu.constant";
import { CommonModule } from "@angular/common";
import { MenuItens } from "../models/types/side-menu.type";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'component-side-menu',
    template: `
        <nav>
            <ul>
                <li *ngFor="let item of sideMenuItems; trackBy trackById">
                    <a [routerLink]="item.route">{{item.title}}</a>
                </li>
            </ul>
        </nav>
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink]
})
export class SideMenuComponent {
    protected sideMenuItems = ListaItensSideMenu;

    trackById(index: number, item: MenuItens): string {
        return item.route;
    }
}
