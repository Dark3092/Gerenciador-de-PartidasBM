// js/saveCloud.js

// ID Fixo para o save único
const SINGLE_SAVE_ID = 'save_jogo_unico';

function getNoCacheUrl() {
    return `${API_URL}?t=${new Date().getTime()}`;
}

// --- SALVAR (Sobrescreve tudo) ---
async function saveGame() {
    const gameName = document.getElementById('gameName').value.trim();
    const gameDescription = document.getElementById('gameDescription').value.trim();

    if (!gameName) { alert('⚠️ Digite um nome para o jogo!'); return; }

    try {
        document.body.style.cursor = 'wait';

        // 1. Limpa os dados atuais da memória (Remove duplicatas)
        const cleanData = IntegrityManager.cleanData(players, availableProperties);

        // 2. Cria o objeto do Save
        const saveObject = {
            id: SINGLE_SAVE_ID,
            name: gameName,
            description: gameDescription,
            players: cleanData.players,
            properties: cleanData.properties,
            updatedAt: new Date().toISOString(),
            version: "3.0-single"
        };

        // 3. Cria o "Pacote" para a nuvem (Um objeto contendo apenas nosso ID fixo)
        const payload = {
            [SINGLE_SAVE_ID]: saveObject
        };

        // 4. ENVIAR (PUT) - Substitui todo o conteúdo da cesta pelo nosso novo save
        const response = await fetch(getNoCacheUrl(), {
            method: 'PUT', // PUT substitui o recurso
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Erro ao conectar com servidor");

        // Atualiza memória local
        currentLoadedId = SINGLE_SAVE_ID;
        cachedSaves = payload;

        bootstrap.Modal.getInstance(document.getElementById('saveGameModal')).hide();
        alert(`✅ Jogo salvo com sucesso! (Save anterior substituído)`);

    } catch (error) {
        console.error(error);
        alert('❌ Erro ao salvar: ' + error.message);
    } finally {
        document.body.style.cursor = 'default';
    }
}

// --- MODAL DE CARREGAR ---
function openSaveGameModal() {
    if (players.length === 0) {
        alert('⚠️ Adicione jogadores antes de salvar!');
        return;
    }
    document.getElementById('playerCount').textContent = players.length;
    // Se já tivermos dados carregados, preenche o formulário
    if (cachedSaves && cachedSaves[SINGLE_SAVE_ID]) {
        const save = cachedSaves[SINGLE_SAVE_ID];
        document.getElementById('gameName').value = save.name;
        document.getElementById('gameDescription').value = save.description || '';
    }
    new bootstrap.Modal(document.getElementById('saveGameModal')).show();
}

async function openLoadGameModal() {
    const listContainer = document.getElementById('savedGamesList');
    listContainer.innerHTML = '<div class="text-center p-3"><div class="spinner-border text-primary"></div><p>Buscando save na nuvem...</p></div>';
    new bootstrap.Modal(document.getElementById('loadGameModal')).show();

    try {
        const response = await fetch(getNoCacheUrl());

        // Se a cesta estiver vazia ou erro 404
        if (!response.ok) {
            listContainer.innerHTML = '<div class="alert alert-info">Nenhum save encontrado na nuvem.</div>';
            return;
        }

        const cloudData = await response.json();
        cachedSaves = cloudData; // Salva no cache

        // Verifica se nosso ID existe lá
        if (cloudData && cloudData[SINGLE_SAVE_ID]) {
            renderSingleSaveCard(cloudData[SINGLE_SAVE_ID]);
        } else {
            listContainer.innerHTML = '<div class="alert alert-info">Nenhum jogo salvo encontrado.</div>';
        }

    } catch (error) {
        listContainer.innerHTML = `<div class="alert alert-danger">Erro de conexão: ${error.message}</div>`;
    }
}

// Desenha apenas 1 cartão
function renderSingleSaveCard(save) {
    const listContainer = document.getElementById('savedGamesList');
    const date = new Date(save.updatedAt).toLocaleString('pt-BR');

    listContainer.innerHTML = `
        <div class="card bg-secondary text-white border-warning">
            <div class="card-header bg-dark border-warning text-warning d-flex justify-content-between">
                <strong>⭐ Save Único na Nuvem</strong>
                <small>${date}</small>
            </div>
            <div class="card-body">
                <h5 class="card-title">${save.name}</h5>
                <p class="card-text">${save.description || 'Sem descrição'}</p>
                <p class="card-text"><small>👥 ${save.players.length} Jogadores</small></p>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-success" onclick="loadSingleGame()">📂 CARREGAR ESTE JOGO</button>
                    <button class="btn btn-outline-danger btn-sm mt-2" onclick="deleteGame()">🗑️ Apagar Save da Nuvem</button>
                </div>
            </div>
        </div>`;
}

// --- CARREGAR ---
function loadSingleGame() {
    if (!confirm('Isso substituirá o jogo atual da tela. Continuar?')) return;

    const save = cachedSaves[SINGLE_SAVE_ID];

    if (save) {
        // Aplica integridade ao carregar também (Segurança extra)
        const cleanData = IntegrityManager.cleanData(save.players, save.properties);

        players = []; // 1. Zera a lista forçadamente
        players = [...cleanData.players];
        if (cleanData.properties && cleanData.properties.length > 0) {
            availableProperties = cleanData.properties;
        } else {
            availableProperties = [...defaultProperties];
        }

        currentLoadedId = SINGLE_SAVE_ID;
        updatePlayerList();
        saveToLocalStorage(); // Salva no navegador

        bootstrap.Modal.getInstance(document.getElementById('loadGameModal')).hide();
        alert(`✅ Jogo "${save.name}" carregado!`);
    } else {
        alert("Erro: Dados do save não encontrados.");
    }
}

// --- DELETAR ---
async function deleteGame() {
    if (!confirm('🗑️ TEM CERTEZA? O save da nuvem será apagado permanentemente!')) return;

    try {
        document.body.style.cursor = 'wait';

        // Para apagar, enviamos um objeto vazio {} para a API
        await fetch(getNoCacheUrl(), {
            method: 'PUT', // POST ou PUT com objeto vazio limpa ou substitui
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({})
        });

        cachedSaves = {};
        currentLoadedId = null;

        openLoadGameModal(); // Atualiza a tela (vai mostrar "Nenhum save")
        alert('✅ Save apagado da nuvem!');

    } catch(e) {
        alert('Erro ao apagar: ' + e.message);
    } finally {
        document.body.style.cursor = 'default';
    }
}

async function newSave() {
    if (confirm("Limpar a tela para começar um jogo novo? (Isso não apaga a nuvem, apenas sua tela)")) {
        players = [];
        currentLoadedId = null;
        updatePlayerList();
        saveToLocalStorage();
    }
}