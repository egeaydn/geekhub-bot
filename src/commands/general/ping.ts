import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'general';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Botun çalışma durumunu ve gecikmesini gösterir.');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.reply({ content: '📡 Ölçülüyor...', fetchReply: true });

    const roundtrip  = sent.createdTimestamp - interaction.createdTimestamp;
    const wsHeartbeat = interaction.client.ws.ping;

    const color = roundtrip < 100 ? COLORS.SUCCESS : roundtrip < 250 ? COLORS.WARNING : COLORS.ERROR;

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('🏓 Pong!')
        .addFields(
            { name: '⚡ Roundtrip',           value: `\`${roundtrip}ms\``,   inline: true },
            { name: '💓 WebSocket Kalp Atışı', value: `\`${wsHeartbeat}ms\``, inline: true },
        )
        .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
}
