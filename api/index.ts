import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API da Vercel - Status</title>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
      <style>
        body {
          background-color: #0a004b;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: rgba(255, 255, 255, 0.05);
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          max-width: 400px;
        }
        h1 { color: #ffa800; margin-bottom: 10px; font-size: 24px; }
        p { color: #a0aec0; font-size: 14px; margin-bottom: 20px; }
        .badge {
          background-color: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 20px;
        }
        .endpoint {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 13px;
          color: #ffa800;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">ONLINE</div>
        <h1>🤖 API da Vercel</h1>
        <p>Backend serverless a operar corretamente e pronto a receber pedidos.</p>
        <div class="endpoint">POST /api/chat</div>
      </div>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(htmlContent);
}
