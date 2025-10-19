# Analista QA Senior - Rogerio Melo Kinape

## Descrição

Este projeto contém uma suíte de testes de API automatizados desenvolvida com Cypress e Cucumber. O objetivo é testar os principais endpoints da API pública `reqres.in`, cobrindo as operações de CRUD (Create, Read, Update, Delete) para o recurso de usuários.

## Arquitetura e Estrutura de Pastas

O projeto segue uma estrutura organizada para facilitar a manutenção e escalabilidade dos testes:

- **`cypress/e2e/cucumber/`**: Contém os arquivos de especificação `.feature`.
  - `task1.feature`: Suíte de testes com os cenários da tarefa 1 - Validar endpoints de uma API
  - `task2.feature`: Suíte de testes com cenários da tarefa 2 - Automatizar testes para múltiplos endpoints da API
- **`cypress/e2e/cucumber/stepDefinitions/`**: Contém os arquivos de implementação dos steps dos cenários `.feature`.
  - `common.js`: Steps comuns a vários cenários.
  - `task1.js`: Steps específicos para a `task1.feature`.
  - `task2.js`: Steps específicos para a `task2.feature`.
- **`cypress/support/api/`**: Contém a classe `reqres.js`, que abstrai os detalhes das chamadas à API `reqres.in`. Esta camada atua como um "Service Object", tornando os testes mais limpos e fáceis de manter.
- **`cypress/reports/`**: Diretório onde os relatórios de teste (JSON e HTML) são gerados.
- **`generate-report.js`**: Script Node.js para gerar o relatório HTML a partir do resultado dos testes em JSON.

## Versões Utilizadas

- **Node.js:** v22.20.0
- **Cypress:** v15.4.0

## Dependências

As principais dependências do projeto estão listadas abaixo.

**Dependências de Desenvolvimento:**
- `cypress`: ^15.4.0
- `multiple-cucumber-html-reporter`: ^3.9.3

**Dependências de Produção:**
- `@badeball/cypress-cucumber-preprocessor`: ^23.2.1
- `@bahmutov/cypress-esbuild-preprocessor`: ^2.2.6
- `cypress-cucumber-preprocessor`: ^4.3.1

### Instalação

Para instalar todas as dependências, execute o seguinte comando na raiz do projeto:

```bash
npm install
```

## Como Executar os Testes e Gerar o Relatório

O projeto está configurado com scripts para facilitar a execução.

### 1. Executar os Testes

Este comando executa todos os cenários `.feature` em modo headless e gera o arquivo `cucumber-report.json`.

```bash
npm run test
```

### 2. Gerar o Relatório HTML

Após a execução dos testes, este comando lê o arquivo JSON e gera um relatório HTML navegável na pasta `cypress/reports/html`.

```bash
npm run report
```

### 3. Executar Testes e Gerar Relatório (Comando Único)

Este comando executa os testes e, em seguida, gera o relatório HTML.

```bash
npm run cy:run
```