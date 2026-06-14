import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'fun';

const RESPONSES = {
    positive: [
        'Kesinlikle evet! ✅',
        'Evet, şüphesiz. ✅',
        'Bana göre evet. ✅',
        'Tahminlerime göre evet. ✅',
        'Buna güvenebilirsin. ✅',
        'İşaretler evet\'e işaret ediyor. ✅',
        'Açık görünüyor, evet! ✅',
    ],
    neutral: [
        'Şu an cevap veremiyorum, tekrar dene. 🔄',
        'Daha sonra sor. 🔄',
        'Şimdi tahmin edemiyorum. 🔄',
        'Cevap belirsiz, tekrar dene. 🔄',
        'Daha iyi soruya odaklan. 🔄',
    ],
    negative: [
        'Bana göre hayır. ❌',
        'Tahminlerime göre hayır. ❌',
        'Pek iyi görünmüyor. ❌',
        'Çok şüpheli. ❌',
        'Hayır. ❌',
        'Cevap kesinlikle hayır. ❌',
        'Öyle görünmüyor. ❌',
    ],
};

export const data = new SlashCommandBuilder()
    .setName('eightball')
    .setDescription('🎱 Sihirli 8 topa bir soru sor, cevabını al!')
    .addStringOption(opt =>
        opt.setName('soru')
           .setDescription('Sormak istediğin soru')
           .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const question = interaction.options.getString('soru', true);

    const rng = Math.random();
    let pool: string[];
    let color: number;

    if (rng < 0.45) {
        pool  = RESPONSES.positive;
        color = COLORS.SUCCESS;
    } else if (rng < 0.70) {
        pool  = RESPONSES.neutral;
        color = COLORS.WARNING;
    } else {
        pool  = RESPONSES.negative;
        color = COLORS.ERROR;
    }

    const answer = pool[Math.floor(Math.random() * pool.length)];

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('🎱 Sihirli 8 Top')
        .addFields(
            { name: '❓ Soru',   value: question, inline: false },
            { name: '🎱 Cevap', value: answer,   inline: false },
        )
        .setFooter({ text: `${interaction.user.tag} sordu` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
