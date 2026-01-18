// js/storageLocal.js

// 1. Salvar Automaticamente no Navegador
function saveToLocalStorage() {
    try {
        localStorage.setItem('playersData', JSON.stringify(players));
        localStorage.setItem('customProperties', JSON.stringify(availableProperties));
    } catch (e) {
        console.error("Erro ao salvar dados localmente:", e);
    }
}

// 2. Carregar dados ao iniciar (Chamado pelo main.js)
function loadFromLocalStorage() {
    const savedPlayers = localStorage.getItem('playersData');
    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
        updatePlayerList();
    }

    const savedProps = localStorage.getItem('customProperties');
    if (savedProps) {
        availableProperties = JSON.parse(savedProps);
    }
}

// 3. Ler arquivo .json (Upload)
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const loadedData = JSON.parse(e.target.result);
            if (Array.isArray(loadedData)) {
                players = loadedData;
                updatePlayerList();
                saveToLocalStorage();
                alert("Arquivo carregado com sucesso!");
            } else {
                alert("Formato de arquivo inválido.");
            }
        } catch (error) {
            alert("Erro ao ler o arquivo: " + error.message);
        }
    };
    reader.readAsText(file);
}

function loadSaveFromFile() {
    document.getElementById('loadSaveInput').click();
}