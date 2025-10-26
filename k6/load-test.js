import http from 'k6/http';
import { check, sleep } from 'k6';

// Opções do teste
export const options = {
  stages: [
    { duration: '30s', target: 500 },
    { duration: '4m', target: 500 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

// Função principal que cada usuário virtual (VU) executa
export default function () {
  const BASE = __ENV.K6_API_BASE_URL || 'http://localhost:3000';
  // Faz uma requisição GET para a API (local/CI)
  const res = http.get(`${BASE}/public/crocodiles/`);

  // Verifica se a requisição foi bem-sucedida
  check(res, {
    'status é 200': (r) => r.status == 200,
  });

  // Pausa de 1 segundo entre as requisições de cada usuário
  sleep(1);
}

// Geração automática de relatórios ao final da execução
export function handleSummary(data) {
  const metrics = data && data.metrics ? data.metrics : {};

  function get(obj, keys, def) {
    let cur = obj;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (cur && k in cur) {
        cur = cur[k];
      } else {
        cur = undefined;
        break;
      }
    }
    return cur === undefined || cur === null ? def : cur;
  }

  const httpReqs = get(metrics, ['http_reqs', 'values', 'count'], 0);
  const httpFailRate = get(metrics, ['http_req_failed', 'values', 'rate'], 0);
  const httpP95 = get(metrics, ['http_req_duration', 'values', 'p(95)'], 0);
  const httpAvg = get(metrics, ['http_req_duration', 'values', 'avg'], 0);
  const checksPasses = get(metrics, ['checks', 'passes'], 0);
  const checksFails = get(metrics, ['checks', 'fails'], 0);

  const passRate = (1 - httpFailRate) * 100;

  const html = `<!doctype html>
  <html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Relatório k6 - Sumário</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; color: #222 }
      h1 { margin: 0 0 16px 0; font-size: 22px }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap: 12px }
      .card { border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; background: #fafafa }
      .kpi { font-size: 28px; font-weight: 600 }
      table { width: 100%; border-collapse: collapse; margin-top: 16px }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee }
      .ok { color: #1b5e20 }
      .warn { color: #e65100 }
    </style>
  </head>
  <body>
    <h1>Relatório de Carga (k6)</h1>
    <div class="grid">
      <div class="card"><div>Requisições</div><div class="kpi">${httpReqs}</div></div>
      <div class="card"><div>Taxa de Sucesso</div><div class="kpi">${passRate.toFixed(2)}%</div></div>
      <div class="card"><div>Latência média</div><div class="kpi">${httpAvg.toFixed(2)} ms</div></div>
      <div class="card"><div>Latência p95</div><div class="kpi">${httpP95.toFixed(2)} ms</div></div>
      <div class="card"><div>Checks</div><div class="kpi">${checksPasses} ✔ / ${checksFails} ✖</div></div>
    </div>

    <table>
      <thead>
        <tr><th>Métrica</th><th>Valor</th></tr>
      </thead>
      <tbody>
        <tr><td>Falhas (rate)</td><td>${httpFailRate}</td></tr>
        <tr><td>Duração média (ms)</td><td>${httpAvg}</td></tr>
        <tr><td>Duração p95 (ms)</td><td>${httpP95}</td></tr>
      </tbody>
    </table>

    <p style="margin-top:16px; font-size: 12px; color:#666">Gerado automaticamente por handleSummary.</p>
  </body>
  </html>`;

  return {
    'k6/summary.json': JSON.stringify(data, null, 2),
    'k6/summary.html': html,
  };
}

