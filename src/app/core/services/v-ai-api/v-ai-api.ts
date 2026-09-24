import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VAiApi {
  private http = inject(HttpClient);

  sendMessageToGemini(prompt: string): Observable<string> {
    return this.http.post<{ text: string }>('/api/gemini', { prompt }).pipe(
      map(response => response?.text || 'Sem resposta da IA.')
    );
  }

  sendMessageToChatGPT(prompt: string): Observable<string> {
    return of(`Resposta simulada do Chat GPT para: "${prompt}". Configure o endpoint no service se necessário.`);
  }

  sendMessageToCopilot(prompt: string): Observable<string> {
    return of(`Resposta simulada do Copilot para: "${prompt}". Configure o endpoint no service se necessário.`);
  }
}
