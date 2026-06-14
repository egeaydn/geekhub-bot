import { GuildMember, Events, EmbedBuilder, TextChannel } from 'discord.js';
import { COLORS } from '../config';

export const name = Events.GuildMemberAdd;
export const once = false;

export async function execute(member: GuildMember): Promise<void> {
    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    if (!welcomeChannelId) return;

    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel || !(channel instanceof TextChannel)) return;

    const createdAt = Math.floor(member.user.createdTimestamp / 1000);

    const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('🎉 Yeni Bir Geek Aramıza Katıldı!')
        .setDescription(
            `Hoş geldin ${member}! 👋\n` +
            `**GeekHub** ailesine katıldığın için çok mutluyuz!\n\n` +
            `📌 Kuralları okumayı ve kendini tanıtmayı unutma.`,
        )
        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
        .addFields(
            { name: '👤 Kullanıcı',          value: `${member.user.tag}`,                    inline: true },
            { name: '📅 Hesap Tarihi',        value: `<t:${createdAt}:R>`,                    inline: true },
            { name: '👥 Toplam Üye',          value: `**${member.guild.memberCount}**. üye`,  inline: true },
        )
        .setFooter({ text: 'GeekHub', iconURL: member.guild.iconURL() ?? undefined })
        .setTimestamp();

    await channel.send({ content: `🎊 Hoş geldin ${member}!`, embeds: [embed] });
}
