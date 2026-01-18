// js/saveIntegrity.js
const IntegrityManager = {

    // Limpa os dados (Remove duplicatas de nomes e propriedades)
    cleanData: function(playersArray, propertiesArray) {
        return {
            players: this.deduplicatePlayers(playersArray),
            properties: this.deduplicateProperties(propertiesArray)
        };
    },

    // Remove jogadores com mesmo nome
    deduplicatePlayers: function(playersArray) {
        if (!Array.isArray(playersArray)) return [];
        const seenNames = new Set();
        const uniquePlayers = [];

        playersArray.forEach(player => {
            const normalizedName = player.name.trim();
            if (!seenNames.has(normalizedName)) {
                seenNames.add(normalizedName);
                // Garante que as propriedades do jogador tbm sejam únicas
                if (player.properties) {
                    player.properties = this.deduplicatePlayerProperties(player.properties);
                }
                uniquePlayers.push(player);
            }
        });
        return uniquePlayers;
    },

    // Remove propriedades globais duplicadas
    deduplicateProperties: function(propertiesArray) {
        if (!Array.isArray(propertiesArray)) return [...defaultProperties];
        return [...new Set(propertiesArray)];
    },

    // Remove propriedades duplicadas dentro de um jogador
    deduplicatePlayerProperties: function(playerProps) {
        if (!Array.isArray(playerProps)) return [];
        const seenProps = new Set();
        const uniqueProps = [];

        playerProps.forEach(prop => {
            if (!seenProps.has(prop.name)) {
                seenProps.add(prop.name);
                uniqueProps.push(prop);
            }
        });
        return uniqueProps;
    }
};