Feature: Tarefa 1 - Validar endpoints de uma API
  - Verificações de resposta (status codes, headers e corpo);
  - Testes positivos (ex: entradas válidas) e negativos (ex: dados inválidos, campos ausentes, autenticação inválida);

  Scenario: Listar usuários e verificar a resposta
    When eu envio uma requisição GET para "/users?page=2"
    Then a resposta do status deve ser 200
    And o corpo da resposta deve ter a propriedade "page" com o valor 2
    And o corpo da resposta deve ter a propriedade "data" que é um array não vazio

  Scenario: Criar um novo usuário com sucesso
    When eu envio uma requisição POST para "/users" com o corpo
      """
      {
        "name": "morpheus",
        "job": "leader"
      }
      """
    Then a resposta do status deve ser 201
    And o corpo da resposta deve ter a propriedade "name" com o valor "morpheus"

  Scenario: Buscar um único usuário com sucesso
    When eu envio uma requisição GET para "/users/2"
    Then a resposta do status deve ser 200
    And o corpo da resposta deve ter a propriedade "data"
    And a propriedade "id" do objeto "data" deve ser 2

  Scenario: Usuário não encontrado
    When eu tento enviar uma requisição para um usuário inexistente em "/users/23"
    Then a resposta do status deve ser 404

  Scenario: Atualizar um usuário
    When eu envio uma requisição PUT para "/users/2" com o corpo
      """
      {
        "name": "morpheus",
        "job": "zion resident"
      }
      """
    Then a resposta do status deve ser 200
    And o corpo da resposta deve ter a propriedade "job" com o valor "zion resident"

  Scenario: Deletar um usuário
    When eu envio uma requisição DELETE para "/users/2"
    Then a resposta do status deve ser 204
