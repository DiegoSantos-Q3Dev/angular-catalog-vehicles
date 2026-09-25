import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VAiApi {
  private http = inject(HttpClient);
  private genAI = environment.useChatApi ? null : new GoogleGenerativeAI(environment.geminiApiKey);

  private callApi(prompt: string, provider: string): Observable<string> {
    if (environment.useChatApi) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      return this.http.post<{ text: string }>(environment.chatApiUrl, { prompt, provider }, { headers }).pipe(
        map(response => response.text || 'Sem resposta da API.'),
        catchError(error => of(`Erro ao comunicar com a API da Vercel (${provider}): ${error.error?.error || error.message}`))
      );
    }
    return of(`Modo API desativado para ${provider}.`);
  }

  sendMessageToGemini(prompt: string): Observable<string> {
    if (environment.useChatApi) {
      return this.callApi(prompt, 'gemini');
    }

    // SDK Local (Dev direto)
    const geminiPromise = (async () => {
      if (!this.genAI) throw new Error('SDK do Gemini não inicializado.');
      const model = this.genAI.getGenerativeModel({ model: environment.geminiModel });
      const result = await model.generateContent(prompt);
      return result.response.text() || 'Sem resposta da IA.';
    })();

    return from(geminiPromise);
  }

  sendMessageToChatGPT(prompt: string): Observable<string> {
    return this.callApi(prompt, 'chatgpt');
  }

  sendMessageToCopilot(prompt: string): Observable<string> {
    return this.callApi(prompt, 'copilot');
  }
}
