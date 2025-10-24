# Projeto de Automação de Testes com Cypress e Cucumber
[![Autor: Rogerio Melo Kinape](https://img.shields.io/badge/autor-Rogerio%20Melo%20Kinape-blue)](#autor)

Este projeto contém testes automatizados para uma API e uma aplicação web, utilizando Cypress e Cucumber.

## Estrutura do Projeto

- `cypress/e2e/cucumber`: Arquivos `.feature` com as especificações dos testes em Gherkin.
- `cypress/e2e/cucumber/stepDefinitions`: Implementação dos passos dos testes.
- `cypress/reports`: Relatórios dos testes.
- `cypress/screenshots`: Capturas de tela dos testes que falharam.
- `cypress/support`: Comandos customizados e configurações do Cypress.

## Funcionalidades Testadas

- API: `task1.feature` e `task2.feature` testam endpoints da API local.
- Aplicação Web: `task3.feature` e `task4.feature` para cadastro, login e checkout simples.

## Bibliotecas Utilizadas

- Cypress
- Cucumber
- @faker-js/faker

## API Local (Node)

Os testes de API usam uma API local em Node.

- Inicie a API:

```bash
npm run api:start
```

- Base padrão: `http://localhost:3000/api`. Para mudar, use `API_BASE_URL`.

Exemplo:

```bash
API_BASE_URL=http://localhost:3000/api npm run test
```

## Como Executar os Testes

1. Instale as dependências na raiz do projeto:

```bash
npm install
```

2. Execute os testes:

```bash
npm run test
```

## Como Gerar o Relatório

Para gerar o relatório do Cucumber, execute:

```bash
npm run report
```

O relatório será gerado em `cypress/reports/html/index.html`.
