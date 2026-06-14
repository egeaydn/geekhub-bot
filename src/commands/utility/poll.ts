import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    Message,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'utility';

const EMOJI_MAP = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

export const data = new SlashCommandBuilder()
    .setName('anket')
    .setDescription('📊 Reaksiyon tabanlı anket oluşturur.')
    .addStringOption(opt =>
        opt.setName('soru').setDescription('Anket sorusu').setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('secenek1').setDescription('1. seçenek').setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('secenek2').setDescription('2. seçenek').setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('secenek3').setDescription('3. seçenek (isteğe bağlı)').setRequired(false),
    )
    .addStringOption(opt =>
        opt.setName('secenek4').setDescription('4. seçenek (isteğe bağlı)').setRequired(false),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const soru = interaction.options.getString('soru', true);

    const secenekler = [
        interaction.options.getString('secenek1', true),
        interaction.options.getString('secenek2', true),
        interaction.options.getString('secenek3'),
        interaction.options.getString('secenek4'),
    ].filter((s): s is string => s !== null);

    const optionLines = secenekler
        .map((s, i) => `${EMOJI_MAP[i]} ${s}`)
        .join('\n\n');

    const embed = new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTitle('📊 Anket')
        .addFields(
            { name: '❓ Soru',     value: soru,        inline: false },
            { name: '🗳️ Seçenekler', value: optionLines, inline: false },
        )
        .setFooter({ text: `${interaction.user.tag} tarafından oluşturuldu` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Reaksiyonları sırayla ekle
    const msg = await interaction.fetchReply() as Message;
    for (let i = 0; i < secenekler.length; i++) {
        await msg.react(EMOJI_MAP[i]);
    }
}
