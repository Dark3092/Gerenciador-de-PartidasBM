// Configurações da API
const PANTRY_ID = '544a94e3-a104-43c6-b6ad-f6c48b86a7f8';
const BASKET_NAME = 'bancoimobiliario';
const API_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/${BASKET_NAME}`;

// Estado Global da Aplicação
let players = [];
let cachedSaves = {};
let currentLoadedId = null;
let currentPlayerForProperties = -1;
let propertyModal = null; // Instância do Bootstrap Modal

// Dados Padrão
const defaultProperties = [
    "Av. 9 de julho", "Av. Brasil", "Av. Beira Mar", "Av. Rio Branco", "Av. do Estado", "Av. do Contorno",
    "Av. Rebouças", "Av. Santo Amaro", "Rua da Consolação", "Av. Morumbi", "Av. Higienópolis",
    "Av. São João", "Av. Ipiranga", "Rua Brigadeiro Faria Lima", "Av. Paulista", "Av. Recife",
    "Juscelino Kubitschek", "Rua Oscar Freire", "Av. Ibirapuera", "Av. Vieira Souto", "Av. Presidente Vargas",
    "Av. Niemeyer", "Ações do Banco Itaú", "Ações da TAM viagens", "Ações dos Postos Ipiranga",
    "Ações da Nivea", "Ações da Vivo", "Ações da Fiat"
];

let availableProperties = [...defaultProperties];