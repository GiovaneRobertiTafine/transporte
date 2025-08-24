import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SideMenuComponent } from "../components/side-menu.component";

@Component({
    selector: 'template-home',
    template: `	
        <div class="d-flex justify-content-between flex-column-reverse flex-md-row py-1 py-md-3 px-1 px-md-5">
            <div class="container-fluid">
                <router-outlet />
            </div>
            <component-side-menu />
        </div>
    `,
    styles: [`
        .home-container {
            display: flex;
            height: 100vh;
           
        }
    `],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterOutlet, SideMenuComponent]
})
export class HomePage { }
