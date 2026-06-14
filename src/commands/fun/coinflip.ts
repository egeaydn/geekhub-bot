import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'fun';

export const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('🪙 Yazı mı tura mı? Madeni parayı çevir!');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const isHeads = Math.random() < 0.5;

    const embed = new EmbedBuilder()
        .setColor(isHeads ? COLORS.SUCCESS : COLORS.FUN)
        .setTitle('🪙 Madeni Para')
        .setDescription(isHeads ? '**YAZI!** 🟡' : '**TURA!** 🔵')
        .setFooter({ text: `${interaction.user.tag} attı` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
