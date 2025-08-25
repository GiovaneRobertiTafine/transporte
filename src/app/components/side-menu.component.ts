import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, QueryList, signal, ViewChildren } from "@angular/core";
import { ListaItensSideMenu } from "../models/constants/side-menu.constant";
import { CommonModule } from "@angular/common";
import { MenuItens } from "../models/types/side-menu.type";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AuthState } from "../states/auth.state";

@Component({
    selector: 'component-side-menu',
    template: `
        <button class="btn btn-secondary mb-1" id="btn-menu" aria-controls="box-menu"
        [attr.aria-expanded]="menuChange()" (click)="menuChange.set(!menuChange())">Menu</button>
        <nav class="card" id="box-menu" aria-labelledby="btn-menu">
            <div class="card-header">
                <div class="box-icon-logo">
                    <img src="assets/icons/truck.svg" width="50" heigth="50" alt="logotipo">
                </div>
            </div>
            <div class="card-body">
                <ul class="links-side-menu list-unstyled">
                    <li *ngFor="let item of sideMenuItems; trackBy trackById" #linksMenu>
                        <a [routerLink]="item.route" 
                        routerLinkActive="active-link" 
                        #rla="routerLinkActive"
                        class="d-flex gap-2 align-items-center mb-3 text-decoration-none"
                        [ngClass]="rla.isActive? 'text-primary fw-bold': 'text-muted'">
                            <img 
                                *ngIf="item.icon" 
                                [src]="'assets/icons/' + item.icon + '.svg'" 
                                [alt]="item.route"
                                aria-hidden="true"
                                [ngClass]="rla.isActive? 'icon-item-active': 'icon-item'">
                            {{item.title}}
                        </a>
                    </li>
                </ul>
            </div>
            <div class="card-footer">
                <div class="d-inline-flex align-item-center cursor-pointer" (click)="sair()">
                    <img 
                        src="assets/icons/exit.svg" 
                        alt="exit"
                        aria-hidden="true"
                        class="me-2"
                    >
                    Sair
                </div>
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
            padding-left: 0px;
            white-space: nowrap;
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
                float: inline-end;
                margin-left: auto;
                min-width: auto;


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
                width: calc(100vw - 0.5rem);
                right: 0;              
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
    private router = inject(Router);
    private authState = inject(AuthState);

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

    sair(): void {
        this.authState.desautenticar();
        this.router.navigate(['/login']);
    }
}
