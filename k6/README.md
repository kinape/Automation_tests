# Testes de Carga com k6
[![Autor: Rogerio Melo Kinape](https://img.shields.io/badge/autor-Rogerio%20Melo%20Kinape-blue)](#autor)

Este diretório contém o script de teste de carga usando k6 para validar desempenho e resiliência de endpoints HTTP.

## Arquivos

- `k6/load-test.js`: script principal com cenários de carga (stages), verificações (`check`) e limites de desempenho (`thresholds`).

## Pré-requisitos

- k6 instalado na máquina local.
  - Guia de instalação: https://grafana.com/docs/k6/latest/set-up/
  - Windows (exemplos): `winget install k6`, ou `choco install k6`.

## Como Executar

- Via npm script (recomendado na raiz do projeto):

```bash
npm run k6:run
```

- Diretamente com k6 (com host customizado):

```bash
K6_API_BASE_URL=http://localhost:3000 k6 run k6/load-test.js
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

Se os limites não forem atendidos, o k6 marca a execução como falha.

## API alvo local

O script aponta para a API local (endpoint: `GET /public/crocodiles/`). Use a variável `K6_API_BASE_URL` para definir o host/base:

```bash
K6_API_BASE_URL=http://localhost:3000 k6 run k6/load-test.js
```

## Execução em CI

O workflow `.github/workflows/ci.yml` inicia a API local, aguarda `GET /health`, instala o k6 (via `grafana/setup-k6-action`) e executa:

```bash
k6 run k6/load-test.js
```

com `K6_API_BASE_URL` definido para `http://localhost:3000`.
