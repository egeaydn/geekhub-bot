import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    TextChannel,
    ColorResolvable,
} from 'discord.js';
import { COLORS } from '../../config';

export const category = 'moderation';

const COLOR_CHOICES: Record<string, { hex: ColorResolvable; label: string }> = {
    blue:    { hex: 0x5865F2, label: '🔵 Mavi'  },
    green:   { hex: 0x57F287, label: '🟢 Yeşil' },
    red:     { hex: 0xED4245, label: '🔴 Kırmızı' },
    yellow:  { hex: 0xFEE75C, label: '🟡 Sarı'  },
    purple:  { hex: 0x9B59B6, label: '🟣 Mor'   },
    gold:    { hex: 0xF1C40F, label: '🥇 Altın' },
};

export const data = new SlashCommandBuilder()
    .setName('duyuru')
    .setDescription('📢 Güzel bir duyuru embed\'i oluşturur ve yayınlar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
        opt.setName('baslik').setDescription('Duyuru başlığı').setRequired(true),
    )
    .addStringOption(opt =>
        opt.setName('icerik').setDescription('Duyuru içeriği').setRequired(true),
    )
    .addChannelOption(opt =>
        opt.setName('kanal').setDescription('Gönderilecek kanal (boş = mevcut kanal)').setRequired(false),
    )
    .addStringOption(opt =>
        opt.setName('renk')
           .setDescription('Embed rengi')
           .setRequired(false)
           .addChoices(...Object.entries(COLOR_CHOICES).map(([v, { label }]) => ({ name: label, value: v }))),
    )
    .addStringOption(opt =>
        opt.setName('gorsel').setDescription('Büyük görsel URL\'si (isteğe bağlı)').setRequired(false),
    )
    .addStringOption(opt =>
        opt.setName('mention').setDescription('Kim etiketlensin?')
           .setRequired(false)
           .addChoices(
               { name: '@everyone', value: '@everyone' },
               { name: '@here',     value: '@here'     },
               { name: 'Kimse',     value: 'none'      },
           ),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const baslik  = interaction.options.getString('baslik',  true);
    const icerik  = interaction.options.getString('icerik',  true);
    const renk    = interaction.options.getString('renk')    ?? 'blue';
    const gorsel  = interaction.options.getString('gorsel');
    const mention = interaction.options.getString('mention') ?? 'none';
    const kanal   = (interaction.options.getChannel('kanal') ?? interaction.channel) as TextChannel;

    if (!kanal?.isTextBased()) {
        await interaction.reply({ content: '❌ Geçerli bir metin kanalı seç.', ephemeral: true });
        return;
    }

    const color = COLOR_CHOICES[renk]?.hex ?? COLORS.PRIMARY;

    const embed = new EmbedBuilder()
        .setColor(color as ColorResolvable)
        .setTitle(`📢 ${baslik}`)
        .setDescription(icerik)
        .setAuthor({
            name:    interaction.guild?.name ?? 'GeekHub',
            iconURL: interaction.guild?.iconURL() ?? undefined,
        })
        .setFooter({ text: `${interaction.user.tag} tarafından`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

    if (gorsel) embed.setImage(gorsel);

    const content = mention !== 'none' ? mention : undefined;

    await kanal.send({ content, embeds: [embed] });
    await interaction.reply({ content: `✅ Duyuru ${kanal} kanalına gönderildi!`, ephemeral: true });
}
