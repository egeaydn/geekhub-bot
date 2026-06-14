import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { COLORS } from '../../config';
import { getWarns, clearWarns } from '../../utils/warns';

export const category = 'moderation';

export const data = new SlashCommandBuilder()
    .setName('warns')
    .setDescription('📋 Bir kullanıcının uyarı geçmişini gösterir veya temizler.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
        opt.setName('kullanici').setDescription('Uyarılarını görmek istediğin kullanıcı').setRequired(true),
    )
    .addBooleanOption(opt =>
        opt.setName('temizle')
           .setDescription('Uyarıları sıfırlamak için "Evet" seç')
           .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetUser = interaction.options.getUser('kullanici', true);
    const shouldClear = interaction.options.getBoolean('temizle') ?? false;

    if (shouldClear) {
        clearWarns(targetUser.id);
        const embed = new EmbedBuilder()
            .setColor(COLORS.SUCCESS)
            .setDescription(`✅ **${targetUser.tag}** kullanıcısının tüm uyarıları temizlendi.`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        return;
    }

    const warns = getWarns(targetUser.id);

    if (warns.length === 0) {
        const embed = new EmbedBuilder()
            .setColor(COLORS.SUCCESS)
            .setDescription(`✅ **${targetUser.tag}** kullanıcısının hiç uyarısı yok.`)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        return;
    }

    const warnList = warns
        .map((w, i) => {
            const ts = Math.floor(w.timestamp / 1000);
            return `**${i + 1}.** ${w.reason}\n> 👮 ${w.moderator} — <t:${ts}:R>`;
        })
        .join('\n\n');

    const embed = new EmbedBuilder()
        .setColor(COLORS.WARNING)
        .setTitle(`⚠️ ${targetUser.tag} — Uyarı Geçmişi`)
        .setDescription(warnList)
        .addFields({ name: '📊 Toplam', value: `**${warns.length}** uyarı`, inline: true })
        .setThumbnail(targetUser.displayAvatarURL())
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
