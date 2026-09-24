import { AfterViewInit, Component, computed, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";

@Component({
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  host: {
    '[class.collapsed]': '!isOpen()',
    '[class.collapse-to-button]': 'collapseToButton()',
    '[class.edge-toggle]': 'togglePlacement() === \'edge\'',
    '[class.right]': 'asidePanelOnRight()',
    '[class.fadeInPanel]': 'asidePanelFadeIn()'
  },
  selector: 'v-aside-panel',
  styleUrl: './v-aside-panel.scss',
  templateUrl: './v-aside-panel.html',
})
export class VAsidePanel implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  title = input<string>('');
  icon = input<string>('');
  position = input<'left' | 'right'>('left');
  collapseToButton = input(false);
  hoverToOpen = input(false);
  clickToPin = input(false);
  showToggle = input(true);
  showToggleWhenCollapsed = input(true);
  hideContentWhenCollapsed = input(true);
  togglePlacement = input<'header' | 'edge'>('header');
  toggleIcons = input<{ open: string; closed: string }>();
  fadeInPanel = input(false);
  isOpen = model<boolean>(false);
  isPinned = model(false);
  isReady = signal<boolean>(false);
  titleIconRight = computed(() => this.position() === 'right');
  asidePanelToggleButtonIcon = computed(() => {
    const icons = this.toggleIcons();

    if (this.clickToPin()) {
      return this.isPinned()
        ? icons?.open ?? 'lock'
        : icons?.closed ?? 'mouse';
    }

    if (icons) {
      return this.isOpen() ? icons.open : icons.closed;
    }

    return this.isOpen()
      ? (this.position() === 'right' ? 'right_panel_close' : 'left_panel_close')
      : (this.position() === 'right' ? 'right_panel_open' : 'left_panel_open');
  });
  asidePanelToggleButtonLabel = computed(() => this.clickToPin()
    ? (this.isPinned() ? 'Liberar menu' : 'Travar menu aberto')
    : `Painel - ${this.title() || 'Navegação'}`
  );
  asidePanelToggleButtonTitle = computed(() => this.clickToPin()
    ? (this.isPinned()
      ? 'Liberar menu e ativar abertura ao passar o mouse'
      : 'Travar menu aberto e ativar abertura por clique')
    : `${this.isOpen() ? 'Recolher' : 'Expandir'} ${this.asidePanelToggleButtonLabel()}`
  );
  asidePanelInteractionTitle = computed(() => {
    if (!this.clickToPin()) {
      return null;
    }

    return this.isPinned()
      ? 'Modo clique: clique no menu para abrir e fora dele para fechar'
      : 'Modo mouse: passe o mouse para abrir o menu';
  });
  asidePanelOnRight = computed(() => this.position() === 'right');
  asidePanelFadeIn = computed(() => this.fadeInPanel());

  ngAfterViewInit() {
    setTimeout(() => this.isReady.set(true), 50);
  }

  toggle() {
    this.isOpen.update(value => !value);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if (this.clickToPin() && this.isPinned() && this.isOpen()
      && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  handleToggleClick() {
    if (this.clickToPin()) {
      this.togglePinned();
      return;
    }

    this.toggle();
  }

  handlePanelClick() {
    if (this.clickToPin() && this.isPinned() && !this.isOpen()) {
      this.isOpen.set(true);
    }
  }

  handleMouseEnter() {
    if (this.hoverToOpen() && !this.isPinned()) {
      this.isOpen.set(true);
    }
  }

  handleMouseLeave() {
    if (this.hoverToOpen() && !this.isPinned()) {
      this.isOpen.set(false);
    }
  }

  togglePinned() {
    if (!this.clickToPin()) {
      return;
    }

    this.isPinned.update(value => !value);
  }
}
