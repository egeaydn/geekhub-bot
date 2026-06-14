import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { COLORS } from '../../config';
import { addWarn } from '../../utils/warns';

export const category = 'moderation';

export const data = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Bir üyeye uyarı verir.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
        opt.setName('kullanici').setDescription('Uyarılacak kullanıcı').setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('sebep').setDescription('Uyarı sebebi').setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guild) {
        await interaction.reply({ content: '❌ Bu komut sunucularda kullanılabilir.', ephemeral: true });
        return;
    }

    const targetUser = interaction.options.getUser('kullanici', true);
    const reason     = interaction.options.getString('sebep', true);

    if (targetUser.id === interaction.user.id) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Kendine uyarı veremezsin.')], ephemeral: true });
        return;
    }

    if (targetUser.bot) {
        await interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Botlara uyarı verilemez.')], ephemeral: true });
        return;
    }

    const totalWarns = addWarn(targetUser.id, reason, interaction.user.tag);

    const embed = new EmbedBuilder()
        .setColor(COLORS.WARNING)
        .setTitle('⚠️ Uyarı Verildi')
        .addFields(
            { name: '👤 Kullanıcı',     value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true  },
            { name: '👮 Moderatör',     value: `${interaction.user.tag}`,                  inline: true  },
            { name: '📝 Sebep',          value: reason,                                     inline: false },
            { name: '📊 Toplam Uyarı',  value: `**${totalWarns}** adet`,                   inline: true  },
        )
        .setThumbnail(targetUser.displayAvatarURL())
        .setTimestamp();

    // 3 veya daha fazla uyarıda otomatik bildirim
    if (totalWarns >= 3) {
        embed.addFields({ name: '🚨 Uyarı', value: `Bu kullanıcının **${totalWarns}** uyarısı var. Moderatörlerin dikkatine!`, inline: false });
        embed.setColor(COLORS.ERROR);
    }

    await interaction.reply({ embeds: [embed] });

    // Kullanıcıya DM göndermeyi dene
    try {
        const dmEmbed = new EmbedBuilder()
            .setColor(COLORS.WARNING)
            .setTitle(`⚠️ ${interaction.guild.name} — Uyarı Aldın`)
            .addFields(
                { name: '📝 Sebep',         value: reason,                   inline: false },
                { name: '📊 Toplam Uyarı',  value: `${totalWarns} adet`,    inline: true  },
            )
            .setTimestamp();

        await targetUser.send({ embeds: [dmEmbed] });
    } catch {
        // DM engelliyse sessizce geç
    }
}
