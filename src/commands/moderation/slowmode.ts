import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextChannel,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'moderation';

export const data = new SlashCommandBuilder()
    .setName('yavasmod')
    .setDescription('🐢 Kanalda yavaş mod süresini ayarlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(opt =>
        opt.setName('saniye')
           .setDescription('Bekleme süresi (0 = kapat, max 21600 = 6 saat)')
           .setMinValue(0)
           .setMaxValue(21600)
           .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const saniye = interaction.options.getInteger('saniye', true);
    const channel = interaction.channel as TextChannel;

    if (!channel?.isTextBased()) {
        await interaction.reply({ content: '❌ Bu komut metin kanallarında çalışır.', ephemeral: true });
        return;
    }

    try {
        await channel.setRateLimitPerUser(saniye, `${interaction.user.tag} tarafından ayarlandı`);
    } catch {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Yavaş mod ayarlanamadı.')], ephemeral: true });
        return;
    }

    let description: string;
    let color: number;

    if (saniye === 0) {
        description = `✅ ${channel} kanalında yavaş mod **kapatıldı**.`;
        color = COLORS.SUCCESS;
    } else {
        const format = saniye < 60
            ? `${saniye} saniye`
            : saniye < 3600
            ? `${Math.floor(saniye / 60)} dakika`
            : `${Math.floor(saniye / 3600)} saat`;

        description = `🐢 ${channel} kanalında yavaş mod **${format}** olarak ayarlandı.`;
        color = COLORS.WARNING;
    }

    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(description)
        .setFooter({ text: `${interaction.user.tag} tarafından` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
