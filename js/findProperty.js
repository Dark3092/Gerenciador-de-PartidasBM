// js/findProperty.js

function filterProperties() {
    // 1. Pega o texto digitado e converte para minúsculo
    const input = document.getElementById('propertySearchInput');
    const filter = input.value.toLowerCase();
    
    // 2. Pega todos os itens da lista gerada
    // Nota: A classe 'property-item' já existe no seu CSS/JS
    const items = document.querySelectorAll('#propertyCheckboxes .property-item');

    // 3. Loop para mostrar ou esconder
    items.forEach(item => {
        // Busca o texto dentro do label
        const label = item.querySelector('label');
        const textValue = label.textContent || label.innerText;

        if (textValue.toLowerCase().indexOf(filter) > -1) {
            item.classList.remove('d-none'); // Mostra
        } else {
            item.classList.add('d-none');    // Esconde
        }
    });
}

// Função auxiliar para focar e limpar ao abrir
function setupPropertySearch() {
    const input = document.getElementById('propertySearchInput');
    if (input) {
        input.value = ''; // Limpa pesquisa anterior
        
        // Pequeno delay para garantir que o modal abriu antes de focar
        // Isso força o teclado do celular a abrir
        setTimeout(() => {
            input.focus();
        }, 500);
    }
}