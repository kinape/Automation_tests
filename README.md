# Projeto de Automação de Testes

## Descrição

Este projeto abrangente de automação de testes foi desenvolvido para demonstrar a vivência e a proficiência em uma variedade de técnicas e ferramentas de teste, incluindo testes de API, E2E (end-to-end), mobile e integração contínua.

O objetivo é evidenciar a capacidade de estruturar pipelines de CI/CD, aplicar boas práticas de automação, e integrar frameworks modernos como Cypress, Playwright, Appium e WebdriverIO, garantindo cobertura funcional, desempenho e estabilidade das aplicações testadas.

Além disso, o projeto contempla a adoção de padrões de projeto (Design Patterns) voltados à automação de testes, o uso de TypeScript/JavaScript como base de desenvolvimento, e a integração com ferramentas de versionamento e entrega contínua, como GitHub CI/CD.

- **Testes de API (E2E):** Utilizando Cypress com Cucumber para validar os endpoints da API `reqres.in`.
- **Testes de Carga:** Utilizando k6 para simular o comportamento do usuário e avaliar o desempenho da API sob carga.
- **Testes Móveis (E2E):** Utilizando Webdriver.IO e Appium para automatizar testes em um aplicativo Android nativo.

O projeto foi estruturado para ser modular, escalável e fácil de manter.

## Arquitetura e Estrutura de Pastas

- **`cypress/`**: Contém todos os artefatos relacionados aos testes de API com Cypress.
  - **`e2e/cucumber/`**: Arquivos de especificação `.feature` do Cucumber.
  - **`e2e/cucumber/stepDefinitions/`**: Implementação dos steps dos cenários `.feature`.
  - **`support/api/`**: Abstração das chamadas à API, atuando como uma camada de serviço.
  - **`reports/`**: Relatórios de teste gerados em formatos JSON e HTML.
- **`k6/`**: Contém o script de teste de carga.
  - **`load-test.js`**: Define os cenários de teste de carga, incluindo rampas de usuários e validações de desempenho.
- **`mobile/`**: Contém a configuração e os testes para a automação móvel.
  - **`app/`**: Onde o arquivo `.apk` do aplicativo a ser testado deve ser colocado.
  - **`config/`**: Arquivo de configuração do Webdriver.IO (`wdio.conf.js`).
  - **`test/`**: Contém os `pageobjects` e as `specs` (casos de teste) para os testes móveis.
- **`generate-report.js`**: Script para gerar o relatório HTML dos testes do Cypress.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

- **Node.js:** (v22.20.0 ou superior)
- **k6:** [Guia de Instalação](https://k6.io/docs/getting-started/installation/)
- **Android Studio e SDK:** Para os testes móveis, é necessário ter o Android Studio instalado e o SDK do Android configurado corretamente.

## Instalação

Para instalar todas as dependências do projeto, execute o seguinte comando na raiz do projeto:

```bash
npm install
```

## Como Executar os Testes

O projeto está configurado com scripts para facilitar a execução dos diferentes tipos de testes.

### Testes de API (Cypress)

Execute todos os cenários `.feature` em modo headless e gere o relatório HTML com um único comando:

```bash
npm run cy:run
```

Os relatórios serão gerados na pasta `cypress/reports/`.

### Testes de Carga (k6)

Para executar o teste de carga definido no arquivo `k6/load-test.js`, use o seguinte comando:

```bash
npm run k6:run
```

### Testes Móveis (Webdriver.IO)

Para executar os testes móveis, siga os passos abaixo:

1. **Inicie o Emulador Android:**
   ```bash
   npm run android:emu:start
   ```
   *Nota: O nome do emulador (AVD) pode ser customizado no `package.json`.*

2. **Execute os Testes Móveis:**
   ```bash
   npm run test:mobile:win
   ```
   *Este comando é específico para o ambiente Windows e configura as variáveis de ambiente necessárias.*

3. **Comando Combinado (Headless):**
   Para iniciar um emulador em modo headless e executar os testes em sequência, use:
   ```bash
   npm run test:mobile:with-avd
   ```
