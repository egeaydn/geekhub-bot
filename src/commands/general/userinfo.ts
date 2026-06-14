import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    GuildMember,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'general';

export const data = new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('👤 Bir kullanıcı hakkında bilgileri gösterir.')
    .addUserOption(opt =>
        opt.setName('kullanici')
           .setDescription('Bilgisini görmek istediğin kullanıcı (boş bırakırsan kendin)')
           .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetUser   = interaction.options.getUser('kullanici') ?? interaction.user;
    const targetMember = interaction.guild?.members.cache.get(targetUser.id) as GuildMember | undefined;

    const createdAt = Math.floor(targetUser.createdTimestamp / 1000);
    const joinedAt  = targetMember?.joinedTimestamp
        ? Math.floor(targetMember.joinedTimestamp / 1000)
        : null;

    // En yüksek renk veren rol
    const topRole = targetMember?.roles.highest?.id !== interaction.guild?.roles.everyone.id
        ? targetMember?.roles.highest
        : null;

    // Roller (@everyone hariç, ilk 10)
    const roles = targetMember?.roles.cache
        .filter(r => r.id !== interaction.guild?.roles.everyone.id)
        .sort((a, b) => b.position - a.position)
        .map(r => `${r}`)
        .slice(0, 10)
        .join(' ') || '`Rol yok`';

    const badges = targetUser.flags?.toArray()
        .map(f => f.replace(/_/g, ' '))
        .join(', ') || 'Yok';

    const embed = new EmbedBuilder()
        .setColor(topRole?.color || COLORS.INFO)
        .setTitle(`👤 ${targetUser.tag}`)
        .setThumbnail(targetUser.displayAvatarURL({ size: 256 }))
        .addFields(
            { name: '🆔 Kullanıcı ID',     value: `\`${targetUser.id}\``,          inline: true  },
            { name: '🤖 Bot mu?',           value: targetUser.bot ? 'Evet' : 'Hayır', inline: true },
            { name: '📅 Hesap Oluşturma',   value: `<t:${createdAt}:D> (<t:${createdAt}:R>)`, inline: false },
        )
        .setFooter({ text: `ID: ${targetUser.id}` })
        .setTimestamp();

    if (joinedAt) {
        embed.addFields({ name: '📥 Sunucuya Katılma', value: `<t:${joinedAt}:D> (<t:${joinedAt}:R>)`, inline: false });
    }
    if (topRole) {
        embed.addFields({ name: '🎭 En Yüksek Rol', value: `${topRole}`, inline: true });
    }

    embed.addFields(
        { name: '🏅 Rozetler', value: badges,  inline: false },
        { name: `🎭 Roller (${targetMember?.roles.cache.size ? targetMember.roles.cache.size - 1 : 0})`, value: roles, inline: false },
    );

    await interaction.reply({ embeds: [embed] });
}
