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
    .setName('kilitle')
    .setDescription('🔒 Kanalı kilitler — üyeler mesaj gönderemez.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(opt =>
        opt.setName('sebep').setDescription('Kilitleme sebebi').setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const reason  = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi.';
    const channel = interaction.channel as TextChannel;
    const everyone = interaction.guild?.roles.everyone;

    if (!channel?.isTextBased() || !everyone) {
        await interaction.reply({ content: '❌ Bu komut metin kanallarında çalışır.', ephemeral: true });
        return;
    }

    const override = channel.permissionOverwrites.cache.get(everyone.id);
    if (override?.deny.has(PermissionFlagsBits.SendMessages)) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.WARNING).setDescription('⚠️ Bu kanal zaten kilitli!')], ephemeral: true });
        return;
    }

    try {
        await channel.permissionOverwrites.edit(everyone, {
            SendMessages: false,
        } as PermissionOverwriteOptions);
    } catch {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Kanal kilitlenirken hata oluştu.')], ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.ERROR)
        .setTitle('🔒 Kanal Kilitlendi')
        .addFields(
            { name: '📌 Kanal',    value: `${channel}`,           inline: true  },
            { name: '👮 Yetkili',  value: `${interaction.user}`,  inline: true  },
            { name: '📝 Sebep',    value: reason,                 inline: false },
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
