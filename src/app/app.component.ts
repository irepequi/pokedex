import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { SearchComponent } from "./components/search/search.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ListComponent } from './components/list/list.component';

import { AppStateService } from './services/app-state.service';
import { PokemonService } from './services/pokemon.service';
import { FilterService } from './services/filter.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    SearchComponent,
    MenuComponent,
    InputSwitchModule,
    FormsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  title = 'pokedex-app';
  drawerVisible: boolean = false;
  isDark: boolean = true;

  constructor(
    public appStateService: AppStateService,
    private pokemonService: PokemonService,
    private filterService: FilterService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  /**
   * Closes the drawer component.
   *
   * @param e - The event object that triggered the close operation.
   *
   * @returns {void} - This function does not return any value.
   */
  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  /**
   * Manually triggers a change detection cycle after the view has been initialized.
   *
   * This method is used to ensure that any changes made to the component's properties or state are properly reflected in the view.
   *
   * @returns {void} - This method does not return any value.
   */
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  /**
   * Toggles the dark mode of the application by adding or removing the 'my-app-dark' class to the HTML element.
   *
   * @returns {void} - This function does not return any value.
   */
  toggleDarkMode() {
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');
  }

  /**
   * Toggles the visibility of the details component.
   *
   * @returns {void} - This function does not return any value.
   */
  toggleDetailsVisibility(): void {
    this.appStateService.showDetails();
  }

  /**
   * Toggles the visibility of the list component.
   *
   * @returns {void} - This function does not return any value.
   */
  toggleListVisibility(): void {
    this.appStateService.showList();
  }

  toggleResetList(): void {
    this.filterService.resetAll();
    this.appStateService.showList();
  }
}
