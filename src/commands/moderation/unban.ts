import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'moderation';

export const data = new SlashCommandBuilder()
    .setName('unban')
    .setDescription('🔓 Yasaklı bir kullanıcıyı serbest bırakır.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(opt =>
        opt.setName('kullanici_id')
           .setDescription('Yasağı kaldırılacak kullanıcının ID\'si')
           .setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('sebep').setDescription('Yasak kaldırma sebebi').setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({ content: '❌ Bu komut sunucularda kullanılabilir.', ephemeral: true });
        return;
    }

    const userId = interaction.options.getString('kullanici_id', true).trim();
    const reason = interaction.options.getString('sebep') ?? 'Sebep belirtilmedi.';

    // ID format kontrolü
    if (!/^\d{17,20}$/.test(userId)) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Geçersiz kullanıcı ID formatı.')], ephemeral: true });
        return;
    }

    let bannedUser;
    try {
        bannedUser = await interaction.guild.bans.fetch(userId);
    } catch {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Bu kullanıcı yasaklı listesinde bulunamadı.')], ephemeral: true });
        return;
    }

    try {
        await interaction.guild.bans.remove(userId, `${interaction.user.tag} tarafından: ${reason}`);
    } catch {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Yasak kaldırılırken bir hata oluştu.')], ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS)
        .setTitle('🔓 Yasak Kaldırıldı')
        .addFields(
            { name: '👤 Kullanıcı',   value: `${bannedUser.user.tag} (\`${userId}\`)`, inline: true  },
            { name: '👮 Moderatör',   value: `${interaction.user.tag}`,                inline: true  },
            { name: '📝 Sebep',        value: reason,                                  inline: false },
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
