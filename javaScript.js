
// ============================================
// CONFIGURAÇÃO PANTRY (Substituto do GitHub)
// ============================================

// Pegue seu ID no site getpantry.cloud
const PANTRY_ID = '544a94e3-a104-43c6-b6ad-f6c48b86a7f8';
const BASKET_NAME = 'bancoimobiliario'; // O nome do "arquivo"
const API_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/${BASKET_NAME}`;
let cachedSaves = {};

    let players = [];
    let currentPlayerForProperties = -1;

    const defaultProperties  = [
    "Av. 9 de julho", "Av. Brasil", "Av. Beira Mar", "Av. Rio Branco", "Av. do Estado", "Av. do Contorno",
    "Av. Rebouças", "Av. Santo Amaro", "Rua da Consolação", "Av. Morumbi", "Av. Higienópolis",
    "Av. São João", "Av. Ipiranga", "Rua Brigadeiro Faria Lima", "Av. Paulista", "Av. Recife",
    "Juscelino Kubitschek", "Rua Oscar Freire", "Av. Ibirapuera", "Av. Vieira Souto", "Av. Presidente Vargas",
    "Av. Niemeyer", "Ações do Banco Itaú", "Ações da TAM viagens", "Ações dos Postos Ipiranga",
    "Ações da Nivea", "Ações da Vivo", "Ações da Fiat"
    ];

    let availableProperties  = [...defaultProperties];

// Carregar propriedades personalizadas (do GitHub Gist)
// Carregar propriedades personalizadas (Apenas LocalStorage)
function loadCustomProperties() {
    const saved = localStorage.getItem('customProperties');
    if (saved) {
        try {
            availableProperties = JSON.parse(saved);
        } catch (e) {
            availableProperties = [...defaultProperties];
        }
    } else {
        availableProperties = [...defaultProperties];
    }
}

    // Executar ao carregar a página
    loadCustomProperties();

    // Inicializar o Modal de Bootstrap
    let propertyModal;
    document.addEventListener('DOMContentLoaded', async function()
    {
        propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));

        // Tentar carregar jogadores do GitHub
    });

    function addPlayer() {
    const name = document.getElementById('playerName').value.trim();
    const money = parseFloat(document.getElementById('playerMoney').value);

    if (!name || isNaN(money)) {
    alert("Por favor, preencha o nome e o dinheiro inicial do jogador.");
    return;
}

    // Adiciona o novo jogador no início da lista
    players.unshift({
    name,
    money,
    properties: [],
    notes: ""
});

    // Limpa os campos do formulário
    document.getElementById('playerName').value = '';
    document.getElementById('playerMoney').value = '';

    updatePlayerList();
    saveToLocalStorage();
}

    function removePlayer(index) {
    if (confirm(`Tem certeza que deseja remover ${players[index].name}?`)) {
    players.splice(index, 1);
    updatePlayerList();
    saveToLocalStorage();
}
}

    function updateMoney(index) {
    const amount = parseFloat(document.getElementById(`moneyInput-${index}`).value);
    if (!isNaN(amount)) {
    players[index].money += amount;
    document.getElementById(`moneyInput-${index}`).value = '';
    updatePlayerList();
    saveToLocalStorage();
} else {
    alert("Por favor, insira um valor válido.");
}
}

    function setMoney(index) {
    const amount = parseFloat(document.getElementById(`moneyInput-${index}`).value);
    if (!isNaN(amount)) {
    players[index].money = amount;
    document.getElementById(`moneyInput-${index}`).value = '';
    updatePlayerList();
    saveToLocalStorage();
} else {
    alert("Por favor, insira um valor válido.");
}
}

    function openPropertySelection(index) {
    currentPlayerForProperties = index;

    // Preparar o conteúdo do modal
    const checkboxesContainer = document.getElementById('propertyCheckboxes');
    checkboxesContainer.innerHTML = '';

    let currentPlayerProps = players[index].properties.map(p => p.name);

    // Criar lista de todas as propriedades
    availableProperties.forEach((prop, propIndex) => {
    // Verificar se a propriedade já está com outro jogador
    let isOwnedByOther = false;
    let ownerName = "";

    players.forEach((player, playerIndex) => {
    if (playerIndex !== index && player.properties.some(p => p.name === prop)) {
    isOwnedByOther = true;
    ownerName = player.name;
}
});

    const isOwned = currentPlayerProps.includes(prop);

    const div = document.createElement('div');
    div.className = 'property-item mb-3';

    // Se já pertence a outro jogador, mostrar desabilitado com informação
    if (isOwnedByOther) {
    div.innerHTML = `
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="prop-${propIndex}" 
                                   value="${prop}" disabled>
                            <label class="form-check-label" for="prop-${propIndex}">
                                ${prop} <span class="text-warning">(Pertence a ${ownerName})</span>
                            </label>
                        </div>
                    `;
    checkboxesContainer.appendChild(div);
    return;
}

    // Propriedade disponível ou já do jogador atual
    div.innerHTML = `
                    <div class="d-flex flex-column w-100">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="prop-${propIndex}" 
                                   value="${prop}" ${isOwned ? 'checked' : ''}>
                            <label class="form-check-label" for="prop-${propIndex}">${prop}</label>
                        </div>
                        <div class="d-flex align-items-center mt-2 ms-4 ${isOwned ? '' : 'd-none'}" id="house-controls-${propIndex}">
                            <label class="me-2">Construções:</label>
                            <select class="form-select form-select-sm" style="width: auto;" id="house-select-${propIndex}">
                                <option value="0">0 casas</option>
                                <option value="1">1 casa</option>
                                <option value="2">2 casas</option>
                                <option value="3">3 casas</option>
                                <option value="Hotel">Hotel</option>
                            </select>
                        </div>
                    </div>
                `;

    checkboxesContainer.appendChild(div);

    // Se já possui, selecionar o número correto de casas
    if (isOwned) {
    const propObj = players[index].properties.find(p => p.name === prop);
    const select = document.getElementById(`house-select-${propIndex}`);
    select.value = propObj.houses;
}

    // Adicionar evento para mostrar/esconder controle de casas
    const checkbox = document.getElementById(`prop-${propIndex}`);
    checkbox.addEventListener('change', function() {
    const houseControls = document.getElementById(`house-controls-${propIndex}`);
    houseControls.classList.toggle('d-none', !this.checked);
});
});
    propertyModal.show();
}

    function confirmProperties() {
    const checkboxes = document.querySelectorAll('#propertyCheckboxes input[type="checkbox"]');
    const newProperties = [];

    checkboxes.forEach((checkbox, idx) => {
    if (checkbox.checked) {
    const propName = checkbox.value;
    const houseSelect = document.getElementById(`house-select-${idx}`);
    const houses = houseSelect ? houseSelect.value : 0;

    newProperties.push({
    name: propName,
    houses: houses
});
}
});

    // Atualizar as propriedades do jogador
    players[currentPlayerForProperties].properties = newProperties;

    propertyModal.hide();
    updatePlayerList();
    saveToLocalStorage();
}

    function addHouse(index, propIndex) {
    let property = players[index].properties[propIndex];
    if (property.houses === 0 || property.houses === '0') {
    property.houses = 1;
} else if (property.houses === 1 || property.houses === '1') {
    property.houses = 2;
} else if (property.houses === 2 || property.houses === '2') {
    property.houses = 3;
} else if (property.houses === 3 || property.houses === '3') {
    property.houses = 'Hotel';
}
    updatePlayerList();
    saveToLocalStorage();
}

    function removeHouse(index, propIndex) {
    let property = players[index].properties[propIndex];
    if (property.houses === 'Hotel') {
    property.houses = 3;
} else if (property.houses === 3 || property.houses === '3') {
    property.houses = 2;
} else if (property.houses === 2 || property.houses === '2') {
    property.houses = 1;
} else if (property.houses === 1 || property.houses === '1') {
    property.houses = 0;
}
    updatePlayerList();
    saveToLocalStorage();
}

    function removeProperty(index, propIndex) {
    if (confirm("Tem certeza que deseja remover esta propriedade?")) {
    players[index].properties.splice(propIndex, 1);
    updatePlayerList();
    saveToLocalStorage();
}
}

    function updateNotes(index) {
    const notes = document.getElementById(`notes-${index}`).value;
    players[index].notes = notes;
    saveToLocalStorage();
}

    function updatePlayerList() {
    const list = document.getElementById('playersList');
    list.innerHTML = '';

    players.forEach((player, index) => {
    let propertiesHTML = '';

    if (player.properties.length > 0) {
    propertiesHTML = '<ul class="list-group mt-3">';
    player.properties.forEach((prop, propIndex) => {
    propertiesHTML += `
                            <li class="list-group-item bg-dark text-light d-flex justify-content-between align-items-center">
                                <div>
                                    ${prop.name} 
                                    <span class="badge bg-secondary ms-2">
                                        ${prop.houses === 'Hotel' ? 'Hotel' : prop.houses + ' casas'}
                                    </span>
                                </div>
                                <div>
                                    <button class="btn btn-sm btn-success" onclick="addHouse(${index}, ${propIndex})">+ Casa</button>
                                    <button class="btn btn-sm btn-warning" onclick="removeHouse(${index}, ${propIndex})">- Casa</button>
                                    <button class="btn btn-sm btn-danger" onclick="removeProperty(${index}, ${propIndex})">Remover</button>
                                </div>
                            </li>
                        `;
});
    propertiesHTML += '</ul>';
} else {
    propertiesHTML = '<p class="mt-3">Nenhuma propriedade</p>';
}

    let playerCard = document.createElement("div");
    playerCard.id = `player-${index}`;
    playerCard.className = "card p-4 mb-4 player-card";

    playerCard.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h3>${player.name}</h3>
                        <button class="btn btn-danger" onclick="removePlayer(${index})">Remover Jogador</button>
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p class="fs-5">Dinheiro: R$ ${player.money.toLocaleString('pt-BR')}</p>
                            <div class="input-group mb-3">
                                <input type="number" class="form-control" id="moneyInput-${index}" placeholder="Digite o valor">
                                <button class="btn btn-success" onclick="updateMoney(${index})">Atualizar</button>
                                <button class="btn btn-primary" onclick="setMoney(${index})">Definir</button>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <button class="btn btn-info w-100 mb-2" onclick="openPropertySelection(${index})">Gerenciar Propriedades</button>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <h5>Propriedades</h5>
                        ${propertiesHTML}
                    </div>
                    
                    <div>
                        <h5>Anotações</h5>
                        <textarea id="notes-${index}" class="form-control player-notes" oninput="updateNotes(${index})">${player.notes || ''}</textarea>
                    </div>
                `;

    list.appendChild(playerCard);
});
}

    async function saveToLocalStorage() {
        try {
            localStorage.setItem('playersData', JSON.stringify(players));

            // Salvar no GitHub Gist
        } catch (e) {
            console.error("Erro ao salvar dados:", e);
        }
    }

    async function newSave()
    {
        if (confirm("Tem certeza que deseja criar um novo save? Todos os dados atuais serão perdidos."))
        {
            players = [];
            updatePlayerList();
            await saveToLocalStorage();
            alert('✅ Novo save criado e salvo na nuvem!');
        }
    }

    function loadSaveFromFile() {
    document.getElementById('loadSaveInput').click();
}

    async function handleFileSelect(event)
    {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async function(e) {
        try {
            const loadedData = JSON.parse(e.target.result);
            if (Array.isArray(loadedData)) {
                players = loadedData;
                updatePlayerList();
                await saveToLocalStorage();
                alert("Save carregado e sincronizado com a nuvem!");
            } else {
                alert("Formato de arquivo inválido.");
            }
        } catch (error) {
            alert("Erro ao ler o arquivo: " + error.message);
        }
    };
    reader.readAsText(file);
}

    function exportData(format) {
    if (players.length === 0) {
    alert("Não há dados para exportar!");
    return;
}

    switch (format) {
    case 'json':
    exportJSON();
    break;
    case 'markdown':
    exportMarkdown();
    break;
    case 'pdf':
    exportPDF();
    break;
}
}

    function exportJSON() {
    const dataStr = JSON.stringify(players, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'gerenciador-jogadores.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

    function exportMarkdown() {
    let markdown = "# Gerenciador de Jogadores\n\n";

    players.forEach((player, index) => {
    markdown += `## ${player.name}\n\n`;
    markdown += `- Dinheiro: R$ ${player.money.toLocaleString('pt-BR')}\n\n`;

    if (player.properties.length > 0) {
    markdown += "### Propriedades\n\n";
    player.properties.forEach(prop => {
    markdown += `- ${prop.name}: ${prop.houses === 'Hotel' ? 'Hotel' : prop.houses + ' casas'}\n`;
});
    markdown += "\n";
} else {
    markdown += "### Propriedades\nNenhuma propriedade\n\n";
}

    if (player.notes && player.notes.trim() !== '') {
    markdown += "### Anotações\n\n";
    markdown += `${player.notes}\n\n`;
} else {
    markdown += "### Anotações\nNenhuma anotação\n\n";
}

    markdown += "---\n\n";
});

    const dataUri = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown);
    const exportFileDefaultName = 'gerenciador-jogadores.md';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

    function exportPDF() {
    // Inicializar jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;

    // Título
    doc.setFontSize(20);
    doc.text("Gerenciador de Jogadores", 105, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(12);

    players.forEach((player, index) => {
    // Verificar se é necessário uma nova página
    if (yPos > pageHeight - 40) {
    doc.addPage();
    yPos = 20;
}

    // Nome do jogador
    doc.setFontSize(16);
    doc.text(`${player.name}`, 10, yPos);
    yPos += 10;

    // Dinheiro
    doc.setFontSize(12);
    doc.text(`Dinheiro: R$ ${player.money.toLocaleString('pt-BR')}`, 10, yPos);
    yPos += 10;

    // Propriedades
    doc.text("Propriedades:", 10, yPos);
    yPos += 8;

    if (player.properties.length > 0) {
    player.properties.forEach(prop => {
    // Verificar se é necessário uma nova página
    if (yPos > pageHeight - 20) {
    doc.addPage();
    yPos = 20;
}

    doc.text(`- ${prop.name}: ${prop.houses === 'Hotel' ? 'Hotel' : prop.houses + ' casas'}`, 15, yPos);
    yPos += 6;
});
} else {
    doc.text("- Nenhuma propriedade", 15, yPos);
    yPos += 6;
}

    yPos += 5;

    // Anotações
    doc.text("Anotações:", 10, yPos);
    yPos += 8;

    if (player.notes && player.notes.trim() !== '') {
    // Quebrar o texto em linhas para que caiba na página
    const splitText = doc.splitTextToSize(player.notes, 180);

    // Verificar se as anotações vão caber na página atual
    if (yPos + (splitText.length * 6) > pageHeight - 20) {
    doc.addPage();
    yPos = 20;
}

    doc.text(splitText, 15, yPos);
    yPos += (splitText.length * 6) + 5;
} else {
    doc.text("- Nenhuma anotação", 15, yPos);
    yPos += 6;
}

    // Separador entre jogadores
    yPos += 10;
    doc.setDrawColor(200);
    doc.line(10, yPos - 5, 200, yPos - 5);
    yPos += 10;
});

    doc.save('gerenciador-jogadores.pdf');
}

    // Abrir CRUD de propriedades
// ============================================
// 7. EDITAR NOMES DE RUAS (CRUD OTIMIZADO)
// ============================================

// Função auxiliar apenas para desenhar a lista (SEM ABRE MODAL)
function renderPropertiesList() {
    const streetContainer = document.getElementById('streetProperties');
    const stockContainer = document.getElementById('stockProperties');
    streetContainer.innerHTML = '';
    stockContainer.innerHTML = '';

    availableProperties.forEach((prop, index) => {
        const isStock = prop.toLowerCase().includes('ações');
        const container = isStock ? stockContainer : streetContainer;

        let isInUse = false;
        if(typeof players !== 'undefined') {
            isInUse = players.some(pl => pl.properties.some(p => p.name === prop));
        }

        const div = document.createElement('div');
        div.className = 'mb-2';
        // O evento oninput chama a função de salvar a cada letra digitada
        div.innerHTML = `
            <div class="input-group input-group-sm">
                <span class="input-group-text" style="width: 40px;">${index + 1}</span>
                <input type="text" 
                       class="form-control" 
                       value="${prop}"
                       oninput="autoSavePropertyName(${index}, this.value)">
                <button class="btn btn-danger btn-sm" 
                        onclick="deleteProperty(${index})"
                        ${isInUse ? 'disabled title="Propriedade em uso"' : ''}>
                    🗑️
                </button>
            </div>`;
        container.appendChild(div);
    });
}

// 1. Abrir o Editor (Abre o modal e desenha a lista)
    function openPropertyEditor() {
        renderPropertiesList();

        const modalElement = document.getElementById('propertyEditorModal');

        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);

        modalInstance.show();
    }

// 2. Adicionar Nova Propriedade
function addNewProperty() {
    const nameInput = document.getElementById('newPropertyName');
    const typeSelect = document.getElementById('newPropertyType');
    const rawName = nameInput.value.trim();

    if (!rawName) { alert('Digite um nome!'); return; }

    // Lógica para adicionar prefixo "Ações" se necessário
    const finalName = typeSelect.value === 'stock' && !rawName.toLowerCase().includes('ações')
        ? `Ações ${rawName}`
        : rawName;

    if (availableProperties.includes(finalName)) {
        alert('Esta propriedade já existe!');
        return;
    }

    availableProperties.push(finalName);
    saveToLocalStorage(); // Salva no PC

    renderPropertiesList(); // ATUALIZA A LISTA SEM REABRIR O MODAL
    nameInput.value = '';
}

// 3. Deletar Propriedade
function deleteProperty(index) {
    const propName = availableProperties[index];
    const isInUse = players.some(pl => pl.properties.some(p => p.name === propName));

    if (isInUse) {
        alert("Não é possível excluir: Propriedade em uso por um jogador.");
        return;
    }

    if (confirm("Excluir esta propriedade?")) {
        availableProperties.splice(index, 1);
        saveToLocalStorage(); // Salva no PC
        renderPropertiesList(); // ATUALIZA A LISTA SEM REABRIR O MODAL
    }
}

// 4. Salvar Automaticamente ao Digitar (Substitui o botão Salvar)
function autoSavePropertyName(index, newValue) {
    if (newValue && newValue.trim() !== "") {
        availableProperties[index] = newValue;
        saveToLocalStorage(); // Salva instantaneamente no PC
    }
}

// 5. Restaurar Padrão
function resetPropertyNames() {
    if(confirm("Restaurar nomes originais?")) {
        availableProperties = [...defaultProperties];
        saveToLocalStorage();
        renderPropertiesList(); // ATUALIZA A LISTA SEM REABRIR O MODAL
    }
}

    // ============================================
    // SISTEMA DE TEMA CLARO/ESCURO
    // ============================================

    // Carregar tema salvo
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = `container py-4 ${savedTheme}-theme`;
        document.getElementById('checkbox').checked = (savedTheme === 'dark');
    }

    // Alternar tema
    function toggleTheme() {
        const checkbox = document.getElementById('checkbox');
        const currentTheme = checkbox.checked ? 'dark' : 'light';

        document.body.className = `container py-4 ${currentTheme}-theme`;
        localStorage.setItem('theme', currentTheme);

        // Animação suave
        document.body.style.transition = 'background-color 3.0s ease, color 3.0s ease';
    }

// Salvar propriedades no GitHub Gist

// Salvar jogadores no GitHub Gist

// ============================================
// SISTEMA DE MÚLTIPLOS SAVES (PANTRY)
// ============================================

function openSaveGameModal() {
    if (players.length === 0) {
        alert('⚠️ Adicione pelo menos um jogador antes de salvar!');
        return;
    }
    document.getElementById('playerCount').textContent = players.length;
    document.getElementById('gameName').value = '';
    document.getElementById('gameDescription').value = '';
    const modal = new bootstrap.Modal(document.getElementById('saveGameModal'));
    modal.show();
}

async function saveGame() {
    const gameName = document.getElementById('gameName').value.trim();
    const gameDescription = document.getElementById('gameDescription').value.trim();

    if (!gameName) {
        alert('⚠️ Digite um nome para o jogo!');
        return;
    }

    // Cria a chave única (Ex: "Jogo 1" vira "Jogo_1")
    const saveKey = gameName.replace(/\s+/g, '_');

    try {
        document.body.style.cursor = 'wait';

        // 1. PRIMEIRO: Baixamos o que já existe na nuvem para não perder nada
        let currentSaves = {};
        try {
            const getResponse = await fetch(API_URL);
            if (getResponse.ok) {
                currentSaves = await getResponse.json();
            }
        } catch (e) {
            console.log('Criando a primeira lista de saves...');
        }

        // 2. SEGUNDO: Adicionamos o NOVO jogo dentro da lista que baixamos
        currentSaves[saveKey] = {
            name: gameName,
            description: gameDescription,
            players: players,
            properties: availableProperties,
            createdAt: currentSaves[saveKey]?.createdAt || new Date().toISOString(), // Mantém data original se for edição
            updatedAt: new Date().toISOString(),
            totalPlayers: players.length,
            version: '2.0'
        };

        // 3. TERCEIRO: Enviamos a lista COMPLETA de volta usando PUT (que substitui com segurança)
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentSaves)
        });

        if (!response.ok) throw new Error('Erro ao salvar na nuvem');

        bootstrap.Modal.getInstance(document.getElementById('saveGameModal')).hide();
        alert(`✅ Jogo "${gameName}" salvo na lista com sucesso!`);

    } catch (error) {
        alert('❌ Erro: ' + error.message);
    } finally {
        document.body.style.cursor = 'default';
    }
}

