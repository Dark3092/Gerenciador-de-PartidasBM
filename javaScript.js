

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

    // Carregar propriedades personalizadas ao iniciar
    function loadCustomProperties() {
        const saved = localStorage.getItem('customProperties');
        if (saved) {
            try {
                availableProperties = JSON.parse(saved);
            } catch (e) {
                console.error('Erro ao carregar propriedades:', e);
                availableProperties = [...defaultProperties];
            }
        }
    }

    // Executar ao carregar a página
    loadCustomProperties();

    // Inicializar o Modal de Bootstrap
    let propertyModal;
    document.addEventListener('DOMContentLoaded', function() {
    propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));

    // Tentar carregar dados salvos localmente
    const savedData = localStorage.getItem('playersData');
    if (savedData) {
    try {
    players = JSON.parse(savedData);
    updatePlayerList();
} catch (e) {
    console.error("Erro ao carregar dados salvos:", e);
}
}
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
    playerCard.className = "card p-4 mb-4";

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

    function saveToLocalStorage() {
    try {
    localStorage.setItem('playersData', JSON.stringify(players));
} catch (e) {
    console.error("Erro ao salvar dados:", e);
}
}

    function newSave() {
    if (confirm("Tem certeza que deseja criar um novo save? Todos os dados atuais serão perdidos.")) {
    players = [];
    updatePlayerList();
    saveToLocalStorage();
}
}

    function loadSaveFromFile() {
    document.getElementById('loadSaveInput').click();
}

    function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
    try {
    const loadedData = JSON.parse(e.target.result);
    if (Array.isArray(loadedData)) {
    players = loadedData;
    updatePlayerList();
    saveToLocalStorage();
    alert("Save carregado com sucesso!");
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
    function openPropertyEditor() {
        const streetContainer = document.getElementById('streetProperties');
        const stockContainer = document.getElementById('stockProperties');

        streetContainer.innerHTML = '';
        stockContainer.innerHTML = '';

        availableProperties.forEach((prop, index) => {
            const isStock = prop.toLowerCase().includes('ações');
            const container = isStock ? stockContainer : streetContainer;

            // Verificar se a propriedade está em uso
            let isInUse = false;
            players.forEach(player => {
                if (player.properties.some(p => p.name === prop)) {
                    isInUse = true;
                }
            });

            const div = document.createElement('div');
            div.className = 'mb-2';
            div.innerHTML = `
            <div class="input-group input-group-sm">
                <span class="input-group-text" style="width: 40px;">${index + 1}</span>
                <input type="text" 
                       class="form-control property-name-input" 
                       data-index="${index}" 
                       value="${prop}"
                       placeholder="Nome da propriedade">
                <button class="btn btn-danger btn-sm" 
                        onclick="deleteProperty(${index})"
                        ${isInUse ? 'disabled title="Propriedade em uso por um jogador"' : ''}>
                    🗑️
                </button>
            </div>
            ${isInUse ? '<small class="text-warning">⚠️ Em uso - não pode ser excluída</small>' : ''}
        `;
            container.appendChild(div);
        });

        const modal = new bootstrap.Modal(document.getElementById('propertyEditorModal'));
        modal.show();
    }

    // Adicionar nova propriedade
    function addNewProperty() {
        const nameInput = document.getElementById('newPropertyName');
        const typeSelect = document.getElementById('newPropertyType');
        const name = nameInput.value.trim();

        if (!name) {
            alert('⚠️ Digite um nome para a propriedade!');
            return;
        }

        // Verificar se já existe
        if (availableProperties.includes(name)) {
            alert('⚠️ Esta propriedade já existe!');
            return;
        }

        // Adicionar "Ações" no nome se for do tipo stock
        const finalName = typeSelect.value === 'stock' && !name.toLowerCase().includes('ações')
            ? `Ações ${name}`
            : name;

        availableProperties.push(finalName);

        // Limpar input
        nameInput.value = '';

        // Reabrir modal atualizado
        openPropertyEditor();

        alert(`✅ Propriedade "${finalName}" adicionada!`);
    }

    // Excluir propriedade
    function deleteProperty(index) {
        const propName = availableProperties[index];

        // Verificar se está em uso
        let isInUse = false;
        players.forEach(player => {
            if (player.properties.some(p => p.name === propName)) {
                isInUse = true;
            }
        });

        if (isInUse) {
            alert('⚠️ Esta propriedade está em uso por um jogador e não pode ser excluída!');
            return;
        }

        if (confirm(`🗑️ Tem certeza que deseja excluir "${propName}"?`)) {
            availableProperties.splice(index, 1);
            openPropertyEditor();
            alert('✅ Propriedade excluída!');
        }
    }

    // Salvar nomes das propriedades
    function savePropertyNames() {
        const inputs = document.querySelectorAll('.property-name-input');
        const newProperties = [];

        inputs.forEach(input => {
            const value = input.value.trim();
            if (value) {
                newProperties.push(value);
            } else {
                alert('⚠️ Todos os campos devem ser preenchidos!');
                return;
            }
        });

        if (newProperties.length === defaultProperties.length) {
            players.forEach(player => {
                player.properties.forEach(prop => {
                    const oldIndex = availableProperties.indexOf(prop.name);
                    if (oldIndex !== -1) {
                        prop.name = newProperties[oldIndex];
                    }
                });
            });

            availableProperties = newProperties;
            localStorage.setItem('customProperties', JSON.stringify(availableProperties));
            updatePlayersDisplay();

            bootstrap.Modal.getInstance(document.getElementById('propertyEditorModal')).hide();
            alert('✅ Nomes atualizados com sucesso!');
        }
    }

    // Restaurar nomes padrão
    function resetPropertyNames() {
        if (confirm('⚠️ Tem certeza que deseja restaurar os nomes padrão?')) {
            players.forEach(player => {
                player.properties.forEach(prop => {
                    const oldIndex = availableProperties.indexOf(prop.name);
                    if (oldIndex !== -1) {
                        prop.name = defaultProperties[oldIndex];
                    }
                });
            });

            availableProperties = [...defaultProperties];
            localStorage.setItem('customProperties', JSON.stringify(availableProperties));
            updatePlayersDisplay();
            openPropertyEditor();

            alert('✅ Nomes restaurados!');
        }
    }
