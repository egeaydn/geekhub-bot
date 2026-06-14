import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextChannel,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'moderation';

export const data = new SlashCommandBuilder()
    .setName('clear')
    .setDescription('🗑️ Belirtilen sayıda mesajı toplu olarak siler.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(opt =>
        opt.setName('adet')
           .setDescription('Silinecek mesaj sayısı (1–100)')
           .setMinValue(1)
           .setMaxValue(100)
           .setRequired(true),
    )
    .addUserOption(opt =>
        opt.setName('kullanici')
           .setDescription('Sadece bu kişinin mesajlarını sil (isteğe bağlı)')
           .setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const amount     = interaction.options.getInteger('adet', true);
    const filterUser = interaction.options.getUser('kullanici');
    const channel    = interaction.channel as TextChannel | null;

    if (!channel) {
        await interaction.reply({ content: '❌ Kanal bulunamadı.', ephemeral: true });
        return;
    }

    await interaction.deferReply({ ephemeral: true });

    // Mesajları çek
    const messages = await channel.messages.fetch({ limit: 100 });
    const toDelete = filterUser
        ? messages.filter(m => m.author.id === filterUser.id).first(amount)
        : [...messages.values()].slice(0, amount);

    if (toDelete.length === 0) {
        await interaction.editReply({ content: '❌ Silinecek mesaj bulunamadı.' });
        return;
    }

    let deleted = 0;
    try {
        const result = await channel.bulkDelete(toDelete, true); // true = 14 günden eski mesajları atla
        deleted = result.size;
    } catch {
        await interaction.editReply({ content: '❌ Mesajlar silinirken bir hata oluştu.' });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(COLORS.SUCCESS)
        .setDescription(
            `🗑️ **${deleted}** mesaj silindi.` +
            (filterUser ? ` (${filterUser.tag} tarafından gönderilmiş)` : ''),
        )
        .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
}
