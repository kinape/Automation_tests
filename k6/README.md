# Testes de Carga com k6

Este diretório contém o script de teste de carga usando k6 para validar desempenho e resiliência de endpoints HTTP.

## Arquivos

- `k6/load-test.js`: script principal com cenários de carga (stages), verificações (`check`) e limites de desempenho (`thresholds`).

## Pré‑requisitos

- k6 instalado na máquina local.
  - Guia de instalação: https://grafana.com/docs/k6/latest/set-up/
  - Windows (exemplos): `winget install k6`, ou `choco install k6`.

## Como Executar

- Via npm script (recomendado na raiz do projeto):

  ```bash
  npm run k6:run
  ```

- Diretamente com k6:

  ```bash
  k6 run k6/load-test.js
  ```

Ao final da execução, o próprio script gera dois arquivos de resumo automaticamente:

- `k6/summary.html`: relatório HTML com KPIs principais (requisições, taxa de sucesso, latências média e p95, checks).
- `k6/summary.json`: resumo completo em JSON com todas as métricas do k6.

## Cenário de Carga (stages)

O arquivo `k6/load-test.js` define:

- Subida: 30s até `500` VUs
- Sustentação: `4m` com `500` VUs
- Descida: 30s até `0` VUs

Você pode ajustar esses valores no objeto `options.stages` no próprio script ou sobrescrever via CLI, por exemplo:

```bash
k6 run --vus 200 --duration 2m k6/load-test.js
```

## Thresholds (critérios de aprovação)

- `http_req_failed`: `rate < 0.01` (menos de 1% de falhas)
- `http_req_duration`: `p(95) < 500` ms (95% das requisições abaixo de 500ms)

Se os limites não forem atendidos, o k6 marca a execução como falha (útil em CI).

## Alvo do Teste

O script de exemplo faz `GET` em `https://test-api.k6.io/public/crocodiles/` e valida `status === 200`.

- Para testar outra API, altere a URL dentro da função `default` em `k6/load-test.js`.
- Se necessário, adicione headers, payloads e outras métricas/validadores usando as APIs do k6.

## Execução em CI

Já há um job configurado em `/.github/workflows/ci.yml` usando `grafana/k6-action` com `filename: k6/load-test.js`.

- Os thresholds definidos no script controlam o resultado do job.
- Ajuste estágios e limites conforme suas metas de SLO.

Para baixar o artefato e visualizar o relatório HTML, publique `k6/summary.html` como artifact no seu workflow, se desejar.

## Dicas

- Use `--summary-export resultado.json` para exportar métricas em JSON.
- Combine checks e tags para separar tráfego por tipo de request.
- Mantenha os thresholds alinhados aos seus objetivos de desempenho.

## Análise dos Resultados (guia rápido)

- Taxa de sucesso próxima a 100% indica boa resiliência sob carga. Se cair, inspecione `http_req_failed` e erros de backend.
- Latência `p(95)` é mais representativa de experiência: mantenha-a abaixo do seu SLO (ex.: 500 ms). Se acima, investigue gargalos.
- Verifique `checks` (passes/fails) para validar resposta funcional (ex.: `status === 200`). Fails apontam problemas de corretude.
- Compare estágios (rampa, sustentação, descida) para identificar degradação com aumento de VUs.
- Use o JSON para séries temporais e gráficos em ferramentas externas, se necessário.

## Autor

Rogerio Melo Kinape
