
# Projeto de Automação de Testes com Cypress e Cucumber

Este projeto contém testes automatizados para uma API e uma aplicação web, utilizando Cypress e Cucumber.

## Estrutura do Projeto

O projeto está estruturado da seguinte forma:

- `cypress/e2e/cucumber`: Contém os arquivos `.feature` com as especificações dos testes em Gherkin.
- `cypress/e2e/cucumber/stepDefinitions`: Contém os arquivos de implementação dos passos dos testes.
- `cypress/reports`: Contém os relatórios dos testes.
- `cypress/screenshots`: Contém as capturas de tela dos testes que falharam.
- `cypress/support`: Contém os comandos customizados e configurações do Cypress.

## Funcionalidades Testadas

- **API**: Os arquivos `task1.feature` e `task2.feature` contêm os testes para os endpoints da API.
- **Aplicação Web**: O arquivo `task3.feature` contém os testes para a funcionalidade de cadastro e login da aplicação web.

## Bibliotecas Utilizadas

- **Cypress**: Framework de automação de testes.
- **Cucumber**: Ferramenta para escrever testes em Gherkin.
- **@faker-js/faker**: Biblioteca para gerar dados falsos para os testes.

## Como Executar os Testes

1. Instale as dependências do projeto:

   ```bash
   npm install
   ```

2. Execute os testes:

   ```bash
   npm run test
   ```

## Como Gerar o Relatório

Para gerar o relatório do Cucumber, execute o seguinte comando:

```bash
npm run report
```

O relatório será gerado em `cypress/reports/html/index.html`.
