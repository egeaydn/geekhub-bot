import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    ChannelType,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'general';

export const data = new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('📊 Sunucu hakkında detaylı bilgileri gösterir.');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const guild = interaction.guild;
    if (!guild) {
        await interaction.reply({ content: '❌ Bu komut sadece sunucularda kullanılabilir.', ephemeral: true });
        return;
    }

    await guild.fetch();

    const owner          = await guild.fetchOwner();
    const totalChannels  = guild.channels.cache.size;
    const textChannels   = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels  = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
    const roleCount      = guild.roles.cache.size - 1; // @everyone hariç
    const emojiCount     = guild.emojis.cache.size;
    const boostLevel     = guild.premiumTier;
    const boostCount     = guild.premiumSubscriptionCount ?? 0;
    const createdAt      = Math.floor(guild.createdTimestamp / 1000);

    const verificationLabels: Record<number, string> = {
        0: 'Yok',
        1: 'Düşük',
        2: 'Orta',
        3: 'Yüksek',
        4: 'En Yüksek',
    };

    const embed = new EmbedBuilder()
        .setColor(COLORS.INFO)
        .setTitle(`📊 ${guild.name}`)
        .setThumbnail(guild.iconURL({ size: 256 }) ?? null)
        .addFields(
            { name: '👑 Sunucu Sahibi',  value: `${owner.user.tag}`,                    inline: true  },
            { name: '🆔 Sunucu ID',       value: `\`${guild.id}\``,                      inline: true  },
            { name: '📅 Kuruluş Tarihi',  value: `<t:${createdAt}:D> (<t:${createdAt}:R>)`, inline: false },
            { name: '👥 Üye Sayısı',      value: `${guild.memberCount}`,                 inline: true  },
            { name: '💬 Kanal Sayısı',    value: `${totalChannels} (💬 ${textChannels} · 🔊 ${voiceChannels})`, inline: true },
            { name: '🎭 Rol Sayısı',      value: `${roleCount}`,                         inline: true  },
            { name: '😄 Emoji Sayısı',    value: `${emojiCount}`,                        inline: true  },
            { name: '🚀 Boost Seviyesi',  value: `Seviye ${boostLevel} (${boostCount} boost)`,   inline: true  },
            { name: '🔒 Doğrulama',       value: verificationLabels[guild.verificationLevel] ?? 'Bilinmiyor', inline: true },
        )
        .setFooter({ text: `ID: ${guild.id}` })
        .setTimestamp();

    if (guild.bannerURL()) embed.setImage(guild.bannerURL({ size: 1024 }) ?? null);

    await interaction.reply({ embeds: [embed] });
}
