import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientSecret = req.headers['x-app-secret'];
  const serverSecret = process.env.APP_SECRET_KEY;

  if (!clientSecret || clientSecret !== serverSecret) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Chave da API não configurada no servidor' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Ajusta o modelo se necessário

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro interno ao processar a IA' });
  }
}