async function openLoadGameModal() {
    const modal = new bootstrap.Modal(document.getElementById('loadGameModal'));
    const listContainer = document.getElementById('savedGamesList');
    listContainer.innerHTML = '<div class="text-center p-3"><div class="spinner-border text-primary"></div><p>Buscando saves...</p></div>';
    modal.show();

    try
    {
        const response = await fetch(API_URL);
        if (!response.ok) { listContainer.innerHTML = '<div class="alert alert-info">Nenhum save encontrado.</div>'; return; }

        const allData = await response.json();
        cachedSaves = allData;
        listContainer.innerHTML = '';

        const saveKeys = Object.keys(allData);
        if (saveKeys.length === 0) { listContainer.innerHTML = '<div class="alert alert-info">Lista vazia.</div>'; return; }

        saveKeys.forEach(key => {
            const save = allData[key];
            if (!save.players) return;
            const date = new Date(save.createdAt).toLocaleString('pt-BR');
            const playerNames = save.players.map(p => p.name).join(', ');

            const card = document.createElement('div');
            card.className = 'card mb-3 bg-secondary text-light border-light';
            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0 text-warning">${save.name}</h5>
                        <small class="text-white-50">${date}</small>
                    </div>
                    <p class="card-text small">${save.description || ''}</p>
                    <p class="card-text"><small>👥 ${playerNames}</small></p>
                    <div class="d-flex gap-2 justify-content-end">
                        <button class="btn btn-sm btn-primary" onclick="loadGame('${key}')">📂 Carregar</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteGame('${key}')">🗑️ Excluir</button>
                    </div>
                </div>`;
            listContainer.appendChild(card);
        });
    } catch (error) {
        listContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}

function loadGame(key) {
    if (!confirm('⚠️ Isso substituirá o jogo atual. Continuar?')) return;
    const save = cachedSaves[key];
    if (save) {
        players = save.players;
        if(save.properties) availableProperties = save.properties;
        updatePlayerList();
        localStorage.setItem('playersData', JSON.stringify(players));
        localStorage.setItem('customProperties', JSON.stringify(availableProperties));
        bootstrap.Modal.getInstance(document.getElementById('loadGameModal')).hide();
        alert(`✅ Jogo "${save.name}" carregado!`);
    }
}

async function deleteGame(key) {
    if (!confirm('🗑️ Excluir este save?')) return;
    try {
        delete cachedSaves[key];
        document.body.style.cursor = 'wait';
        await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cachedSaves)
        });
        alert('✅ Excluído!');
        openLoadGameModal();
    } catch (error) {
        alert('Erro: ' + error.message);
    } finally {
        document.body.style.cursor = 'default';
    }
}
// Executar ao carregar a página
loadTheme();