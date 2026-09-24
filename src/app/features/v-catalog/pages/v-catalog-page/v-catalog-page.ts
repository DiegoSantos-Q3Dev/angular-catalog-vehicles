import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { VAsidePanel } from '../../../../shared/components/v-aside-panel/v-aside-panel';
import { VCatalogCard } from '../../components/v-catalog-card/v-catalog-card';
import { VGobalSearch } from '../../../../core/services/v-global-search/v-gobal-search';
import { VCatalogBaseApi } from '../../../../core/services/v-catalog/interface/v-catalog-base-api';
import { VCatalogFilterComponent } from '../../components/v-catalog-filter/v-catalog-filter/v-catalog-filter';
import { VFilter } from '../../../../shared/models/v-filter/v-filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VCatalog } from '../../../../core/models/v-catalog/v-catalog';

@Component({
  selector: 'v-catalog-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    VAsidePanel,
    VCatalogFilterComponent,
    VCatalogCard
  ],
  styleUrl: './v-catalog-page.scss',
  templateUrl: './v-catalog-page.html',
})
export class VCatalogPage implements OnInit {
  private vCatalogApi = inject(VCatalogBaseApi);
  globalSearch = inject(VGobalSearch);

  allItens = signal<VCatalog[]>([]);
  isLoading = signal<boolean>(true);

  currentFilters = signal<VFilter['result']>({
    search: '',
    ranges: {
      price: { min: null, max: null },
      year: { min: null, max: null }
    },
    multiSelects: {
      brands: [],
      conditions: []
    }
  });

  currentPage = signal<number>(1);
  pageSize = signal<number>(6);

  constructor() {
    effect(() => {
      const globalQuery = this.globalSearch.globalSearchQuery();
      this.currentFilters.update((filters: any) => ({
        ...filters,
        search: globalQuery
      }));
      this.currentPage.set(1);
    });
  }

  ngOnInit(): void {
    this.loadCatalogData();
  }

  loadCatalogData(): void {
    this.isLoading.set(true);

    this.vCatalogApi.getVCatalog().subscribe({
      next: (data) => {
        this.allItens.set(data);
      },
      error: (err) => {
        console.error('Erro ao buscar o catálogo:', err);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  filteredItens = computed(() => {
    const filters = this.currentFilters();
    const items = this.allItens();

    return items.filter(item => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(query);
        const matchLocation = item.location?.toLowerCase().includes(query);
        if (!matchTitle && !matchLocation) return false;
      }

      const priceRange = filters.ranges?.['price'];
      if (priceRange) {
        if (priceRange.min !== null && priceRange.min !== undefined && item.price < priceRange.min) return false;
        if (priceRange.max !== null && priceRange.max !== undefined && item.price > priceRange.max) return false;
      }

      const rangeFilter = filters.ranges?.['year'];
      if (rangeFilter) {
        if (rangeFilter.min !== null && rangeFilter.min !== undefined && item.range < rangeFilter.min) return false;
        if (rangeFilter.max !== null && rangeFilter.max !== undefined && item.range > rangeFilter.max) return false;
      }

      const selectedBrands = filters.multiSelects?.['brands'] || [];
      if (selectedBrands.length > 0) {
        const matchBrand = selectedBrands.some(b => item.title?.toLowerCase().includes(b.toLowerCase()));
        if (!matchBrand) return false;
      }

      const selectedConditions = filters.multiSelects?.['conditions'] || [];
      if (selectedConditions.length > 0) {
        if (!selectedConditions.includes(item.badge)) return false;
      }

      return true;
    });
  });

  totalPages = computed(() => {
    const total = this.filteredItens().length;
    return Math.ceil(total / this.pageSize()) || 1;
  });

  paginatedItens = computed(() => {
    const items = this.filteredItens();
    const page = this.currentPage();
    const size = this.pageSize();
    const startIndex = (page - 1) * size;
    return items.slice(startIndex, startIndex + size);
  });

  onFilterChanged(filters: VFilter['result']) {
    this.currentFilters.set(filters);
    this.currentPage.set(1);

    if (!filters.search) {
      this.globalSearch.setQuery('');
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p: number) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p: number) => p - 1);
    }
  }
}
