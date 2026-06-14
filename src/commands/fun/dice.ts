import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'fun';

export const data = new SlashCommandBuilder()
    .setName('zar')
    .setDescription('🎲 Zar atar! Kaç yüzlü olduğunu seçebilirsin.')
    .addIntegerOption(opt =>
        opt.setName('yuz')
           .setDescription('Zarın yüz sayısı (varsayılan: 6)')
           .setMinValue(2)
           .setMaxValue(1000)
           .setRequired(false),
    )
    .addIntegerOption(opt =>
        opt.setName('adet')
           .setDescription('Kaç zar atılsın? (varsayılan: 1, max: 10)')
           .setMinValue(1)
           .setMaxValue(10)
           .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sides  = interaction.options.getInteger('yuz')  ?? 6;
    const count  = interaction.options.getInteger('adet') ?? 1;

    const results = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total   = results.reduce((a, b) => a + b, 0);

    const diceDisplay = results.map(r => `**${r}**`).join(' + ');

    const embed = new EmbedBuilder()
        .setColor(COLORS.FUN)
        .setTitle(`🎲 ${count}d${sides} Zar`)
        .addFields(
            { name: '🎯 Sonuçlar', value: diceDisplay,        inline: false },
            { name: '➕ Toplam',   value: `**${total}**`,     inline: true  },
            { name: '📊 Ortalama', value: `**${(total / count).toFixed(1)}**`, inline: true },
        )
        .setFooter({ text: `${interaction.user.tag} attı` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
