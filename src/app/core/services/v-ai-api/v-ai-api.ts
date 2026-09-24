import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VAiApi {
  private http = inject(HttpClient);
  private genAI = new GoogleGenerativeAI(environment.geminiApiKey);

  sendMessageToGemini(prompt: string): Observable<string> {
    const geminiPromise = (async () => {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text() || 'Sem resposta da IA.';
    })();

    return from(geminiPromise);
  }

  sendMessageToChatGPT(prompt: string): Observable<string> {
    return of(`Resposta simulada do Chat GPT para: "${prompt}". Configure o endpoint no service se necessário.`);
  }

  sendMessageToCopilot(prompt: string): Observable<string> {
    return of(`Resposta simulada do Copilot para: "${prompt}". Configure o endpoint no service se necessário.`);
  }
}
