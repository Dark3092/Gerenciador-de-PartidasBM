
let players = [];
let currentPlayerForProperties = -1;
let propertyModal = null; // Instância do Bootstrap Modal

// Dados Padrão
const defaultProperties = [
    "Av. 9 de julho", "Av. Brasil", "Av. Beira Mar", "Av. Rio Branco", "Av. do Estado", "Av. do Contorno",
    "Av. Rebouças", "Av. Santo Amaro", "Rua da Consolação", "Av. Morumbi", "Av. Higienópolis",
    "Av. São João", "Av. Ipiranga", "Rua Brigadeiro Faria Lima", "Av. Paulista", "Av. Recife",
    "Juscelino Kubitschek", "Rua Oscar Freire", "Av. Ibirapuera", "Av. Vieira Souto", "Av. Presidente Vargas",
    "Av. Niemeyer", "Ações do Banco Itaú", "Ações da TAM viagens", "Ações dos Postos Ipiranga",
    "Ações da Nivea", "Ações da Vivo", "Ações da Fiat", "TEESTES DE PROPRIEDADE"
];

let availableProperties = [...defaultProperties];