
function loadCustomProperties() {
    availableProperties = [...defaultProperties];

    localStorage.setItem('customProperties', JSON.stringify(availableProperties));
}

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
        renderPropertiesList(); // ATUALIZA A LISTA SEM REABRIR O MODAL
    }
}

// 4. Salvar Automaticamente ao Digitar (Substitui o botão Salvar)
function autoSavePropertyName(index, newValue) {
    if (newValue && newValue.trim() !== "") {
        availableProperties[index] = newValue;
    }
}

// 5. Restaurar Padrão
function resetPropertyNames() {
    if(confirm("Restaurar nomes originais?")) {
        availableProperties = [...defaultProperties];
        renderPropertiesList(); // ATUALIZA A LISTA SEM REABRIR O MODAL
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

    if(typeof setupPropertySearch === 'function') {
        setupPropertySearch();
    }
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
    saveToLocalStorage(); // <--- ADICIONADO: Salva a alteração
}

function removeProperty(index, propIndex) {
    if (confirm("Tem certeza que deseja remover esta propriedade?")) {
        players[index].properties.splice(propIndex, 1);
        updatePlayerList();
        saveToLocalStorage(); // <--- ADICIONADO: Salva a alteração
    }
}