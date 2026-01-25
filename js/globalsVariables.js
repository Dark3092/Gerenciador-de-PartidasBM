
let players = [];
let currentPlayerForProperties = -1;
let propertyModal = null; // Instância do Bootstrap Modal

// Dados Padrão
const defaultProperties =
    [
        "Leblon",
        "Av. Presidente Vargas",
        "Av. Nossa Senhora de Copacabana",
        "Companhia ferroviária", 
        "Av. Brigadeiro Faria Lima",
        "Companhia de Viacao", 
        "Av. reboucas", 
        "Av. 9 de julho", 
        "Av. Europa", 
        "Rua Augusta", 
        "Av. Pacaembu", 
        "Comphania de Taxi", 
        "Interlagos", 
        "Morumbi", 
        "Flamengo", 
        "Botafogo", 
        "Comphania de Navegacao", 
        "Av. Brasil", 
        "Av. Paulista", 
        "Jardim Europa", 
        "Copacabana", 
        "Comphania de Aviacao", 
        "Av. Vieira Souto", 
        "Av. Atlantica", 
        "Comphania de Taxi Aereo", 
        "Ipanema", 
        "Jardim Paulista", 
        "Brooklin"
    ];

let availableProperties = [...defaultProperties];