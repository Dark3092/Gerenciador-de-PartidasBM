// ============================================
// player
// ============================================

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

function updateNotes(index) {
    const notes = document.getElementById(`notes-${index}`).value;
    players[index].notes = notes;
    saveToLocalStorage();
}

// ============================================
// property
// ============================================

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

// ============================================
// money
// ============================================

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


