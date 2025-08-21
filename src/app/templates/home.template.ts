import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SideMenuComponent } from "../components/side-menu.component";

@Component({
    selector: 'template-home',
    template: `	
        <div class="home-container">
            <router-outlet></router-outlet>
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
