# Projeto de Automação de Testes com Cypress e Cucumber
[![Autor: Rogerio Melo Kinape](https://img.shields.io/badge/autor-Rogerio%20Melo%20Kinape-blue)](#autor)

Este projeto contém testes automatizados para API e web usando Cypress e Cucumber.

## Estrutura do Projeto

- `cypress/e2e/cucumber`: arquivos `.feature` (Gherkin).
- `cypress/e2e/cucumber/stepDefinitions`: implementação dos passos.
- `cypress/reports`: relatórios dos testes.
- `cypress/screenshots`: capturas de tela em falhas.
- `cypress/support`: comandos customizados e configurações.

## Funcionalidades Testadas

- API: `task1.feature` e `task2.feature` contra a API local.
- Web: `task3.feature` e `task4.feature` (cadastro, login e checkout simples).

## API Local (Node)

Inicie a API:

```bash
npm run api:start
```

Base padrão: `http://localhost:3000/api`. Para mudar, use `API_BASE_URL`.

Exemplo:

```bash
API_BASE_URL=http://localhost:3000/api npm run test
```

## Como Executar os Testes

1. Instale as dependências na raiz:

```bash
npm ci
```

2. Execute os testes:

```bash
npm run test
```

## Relatório

Para gerar o relatório do Cucumber:

```bash
npm run report
```

O HTML ficará em `cypress/reports/html/index.html`.

