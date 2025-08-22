import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ListaItensSideMenu } from "../models/constants/side-menu.constant";
import { CommonModule } from "@angular/common";
import { MenuItens } from "../models/types/side-menu.type";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'component-side-menu',
    template: `
        <nav class="card h-100">
            <div class="card-header">
                <div class="bg-primary rounded-3 text-center" id="box-icon-logo">
                    <img src="assets/icons/truck.svg" width="50" heigth="50" alt="truck">
                </div>
            </div>
            <div class="card-body">
                <ul class="links-side-menu">
                    <li *ngFor="let item of sideMenuItems; trackBy trackById">
                        <a class="text-decoration-none text-reset" [routerLink]="item.route">{{item.title}}</a>
                    </li>
                </ul>
            </div>
        </nav>
    `,
    styles: [`
        :host {
            min-width: 200px;
            min-height: 100%;
        }

        .links-side-menu {
            list-style-type: none;
            padding-left: 0px;
            white-space: nowrap;
        }

        #box-icon-logo {
            width: 70px; height: 70px;
            display: flex; justify-content: center;
        }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink],
})
export class SideMenuComponent {
    protected sideMenuItems = ListaItensSideMenu;

    trackById(index: number, item: MenuItens): string {
        return item.route;
    }
}
