# Projeto de Automação de Testes
[![Autor: Rogerio Melo Kinape](https://img.shields.io/badge/autor-Rogerio%20Melo%20Kinape-blue)](#autor)

## Descrição

Este projeto abrangente de automação de testes foi desenvolvido para demonstrar a vivência e a proficiência em uma variedade de técnicas e ferramentas de teste, incluindo testes de API, E2E (end-to-end), mobile e integração contínua.

O objetivo é evidenciar a capacidade de estruturar pipelines de CI/CD, aplicar boas práticas de automação, e integrar frameworks modernos como Cypress, Playwright, Appium e WebdriverIO, garantindo cobertura funcional, desempenho e estabilidade das aplicações testadas.

Além disso, o projeto contempla a adoção de padrões de projeto (Design Patterns) voltados à automação de testes, o uso de TypeScript/JavaScript como base de desenvolvimento, e a integração com ferramentas de versionamento e entrega contínua, como GitHub CI/CD.

- Testes de API (E2E): Utilizando Cypress com Cucumber contra uma API local em Node.
- Testes de Carga: Utilizando k6 para simular o comportamento do usuário e avaliar o desempenho da API sob carga.
- Testes Móveis (E2E): Utilizando WebdriverIO e Appium para automatizar testes em um aplicativo Android nativo.

O projeto foi estruturado para ser modular, escalável e fácil de manter.

## Arquitetura e Estrutura de Pastas

- `cypress/`: Contém todos os artefatos relacionados aos testes de API com Cypress.
  - `e2e/cucumber/`: Arquivos de especificação `.feature` do Cucumber.
  - `e2e/cucumber/stepDefinitions/`: Implementação dos steps dos cenários `.feature`.
  - `support/api/`: Abstração das chamadas à API, atuando como uma camada de serviço.
  - `reports/`: Relatórios de teste gerados em formatos JSON e HTML.
- `k6/`: Contém o script de teste de carga.
  - `load-test.js`: Define os cenários de teste de carga, incluindo rampas de usuários e validações de desempenho.
- `mobile/`: Contém a configuração e os testes para a automação móvel.
  - `app/`: Onde o arquivo `.apk` do aplicativo a ser testado deve ser colocado.
  - `config/`: Arquivo de configuração do WebdriverIO (`wdio.conf.js`).
  - `test/`: Contém os `pageobjects` e as `specs` (casos de teste) para os testes móveis.
- `generate-report.js`: Script para gerar o relatório HTML dos testes do Cypress.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- Node.js (v20 ou superior)
- k6: Guia de Instalação — https://grafana.com/docs/k6/latest/set-up/
- Android Studio e SDK: Para os testes móveis, é necessário ter o Android Studio instalado e o SDK do Android configurado corretamente.

## Instalação

Para instalar todas as dependências do projeto, execute o seguinte comando na raiz do projeto:

```bash
npm install
```

## Como Executar os Testes

O projeto está configurado com scripts para facilitar a execução dos diferentes tipos de testes.

### API Local (Node)

Inicie a API local (usada pelos testes do Cypress e k6):

```bash
npm run api:start
```

Por padrão, a API escuta em `http://localhost:3000`.

### Testes de API (Cypress)

Com a API em execução, rode os cenários `.feature` e gere o relatório:

```bash
npm run cy:run
```

Opcional: a base da API pode ser alterada com `API_BASE_URL` (ex.: `http://host:porta/api`).

Relatórios são gerados em `cypress/reports/`.

### Testes de Carga (k6)

Com a API em execução, rode o teste de carga definido no arquivo `k6/load-test.js`:

```bash
npm run k6:run
```

Ou diretamente apontando um host customizado:

```bash
K6_API_BASE_URL=http://localhost:3000 k6 run k6/load-test.js
```

### Testes Móveis (WebdriverIO)

Para executar os testes móveis, siga os passos abaixo:

1. Inicie o Emulador Android:
   ```bash
   npm run android:emu:start
   ```
   Nota: O nome do emulador (AVD) pode ser customizado no `package.json`.

2. Execute os testes móveis:
   ```bash
   npm run test:mobile
   ```
   Este comando é específico para o ambiente Windows e configura as variáveis de ambiente necessárias.

## CI (GitHub Actions)

O workflow `.github/workflows/ci.yml`:
- Faz checkout e instala dependências
- Sobe a API local (espera `GET /health`)
- Executa Cypress (`API_BASE_URL` apontando para a API local)
- Instala k6 e executa o teste de carga (`K6_API_BASE_URL`)

- Executa testes mobile (job appium-mobile-test) e publica Allure como artifact
