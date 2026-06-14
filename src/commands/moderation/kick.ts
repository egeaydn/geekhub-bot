import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    GuildMember,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'moderation';

export const data = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Bir üyeyi sunucudan atar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt =>
        opt.setName('kullanici').setDescription('Atacağın kullanıcı').setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('sebep').setDescription('Atma sebebi').setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({ content: '❌ Bu komut sunucularda kullanılabilir.', ephemeral: true });
        return;
    }

    const targetUser   = interaction.options.getUser('kullanici', true);
    const reason       = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi.';
    const targetMember = interaction.guild.members.cache.get(targetUser.id) as GuildMember | undefined;

    if (!targetMember) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Bu kullanıcı sunucuda bulunamadı.')], ephemeral: true });
        return;
    }

    if (!targetMember.kickable) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Bu kullanıcıyı atma yetkim yok (rol hiyerarşisi).')], ephemeral: true });
        return;
    }

    if (targetMember.id === interaction.user.id) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Kendini atamazsın.')], ephemeral: true });
        return;
    }

    try {
        await targetMember.kick(`${interaction.user.tag} tarafından: ${reason}`);
    } catch {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Kullanıcı atılırken bir hata oluştu.')], ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.WARNING)
        .setTitle('👢 Kullanıcı Atıldı')
        .addFields(
            { name: '👤 Kullanıcı',   value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true  },
            { name: '👮 Moderatör',   value: `${interaction.user.tag}`,                  inline: true  },
            { name: '📝 Sebep',        value: reason,                                     inline: false },
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
