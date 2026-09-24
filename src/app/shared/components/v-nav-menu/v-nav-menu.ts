import { Component, ElementRef, HostListener, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavItem } from '../../models/v-nav-menu/nav-item';

const DEFAULT_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', route: '/', icon: 'home' },
  {
    label: 'Catálogo', route: '/catalogo', icon: 'directions_car', children: [
      { label: 'Veículos', route: '/catalogo/veiculos', icon: 'directions_car' },
      { label: 'Marcas', route: '/catalogo/marcas', icon: 'sell' },
    ],
  },
  { label: 'Sobre', route: '/sobre', icon: 'info' },
  { label: 'Contato', route: '/contato', icon: 'mail' },
];

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule
  ],
  selector: 'v-nav-menu',
  styleUrl: './v-nav-menu.scss',
  templateUrl: './v-nav-menu.html',
})
export class VNavMenu implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private routerSubscription?: Subscription;
  placement = input<'toolbar' | 'side'>('side');
  interactionMode = input<'hover' | 'click'>('click');
  items = input<readonly NavItem[]>(DEFAULT_NAV_ITEMS);
  expandedRoutes = signal<ReadonlySet<string>>(new Set());
  hoveredRoutes = signal<ReadonlySet<string>>(new Set());

  ngOnInit() {
    this.updateExpandedRoutes(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.updateExpandedRoutes(event.urlAfterRedirects));
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  hasChildren(item: NavItem) {
    return !!item.children?.length;
  }

  isExpanded(item: NavItem) {
    if (!item.route) {
      return false;
    }

    return this.interactionMode() === 'hover'
      ? this.hoveredRoutes().has(item.route)
      : this.expandedRoutes().has(item.route);
  }

  toggleItem(item: NavItem) {
    if (!item.route || !item.children?.length) {
      return;
    }

    const expandedRoutes = new Set(this.expandedRoutes());
    if (expandedRoutes.has(item.route)) {
      expandedRoutes.delete(item.route);
    } else {
      expandedRoutes.add(item.route);
    }
    this.expandedRoutes.set(expandedRoutes);
  }

  handleItemMouseEnter(item: NavItem) {
    if (this.interactionMode() !== 'hover' || !item.route || !item.children?.length) {
      return;
    }

    const expandedRoutes = new Set(this.hoveredRoutes());
    expandedRoutes.add(item.route);
    this.hoveredRoutes.set(expandedRoutes);
  }

  handleItemMouseLeave(item: NavItem) {
    if (this.interactionMode() !== 'hover' || !item.route || !item.children?.length) {
      return;
    }

    const expandedRoutes = new Set(this.hoveredRoutes());
    expandedRoutes.delete(item.route);
    this.hoveredRoutes.set(expandedRoutes);
  }

  @HostListener('document:click', ['$event'])
  closeToolbarMenuOnOutsideClick(event: MouseEvent) {
    if (this.placement() === 'toolbar' && this.interactionMode() === 'click'
      && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.expandedRoutes.set(new Set());
    }
  }

  private updateExpandedRoutes(url: string) {
    const expandedRoutes = new Set<string>();
    this.collectActiveParents(this.items(), url, expandedRoutes);
    this.expandedRoutes.set(expandedRoutes);
  }

  private collectActiveParents(items: readonly NavItem[], url: string, expandedRoutes: Set<string>): boolean {
    for (const item of items) {
      if (item.children?.length && this.collectActiveParents(item.children, url, expandedRoutes)) {
        if (item.route) {
          expandedRoutes.add(item.route);
        }
        return true;
      }

      if (item.route && item.route !== '/' && url.startsWith(item.route)) {
        return true;
      }
    }
    return false;
  }
}
