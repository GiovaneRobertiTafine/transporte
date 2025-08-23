import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, QueryList, signal, ViewChildren } from "@angular/core";
import { ListaItensSideMenu } from "../models/constants/side-menu.constant";
import { CommonModule } from "@angular/common";
import { MenuItens } from "../models/types/side-menu.type";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'component-side-menu',
    template: `
        <button class="btn btn-secondary ms-auto mb-1" id="btn-menu" (click)="menuChange.set(!menuChange())">Menu</button>
        <nav class="card" id="box-menu">
            <div class="card-header">
                <div class="bg-primary rounded-3 text-center" id="box-icon-logo">
                    <img src="assets/icons/truck.svg" width="50" heigth="50" alt="truck">
                </div>
            </div>
            <div class="card-body">
                <ul class="links-side-menu">
                    <li 
                        class="d-flex gap-2 align-itens-center mb-3 cursor-pointer"  
                        *ngFor="let item of sideMenuItems; trackBy trackById"
                        routerLinkActive
                        [routerLink]="item.route"
                        #rla="routerLinkActive" #linksMenu>
                        <img 
                            *ngIf="item.icon" 
                            [src]="'assets/icons/' + item.icon + '.svg'" 
                            alt="plus-circle"
                            [ngClass]="rla.isActive? 'icon-item-active': 'icon-item'">
                        <div *ngIf="!item.icon" style="width: 16px; heigth: 24px;"></div>
                        <a 
                            class="text-decoration-none"
                            [ngClass]="rla.isActive? 'text-primary fw-bold': 'text-muted'"
                            >{{item.title}}</a>
                    </li>
                </ul>
            </div>
        </nav>
    `,
    styles: [`
        :host {
            min-width: 200px;
            min-height: 100%;
            position: relative;

            #box-menu { display: block; } 
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

        .icon-item-active {
            filter: invert(36%) sepia(77%) saturate(4942%) hue-rotate(209deg) brightness(100%) contrast(99%);
        }

        .icon-item {
            filter: invert(17%) sepia(16%) saturate(440%) hue-rotate(169deg) brightness(101%) contrast(86%);
        }

        #btn-menu {
            display: none;
        }

        @media (max-width: 768px) {
            :host {
                height: auto;
                z-index: 99999;

                &.menu-close { 
                    #box-menu { display: none; }
                }

                &.menu-open { 
                    #box-menu { display: block; }
                }
            }
            #btn-menu {
                display: block;
            }
            #box-menu {
                position: absolute;
                top: 100%;
                width: 100%;                
            }
        }
       
    `],
    host: {
        '[class.menu-open]': 'menuChange()',
        '[class.menu-close]': '!menuChange()',
    },
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class SideMenuComponent {
    protected sideMenuItems = ListaItensSideMenu;
    protected menuChange = signal(false);
    @ViewChildren('linksMenu') linksMenu!: QueryList<ElementRef>;

    private elementRef = inject(ElementRef);

    trackById(index: number, item: MenuItens): string {
        return item.route;
    }

    @HostListener('document:click', ['$event.target'])
    onClick(targetElement: HTMLElement): void {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside ||
            this.linksMenu.find((e) => e.nativeElement.contains(targetElement)))
            this.menuChange.set(false);
    }
}
