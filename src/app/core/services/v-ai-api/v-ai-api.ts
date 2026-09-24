import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VAiApi {
  private http = inject(HttpClient);

  sendMessageToGemini(prompt: string): Observable<string> {
    const headers = new HttpHeaders({
      'x-app-secret': environment.appSecret || ''
    });

    return this.http.post<{ text: string }>('/api/gemini', { prompt }, { headers }).pipe(
      map(response => response?.text || 'Sem resposta da IA.')
    );
  }

  sendMessageToChatGPT(prompt: string): Observable<string> {
    return of(`Resposta simulada do Chat GPT para: "${prompt}".`);
  }

  sendMessageToCopilot(prompt: string): Observable<string> {
    return of(`Resposta simulada do Copilot para: "${prompt}".`);
  }
}
