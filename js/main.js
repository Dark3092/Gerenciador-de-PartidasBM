// js/main.js - Inicialização

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Inicia Modais do Bootstrap
    propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));

    // 2. Carrega configurações visuais e dados
    loadTheme();
    loadCustomProperties();

    // 3. Carrega save do navegador (Chama a função que está no storageLocal.js)
    loadFromLocalStorage();
});