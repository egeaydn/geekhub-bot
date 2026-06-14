import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'utility';

export const data = new SlashCommandBuilder()
    .setName('hesapla')
    .setDescription('🧮 Matematiksel bir ifadeyi hesaplar.')
    .addStringOption(opt =>
        opt.setName('ifade')
           .setDescription('Örnek: (25 * 4) / 2 + 10')
           .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const expression = interaction.options.getString('ifade', true).trim();

    // Sadece sayı ve matematiksel operatörlere izin ver
    if (!/^[0-9+\-*/.()%\s]+$/.test(expression)) {
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor(COLORS.ERROR)
                .setDescription('❌ Geçersiz ifade! Sadece sayılar ve `+ - * / ( ) % .` kullanabilirsin.')],
            ephemeral: true,
        });
        return;
    }

    let result: number;
    try {
        // eslint-disable-next-line no-new-func
        result = Function(`"use strict"; return (${expression})`)() as number;
    } catch {
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Hesaplama hatası. İfadeyi kontrol et.')],
            ephemeral: true,
        });
        return;
    }

    if (!isFinite(result)) {
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Tanımsız sonuç (sıfıra bölme veya aşım).')],
            ephemeral: true,
        });
        return;
    }

    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/\.?0+$/, '');

    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS)
        .setTitle('🧮 Hesap Makinesi')
        .addFields(
            { name: '📥 İfade',   value: `\`${expression}\``,  inline: false },
            { name: '📤 Sonuç',   value: `\`\`\`${formatted}\`\`\``, inline: false },
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
