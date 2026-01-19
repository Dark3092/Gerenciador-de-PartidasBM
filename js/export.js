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
    // 1. Limpeza de segurança: Filtra apenas jogadores válidos
    const cleanPlayers = players.filter(p => p && p.name).map(player => ({
        name: player.name.trim(),
        money: parseFloat(player.money) || 0,
        properties: Array.isArray(player.properties) ? player.properties : [],
        notes: player.notes || ""
    }));

    // 2. Garante que salvamos o estado atual antes de exportar
    saveToLocalStorage();

    // 3. Gera o arquivo
    const dataStr = JSON.stringify(cleanPlayers, null, 2);
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
