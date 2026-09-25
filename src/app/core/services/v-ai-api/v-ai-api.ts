import { Service, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '@environments/environment';

@Service()
export class VAiApi {
  private http = inject(HttpClient);
  private genAI = environment.useChatApi ? null : new GoogleGenerativeAI(environment.geminiApiKey);

  sendMessageToGemini(prompt: string): Observable<string> {
    // API (Dev / Prod)
    if (environment.useChatApi) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post<{ text: string }>(environment.chatApiUrl, { prompt }, { headers }).pipe(
        map(response => response.text || 'Sem resposta da API.'),
        catchError(error => of(`Erro ao comunicar com a API da Vercel: ${error.error?.error || error.message}`))
      );
    }

    // SDK (Dev)
    const geminiPromise = (async () => {
      if (!this.genAI) throw new Error('SDK do Gemini não inicializado.');
      const model = this.genAI.getGenerativeModel({ model: environment.geminiModel });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text() || 'Sem resposta da IA.';
    })();

    return from(geminiPromise);
  }

  sendMessageToChatGPT(prompt: string): Observable<string> {
    return of(`Resposta simulada do Chat GPT para: "${prompt}".`);
  }

  sendMessageToCopilot(prompt: string): Observable<string> {
    return of(`Resposta simulada do Copilot para: "${prompt}".`);
  }
}
