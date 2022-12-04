const { SlashCommandBuilder, ChatInputCommandInteraction, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`suggest`)
    .setDescription(`Suggest something to the server!`)
    .setDMPermission(false),

    cooldown: "5s",

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {
        let textQuestion = new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId(`suggest`)
        .setPlaceholder(`What do you want to suggest?`)
        .setMinLength(1)
        .setMaxLength(1000)
        .setRequired(true)
        .setLabel(`Suggestion`);

        let actionRow = new ActionRowBuilder()
        .addComponents(textQuestion);

        let modalBuilder = new ModalBuilder()
        .setCustomId(`suggestion`)
        .setComponents(actionRow)
        .setTitle(`Suggestion`)

        return interaction.showModal(modalBuilder);
    }
}