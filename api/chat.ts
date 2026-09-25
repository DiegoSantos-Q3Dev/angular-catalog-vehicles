import * as dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = 'https://diegosantos18.github.io';
  const origin = req.headers.origin;

  if (origin === allowedOrigin || origin?.startsWith('http://localhost:')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-app-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, provider = 'gemini' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    let text = '';

    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      if (!apiKey) {
        return res.status(500).json({ error: 'Chave do Gemini não configurada no servidor' });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      text = result.response.text();

    } else if (provider === 'chatgpt') {
      const apiKey = process.env.CHATGPT_API_KEY;
      const modelName = process.env.CHATGPT_MODEL || 'gpt-4o-mini';
      if (!apiKey) {
        return res.status(500).json({ error: 'Chave do ChatGPT não configurada no servidor' });
      }

      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: 'user', content: prompt }]
      });
      text = completion.choices[0]?.message?.content || 'Sem resposta do ChatGPT.';

    } else if (provider === 'copilot') {
      const apiKey = process.env.COPILOT_API_KEY;
      const modelName = process.env.COPILOT_MODEL || 'gpt-4o';
      if (!apiKey) {
        return res.status(500).json({ error: 'Chave do Copilot não configurada no servidor' });
      }

      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: modelName,
        messages: [{ role: 'user', content: prompt }]
      });
      text = completion.choices[0]?.message?.content || 'Sem resposta do Copilot.';

    } else {
      return res.status(400).json({ error: 'Provedor de IA desconhecido' });
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro interno ao processar o chat' });
  }
}


