Feature: Tarefa 4 - Automatizar um fluxo de checkout simples em um e-commerce de exemplo

  Scenario: Compra completa com dados validos
    Given que eu estou na pagina inicial
    When eu adiciono um produto ao carrinho
    And eu vou para o checkout
    And eu preencho o formulário de pagamento com dados válidos
    And eu completo a compra
    Then eu devo ver uma mensagem de sucesso

  Scenario: Compra com endereco de entrega incompleto
    Given que eu estou na pagina inicial
    When eu adiciono um produto ao carrinho
    And eu vou para o checkout
    And eu preencho o formulário de pagamento com um endereço de entrega incompleto
    Then eu devo ver uma mensagem de erro
