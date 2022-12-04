const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");
const Suggestion = require("../../structures/schema/suggestions");

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`accept`)
    .setDescription(`Accept a suggestion!`)
    .addStringOption(option=>option.setName(`id`).setDescription(`The suggestion ID`).setRequired(true))
    .addStringOption(option=>option.setName(`reason`).setDescription(`The reason for accepting the suggestion`).setRequired(true))
    .setDMPermission(false),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     **/
    async execute(interaction, client) {
        let suggestionId = interaction.options.getString(`id`);
        let suggestion = await Suggestion.findOne({ _id: suggestionId });
        if (!suggestion) return interaction.reply({ content: `That suggestion does not exist!`, ephemeral: true });
        if (suggestion.status !== `pending`) return interaction.reply({ content: `That suggestion is not pending!`, ephemeral: true });

        let reason = interaction.options.getString(`reason`);
        let suggChannel = interaction.guild.channels.cache.find(c=>c.id===client.config.suggChannels.pending);
        if (!suggChannel) return interaction.reply({ content: `The suggestion channel is not set up!`, ephemeral: true });

        let suggMessage = await suggChannel.messages.fetch(suggestion.messageId);
        if (!suggMessage) return interaction.reply({ content: `The suggestion message does not exist!`, ephemeral: true });

        let embed = EmbedBuilder.from(suggMessage.embeds[0]);
        embed.setColor(client.config.suggColors.approved);
        embed.addFields(
            { name: `Status`, value: `Approved`, inline: true },
            { name: `Verdict Reason`, value: reason, inline: true },
        );

        await suggMessage.delete();
        
        let acceptedChannel = interaction.guild.channels.cache.find(c=>c.id===client.config.suggChannels.approved);
        if (!acceptedChannel) return interaction.reply({ content: `The accepted suggestion channel is not set up!`, ephemeral: true });

        let newMsg = await acceptedChannel.send({ embeds: [embed] });

        suggestion.status = `approved`;
        suggestion.messageId = newMsg.id;
        await suggestion.save();

        return interaction.reply({ content: `Suggestion accepted!`, ephemeral: true });
    }
}