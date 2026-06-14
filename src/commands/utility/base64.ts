import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'utility';

export const data = new SlashCommandBuilder()
    .setName('base64')
    .setDescription('🔐 Metni Base64\'e çevirir veya Base64\'ü çözer.')
    .addStringOption(opt =>
        opt.setName('islem')
           .setDescription('Yapılacak işlem')
           .setRequired(true)
           .addChoices(
               { name: '🔒 Şifrele (Metin → Base64)', value: 'encode' },
               { name: '🔓 Çöz (Base64 → Metin)',    value: 'decode' },
           ),
    )
    .addStringOption(opt =>
        opt.setName('metin').setDescription('İşlenecek metin').setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const islem = interaction.options.getString('islem', true) as 'encode' | 'decode';
    const metin = interaction.options.getString('metin', true);

    let sonuc: string;
    let baslik: string;

    try {
        if (islem === 'encode') {
            sonuc  = Buffer.from(metin, 'utf-8').toString('base64');
            baslik = '🔒 Base64 Şifreleme';
        } else {
            // Base64 geçerliliğini kontrol et
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(metin)) {
                await interaction.reply({
                    embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Geçersiz Base64 formatı.')],
                    ephemeral: true,
                });
                return;
            }
            sonuc  = Buffer.from(metin, 'base64').toString('utf-8');
            baslik = '🔓 Base64 Çözme';
        }
    } catch {
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ İşlem sırasında bir hata oluştu.')],
            ephemeral: true,
        });
        return;
    }

    // 1024 karakter Discord embed limiti
    const displaySonuc = sonuc.length > 1000 ? sonuc.substring(0, 997) + '...' : sonuc;

    const embed = new EmbedBuilder()
        .setColor(COLORS.INFO)
        .setTitle(baslik)
        .addFields(
            { name: '📥 Girdi',  value: `\`\`\`${metin.length > 200 ? metin.substring(0, 197) + '...' : metin}\`\`\``,  inline: false },
            { name: '📤 Çıktı',  value: `\`\`\`${displaySonuc}\`\`\``, inline: false },
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
