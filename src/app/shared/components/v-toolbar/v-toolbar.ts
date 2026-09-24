import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VNavMenu } from "../v-nav-menu/v-nav-menu";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from "@angular/material/badge"
import { MatMenuModule } from '@angular/material/menu';
import { VBreadcrumbs } from "../v-breadcrumbs/v-breadcrumbs";
import { VGobalSearch } from '../../../core/services/v-global-search/v-gobal-search';

@Component({
  imports: [
    FormsModule,
    VNavMenu,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    VBreadcrumbs
  ],
  selector: 'v-toolbar',
  styleUrl: './v-toolbar.scss',
  templateUrl: './v-toolbar.html',
})
export class VToolbar implements OnInit {
  searchService = inject(VGobalSearch);
  showTopMenu = model<boolean>(false);
  isDarkMode = signal<boolean>(false);
  isTopMenuPinned = model<boolean>(false);

  toggleThemeLabel = signal<string>('Trocar Tema');
  toggleMenuLabel = signal<string>('Trocar Menu');
  toggleMenuModeLabel = signal<string>('Modo do menu');

  isSearchExpanded = false;
  private isInputFocused = false;

  toggleThemeIcon = computed(() => this.isDarkMode()
    ? 'light_mode'
    : 'dark_mode'
  );
  toggleThemeTitle = computed(() => `${this.isDarkMode() ? 'Claro' : 'Escuro'}`);
  toggleMenuIcon = computed(() => this.showTopMenu() ? 'side_navigation' : 'toolbar');
  toggleMenuTitle = computed(() => `${this.showTopMenu() ? 'Lateral' : 'Topo'}`);
  toggleMenuModeIcon = computed(() => this.isTopMenuPinned() ? 'mouse_lock' : 'mouse');
  toggleMenuModeTitle = computed(() => this.isTopMenuPinned()
    ? 'Liberar menu para abrir ao passar o mouse'
    : 'Travar menu para abrir por clique'
  );

  ngOnInit() {
    const isDarkActive = document.documentElement.classList.contains('dark');
    this.isDarkMode.set(isDarkActive);
  }

  toggleTheme() {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  }

  toggleMenu() {
    this.showTopMenu.update(value => !value);
  }

  toggleMenuMode() {
    this.isTopMenuPinned.update(value => !value);
  }

  expandSearch() {
    this.isSearchExpanded = true;
  }

  collapseSearch() {
    if (!this.isInputFocused) {
      this.isSearchExpanded = false;
    }
  }

  onSearchIconClick(inputElement: HTMLInputElement) {
    this.isSearchExpanded = true;
    inputElement.focus();
    this.isInputFocused = true;
  }

  checkCollapse(event: FocusEvent) {
    this.isInputFocused = false;
    this.isSearchExpanded = false;
  }
}
