import { inject, Service } from '@angular/core';
import { VCatalogBaseApi } from './interface/v-catalog-base-api';
import { Observable } from 'rxjs';
import { VCatalog } from '../../models/v-catalog/v-catalog';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Service()
export class VCatalogApi implements VCatalogBaseApi {
  private http = inject(HttpClient);
  private apiUrl = `${environment.catalogApiUrl}/vehicles`;

  getVCatalog(): Observable<VCatalog[]> {
     return this.http.get<VCatalog[]>(this.apiUrl);
  }

  getVCatalogById(id: number): Observable<VCatalog | undefined> {
    return this.http.get<VCatalog>(`${this.apiUrl}/${id}`);
  }
}
