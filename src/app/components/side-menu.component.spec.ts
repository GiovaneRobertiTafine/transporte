import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { ListaItensSideMenu } from '../models/constants/side-menu.constant';

@Component({ template: '' })
class DummyComponent { }

describe('SideMenuComponent', () => {
    let component: SideMenuComponent;
    let fixture: ComponentFixture<SideMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SideMenuComponent,
                RouterTestingModule.withRoutes([
                    { path: 'home/dashboard', component: DummyComponent },
                    { path: 'home/nova-entrega', component: DummyComponent },
                ])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SideMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve renderizar os itens do menu', () => {
        const menuItems = fixture.debugElement.queryAll(By.css('.links-side-menu li'));
        expect(menuItems.length).toBe(ListaItensSideMenu.length);

        const firstItemText = menuItems[0].nativeElement.textContent.trim();
        expect(firstItemText).toContain('Dashboard');
    });

    it('deve aplicar a classe correta quando menuChange = true (menu aberto)', () => {
        component['menuChange'].set(true);
        fixture.detectChanges();

        const hostElement = fixture.debugElement.nativeElement as HTMLElement;
        expect(hostElement.classList).toContain('menu-open');
        expect(hostElement.classList).not.toContain('menu-close');
    });

    it('deve aplicar a classe correta quando menuChange = false (menu fechado)', () => {
        component['menuChange'].set(false);
        fixture.detectChanges();

        const hostElement = fixture.debugElement.nativeElement as HTMLElement;
        expect(hostElement.classList).toContain('menu-close');
        expect(hostElement.classList).not.toContain('menu-open');
    });

    it('deve alternar o estado do menu ao clicar no botão "Menu"', () => {
        const button = fixture.debugElement.query(By.css('#btn-menu')).nativeElement as HTMLButtonElement;

        expect(component['menuChange']()).toBeFalse();

        button.click();
        fixture.detectChanges();
        expect(component['menuChange']()).toBeTrue();

        button.click();
        fixture.detectChanges();
        expect(component['menuChange']()).toBeFalse();
    });

    it('deve fechar o menu quando clicar fora do componente', () => {
        component['menuChange'].set(true);
        fixture.detectChanges();

        // Simula clique fora
        const fakeTarget = document.createElement('div');
        component.onClick(fakeTarget);

        expect(component['menuChange']()).toBeFalse();
    });

    it('não deve fechar o menu quando clicar dentro do componente', () => {
        component['menuChange'].set(true);
        fixture.detectChanges();

        const hostElement = fixture.debugElement.nativeElement as HTMLElement;
        component.onClick(hostElement);

        expect(component['menuChange']()).toBeTrue();
    });

    it('deve usar trackById corretamente', () => {
        const item = ListaItensSideMenu[0];
        const result = component.trackById(0, item);
        expect(result).toBe(item.route);
    });
});
