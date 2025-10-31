# Projeto de Automação de Testes
[![Autor: Rogerio Melo Kinape](https://img.shields.io/badge/autor-Rogerio%20Melo%20Kinape-blue)](#autor)

## Descrição

Este projeto abrangente de automação de testes demonstra vivência e proficiência em diferentes técnicas e ferramentas: testes de API, E2E web e mobile, testes de carga e integração contínua (CI).

Os objetivos incluem estruturar pipelines de CI/CD, aplicar boas práticas de automação e integrar frameworks modernos como Cypress, Appium/WebdriverIO, Playwright e k6, garantindo cobertura funcional, desempenho e estabilidade.

- Testes de API (E2E): Cypress com Cucumber contra uma API local em Node.
- Testes de Carga: k6 para simular uso e avaliar desempenho.
- Testes Mobile (E2E): WebdriverIO + Appium em aplicativo Android nativo.
- Testes Web (emulação mobile): Playwright emulando Pixel 5.

O projeto é modular, escalável e de fácil manutenção.

## Arquitetura e Estrutura de Pastas

- `cypress/`: artefatos dos testes de API com Cypress.
  - `e2e/cucumber/`: arquivos `.feature` do Cucumber.
  - `e2e/cucumber/stepDefinitions/`: implementação dos steps.
  - `support/api/`: abstração das chamadas à API.
  - `reports/`: relatórios de teste.
- `k6/`: script de teste de carga (`load-test.js`).
- `mobile/`: configuração e testes da automação mobile.
  - `app/`: onde colocar o `.apk` sob teste.
  - `config/`: configuração do WebdriverIO (`wdio.conf.js`).
  - `test/`: page objects e specs.
- `playwright/`: suíte web com Playwright (emulação móvel - Pixel 5).
  - `playwright.config.js`: configuração.
  - `tests/`: casos de teste.
  - `playwright-report/`: relatório HTML.
- `generate-report.js`: gera relatório HTML do Cypress.

## Pré-requisitos

- Node.js (v20 ou superior)
- k6 (para testes de carga): https://grafana.com/docs/k6/latest/set-up/
- Android Studio e SDK (para testes mobile): configurar `ANDROID_HOME`/`ANDROID_SDK_ROOT` e ferramentas no PATH.

## Instalação

Na raiz do projeto:

```bash
npm ci
```

## Como Executar os Testes

### API Local (Node)

Inicie a API local (usada por Cypress e k6):

```bash
npm run api:start
```

Padrão: `http://localhost:3000`.

### Testes de API (Cypress)

Com a API rodando:

```bash
npm run cy:run
```

Opcional: altere a base via `API_BASE_URL` (ex.: `http://host:porta/api`). Relatórios em `cypress/reports/`.

### Testes de Carga (k6)

```bash
npm run k6:run
```

Ou diretamente com host customizado:

```bash
K6_API_BASE_URL=http://localhost:3000 k6 run k6/load-test.js
```

### Testes Mobile (WebdriverIO + Appium)

1) Inicie um emulador Android (exemplo):

```bash
npm run android:emu:start
```

2) Execute os testes (Windows ajusta variáveis de ambiente):

```bash
npm run test:mobile
```

3) Alternativa com AVD headless (Windows):

```bash
npm run test:mobile:with-avd
```

### Testes Web (Playwright)

1) Instalar navegadores do Playwright (uma vez):

```bash
npx playwright install
```

2) Executar testes e abrir relatório:

```bash
npm run test:pw
npm run pw:report
```

## CI (GitHub Actions)

Workflow `.github/workflows/ci.yml`:
- Faz checkout e instala dependências
- Sobe API local e aguarda `GET /health`
- Executa Cypress (com `API_BASE_URL`)
- Instala k6 e executa teste de carga (`K6_API_BASE_URL`)
- Executa testes mobile (job `appium-mobile-test`) e publica Allure como artefato
- Executa Playwright (job `playwright-mobile-suite`) e publica `playwright-report` como artefato

