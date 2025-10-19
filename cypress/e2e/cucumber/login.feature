Feature: Funcionalidade de Login

  Como um usuário,
  Eu quero poder fazer login na aplicação
  Para que eu possa acessar a área restrita.

  Scenario: Criar conta
    Given que eu estou na página de login
    When eu clico no botão Continue para criar conta
    And digito minhas informações
    And clico em aceitar propagandas
    And aceito as politicas de privacidade
    And clico no botão Continue
    Then eu devo ver a mensagem "Your Account Has Been Created!"

  Scenario: Login com sucesso
    Given que eu estou na página de login
    When eu insiro credenciais válidas
    And clico no botão de login
    Then eu devo ser redirecionado para a área segura

  Scenario: Tentativa de login com senha incorreta
    Given que eu estou na página de login
    When eu insiro um usuário válido e senha incorreta
    And clico no botão de login
    Then eu devo ver uma mensagem de erro contendo "Your password is invalid!"
