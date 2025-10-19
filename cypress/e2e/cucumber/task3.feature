
Feature: Tarefa 3 - Teste de Cadastro e Login

  Scenario: Cadastro de novo usuário com sucesso
    Given que eu estou na página de cadastro
    When eu preencho o formulário de cadastro com dados válidos
    And eu clico no botão de cadastro
    Then eu devo ser redirecionado para a página de sucesso de cadastro

  Scenario: Tentativa de login com credenciais válidas
    Given que eu estou na página de login
    When eu preencho o email e a senha com os dados do usuário cadastrado
    And eu clico no botão de login
    Then eu devo ser redirecionado para a minha conta

  Scenario: Tentativa de login com senha incorreta
    Given que eu estou na página de login
    When eu preencho o email com um email invalido e a senha com uma senha invalida
    And eu clico no botão de login
    Then eu devo ver uma mensagem de erro de login

  Scenario: Tentativa de cadastro com campos obrigatórios em branco
    Given que eu estou na página de cadastro
    When eu deixo os campos obrigatórios em branco
    And eu clico no botão de cadastro
    Then eu devo ver mensagens de erro para campos obrigatórios
