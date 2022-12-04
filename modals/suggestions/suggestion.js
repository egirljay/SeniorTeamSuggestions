const { ModalSubmitInteraction, Client, EmbedBuilder } = require('discord.js');
const Suggestion = require('../../structures/schema/suggestions');

module.exports = {
    id: `suggestion`,

    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        let fieldValue = interaction.fields.getTextInputValue(`suggest`);
        if (!fieldValue) return interaction.reply({ content: `You must provide a suggestion!`, ephemeral: true });

        let suggestionId = between(1, 999999);
        let suggestionTest = await Suggestion.findOne({ _id: suggestionId });
        while (suggestionTest) {
            suggestionId = between(1, 999999);
            suggestionTest = await Suggestions.findOne({ _id: suggestionId });
        }

        let suggestion = new Suggestion({
            _id: suggestionId,
            suggestion: fieldValue,
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            status: `pending`
        });

        let embed = new EmbedBuilder()
        .setTitle(`Suggestion Submitted!`)
        .addFields(
            { name: `Suggestion ID`, value: `${suggestionId}`, inline: true },
            { name: `Suggestion`, value: `${fieldValue}`, inline: false },
        )
        .setColor(client.config.color)

        let suggEmbed = new EmbedBuilder()
        .setTitle(`New Suggestion!`)
        .addFields(
            { name: `Suggestion ID`, value: `${suggestionId}`, inline: true },
            { name: `Suggestion`, value: `${fieldValue}`, inline: false },
            { name: `User`, value: `<@${interaction.user.id}>`, inline: true },
        )
        .setColor(client.config.suggColors.pending)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }));

        let suggChannel = interaction.guild.channels.cache.find(c=>c.id===client.config.suggChannels.pending);
        if (!suggChannel) return interaction.reply({ content: `The suggestion channel is not set up!`, ephemeral: true });

        let suggMessage = await suggChannel.send({ embeds: [suggEmbed] });
        await suggMessage.react(`✅`);
        await suggMessage.react(`❌`);

        suggestion.messageId = suggMessage.id;
        await suggestion.save();
        return interaction.reply({ embeds: [embed] });
    }
}

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}