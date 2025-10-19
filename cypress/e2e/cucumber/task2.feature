Feature: Tarefa 2 - Automatizar testes para múltiplos endpoints da API
utilizando diferentes métodos HTTP (GET, POST, PUT, DELETE). Para cada 
método devem ser validados
  - Verificações de resposta (status codes, headers e corpo);
  - Testes positivos (ex: entradas válidas) e negativos (ex: dados 
  inválidos, campos ausentes, autenticação inválida);

  Scenario: Validar headers na busca de usuário
    When eu envio uma requisição GET para "/users/2"
    Then a resposta do status deve ser 200
    And o header "content-type" da resposta deve conter "application/json"
    And o header "server" da resposta deve ser "cloudflare"

  Scenario: Tentar usar POST em um endpoint de um usuário específico
    When eu tento enviar uma requisição POST para "/users/2" com corpo vazio
    Then a resposta do status deve ser 201

  Scenario: Criar um usuário com JSON malformado
    When eu tento enviar uma requisição POST para "/users" com o corpo malformado
      """
      { "name": "neo", "job": "the one"
      """
    Then a resposta do status deve ser 400

  Scenario: Tentar fazer login sem a senha
    When eu envio uma requisição POST para o login com o corpo
      """
      { "email": "peter@klaven" }
      """
    Then a resposta do status deve ser 400
    And o corpo da resposta deve conter a mensagem de erro "Missing password"
