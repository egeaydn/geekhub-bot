import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS, BOT_NAME, CATEGORY_META } from '../../config';
import { ExtendedClient } from '../../types/ExtendedClient';

export const category = 'general';

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 Tüm komutları ve açıklamalarını gösterir.');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const client   = interaction.client as ExtendedClient;
    const commands = [...client.commands.values()];

    // Kategorilere göre grupla
    const grouped = new Map<string, typeof commands>();
    for (const cmd of commands) {
        const cat = cmd.category ?? 'other';
        if (!grouped.has(cat)) grouped.set(cat, []);
        grouped.get(cat)!.push(cmd);
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle(`📖 ${BOT_NAME} — Yardım Menüsü`)
        .setDescription('Tüm komutlar `/` ile başlar. Bir komuta tıklayarak Discord\'da otomatik doldurabilirsin.')
        .setThumbnail(interaction.client.user?.displayAvatarURL() ?? null)
        .setFooter({ text: BOT_NAME, iconURL: interaction.client.user?.displayAvatarURL() })
        .setTimestamp();

    const categoryOrder = ['general', 'moderation', 'utility', 'fun'];
    for (const cat of categoryOrder) {
        const cmds = grouped.get(cat);
        if (!cmds?.length) continue;

        const meta  = CATEGORY_META[cat] ?? { emoji: '📦', label: cat };
        const value = cmds
            .map(c => `\`/${c.data.name}\` — ${c.data.description}`)
            .join('\n');

        embed.addFields({ name: `${meta.emoji} ${meta.label} Komutları`, value, inline: false });
    }

    await interaction.reply({ embeds: [embed] });
}
