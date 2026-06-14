import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextChannel,
    PermissionOverwriteOptions,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'moderation';

export const data = new SlashCommandBuilder()
    .setName('kilitsizle')
    .setDescription('🔓 Kilitli kanalı açar — üyeler tekrar mesaj gönderebilir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const channel = interaction.channel as TextChannel;
    const everyone = interaction.guild?.roles.everyone;

    if (!channel?.isTextBased() || !everyone) {
        await interaction.reply({ content: '❌ Bu komut metin kanallarında çalışır.', ephemeral: true });
        return;
    }

    try {
        await channel.permissionOverwrites.edit(everyone, {
            SendMessages: null, // varsayılana döndür
        } as PermissionOverwriteOptions);
    } catch {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Kanal açılırken hata oluştu.')], ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS)
        .setTitle('🔓 Kanal Açıldı')
        .addFields(
            { name: '📌 Kanal',   value: `${channel}`,          inline: true },
            { name: '👮 Yetkili', value: `${interaction.user}`, inline: true },
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
