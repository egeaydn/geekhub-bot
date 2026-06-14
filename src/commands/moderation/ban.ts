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
    .setName('ban')
    .setDescription('🔨 Bir üyeyi sunucudan yasaklar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt =>
        opt.setName('kullanici').setDescription('Yasaklayacağın kullanıcı').setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('sebep').setDescription('Yasaklama sebebi').setRequired(false),
    )
    .addIntegerOption(opt =>
        opt.setName('mesaj_sil')
           .setDescription('Son kaç günlük mesajları silinsin? (0–7)')
           .setMinValue(0)
           .setMaxValue(7)
           .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({ content: '❌ Bu komut sunucularda kullanılabilir.', ephemeral: true });
        return;
    }

    const targetUser   = interaction.options.getUser('kullanici', true);
    const reason       = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi.';
    const deleteDays   = interaction.options.getInteger('mesaj_sil') ?? 0;
    const targetMember = interaction.guild.members.cache.get(targetUser.id) as GuildMember | undefined;

    if (targetMember && !targetMember.bannable) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Bu kullanıcıyı yasaklama yetkim yok.')], ephemeral: true });
        return;
    }

    if (targetUser.id === interaction.user.id) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Kendini yasaklayamazsın.')], ephemeral: true });
        return;
    }

    try {
        await interaction.guild.bans.create(targetUser.id, {
            reason:                  `${interaction.user.tag} tarafından: ${reason}`,
            deleteMessageSeconds:    deleteDays * 86400,
        });
    } catch {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Kullanıcı yasaklanırken bir hata oluştu.')], ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.ERROR)
        .setTitle('🔨 Kullanıcı Yasaklandı')
        .addFields(
            { name: '👤 Kullanıcı',     value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true  },
            { name: '👮 Moderatör',     value: `${interaction.user.tag}`,                  inline: true  },
            { name: '📝 Sebep',          value: reason,                                     inline: false },
            { name: '🗑️ Mesaj Silme',   value: `Son ${deleteDays} gün`,                    inline: true  },
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
