import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'utility';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6;                break;
            case b: h = ((r - g) / d + 4) / 6;                break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export const data = new SlashCommandBuilder()
    .setName('renk')
    .setDescription('🎨 Bir rengi HEX kodundan görselleştirir ve bilgilerini gösterir.')
    .addStringOption(opt =>
        opt.setName('hex')
           .setDescription('Renk kodu (örnek: #5865F2 veya 5865F2)')
           .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const input = interaction.options.getString('hex', true).trim().replace(/^#/, '');

    if (!/^[0-9a-fA-F]{6}$/.test(input)) {
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Geçersiz HEX kodu. 6 haneli hex gir. Örnek: `5865F2`')],
            ephemeral: true,
        });
        return;
    }

    const hex = `#${input.toUpperCase()}`;
    const rgb = hexToRgb(input)!;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const decimal = parseInt(input, 16);

    const embed = new EmbedBuilder()
        .setColor(decimal)
        .setTitle(`🎨 ${hex}`)
        .setDescription('‎') // rengi embed kenarında göstermek için boşluk
        .addFields(
            { name: '🔴 HEX',      value: `\`${hex}\``,                              inline: true },
            { name: '🟢 RGB',      value: `\`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\``,   inline: true },
            { name: '🔵 HSL',      value: `\`hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)\``, inline: true },
            { name: '🔢 Decimal',  value: `\`${decimal}\``,                          inline: true },
        )
        .setThumbnail(`https://singlecolorimage.com/get/${input}/100x100`)
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
