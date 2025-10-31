# Testes Web (Playwright)

Este diretório contém a suíte de testes web com Playwright, configurada para emular um dispositivo móvel (Pixel 5). Os testes de exemplo reproduzem, em versão web/offline, os fluxos dos testes mobile do Appium/WDIO.

## Estrutura

- `playwright/playwright.config.js`: configuração do Playwright (projeto “Mobile Chrome (Pixel 5)”, retries no CI, trace/screenshot/vídeo, relatório HTML).
- `playwright/tests/`: casos de teste
  - `login.spec.js`: fluxo “API Demos → Views → Buttons”.
  - `form-submit.spec.js`: fluxo “App → Alert Dialogs → Text Entry dialog”.
- `playwright-report/`: relatório HTML gerado após a execução.

## Pré-requisitos

- Node.js 20+
- Dependências instaladas na raiz do projeto: `npm ci`
- Navegadores do Playwright instalados: `npx playwright install`

## Como Executar

1. Instale dependências na raiz do projeto:

```bash
npm ci
```

2. Instale os navegadores do Playwright:

```bash
npx playwright install
```

3. Rode os testes:

```bash
npm run test:pw
```

4. Abra o relatório HTML:

```bash
npm run pw:report
```

Observações:
- Os testes de exemplo usam páginas “offline” (data URLs) para evitar dependências externas e flakiness no CI.
- Se quiser apontar para um app/URL real, defina `BASE_URL` e adapte os seletores nos testes.

## Execução em CI

O workflow `.github/workflows/ci.yml` possui o job `playwright-mobile-suite` que:
- Instala dependências (`npm ci`) e navegadores (`npx playwright install --with-deps`).
- Executa os testes (`npm run test:pw:ci`).
- Publica o relatório HTML como artefato (`playwright-report`).

