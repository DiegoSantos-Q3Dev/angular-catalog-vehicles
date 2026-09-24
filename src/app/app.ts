import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VToolbar } from "./shared/components/v-toolbar/v-toolbar";
import { VAsidePanel } from "./shared/components/v-aside-panel/v-aside-panel";
import { VNavMenu } from "./shared/components/v-nav-menu/v-nav-menu";
import { MatIconRegistry, MatIcon } from '@angular/material/icon';
import { VBrandIcon } from './core/services/v-brand-icon/v-brand-icon';
import { VAiChatPage } from './features/v-ai-chat/pages/v-ai-chat-page/v-ai-chat-page';

@Component({
  imports: [
    RouterOutlet,
    VToolbar,
    VAsidePanel,
    VNavMenu,
    VAiChatPage,
    MatIcon
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private matIconRegistry = inject(MatIconRegistry);
  private brandIconService = inject(VBrandIcon);
  showTopMenu = signal<boolean>(false);
  isMenuPinned = signal<boolean>(false);
  currentYear = new Date().getFullYear();

  constructor() {
    this.matIconRegistry.registerFontClassAlias('fontawesome', 'fa-solid');
    this.matIconRegistry.registerFontClassAlias('fa-brands', 'fa-brands');
    this.brandIconService.registerIcons();
  }
}
