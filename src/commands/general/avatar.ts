import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'general';

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('🖼️ Bir kullanıcının profil fotoğrafını gösterir.')
    .addUserOption(opt =>
        opt.setName('kullanici')
           .setDescription('Avatarını görmek istediğin kullanıcı (boş bırakırsan kendin)')
           .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser('kullanici') ?? interaction.user;

    const avatarUrl = target.displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle(`🖼️ ${target.tag} — Profil Fotoğrafı`)
        .setImage(avatarUrl)
        .addFields(
            { name: '🔗 PNG',  value: `[İndir](${target.displayAvatarURL({ extension: 'png',  size: 1024 })})`, inline: true },
            { name: '🔗 JPG',  value: `[İndir](${target.displayAvatarURL({ extension: 'jpg',  size: 1024 })})`, inline: true },
            { name: '🔗 WEBP', value: `[İndir](${target.displayAvatarURL({ extension: 'webp', size: 1024 })})`, inline: true },
        )
        .setFooter({ text: `ID: ${target.id}` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
