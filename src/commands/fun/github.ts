import * as https from 'https';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'fun';

interface GitHubUser {
    login:       string;
    name:        string | null;
    avatar_url:  string;
    html_url:    string;
    bio:         string | null;
    company:     string | null;
    location:    string | null;
    blog:        string | null;
    public_repos:     number;
    public_gists:     number;
    followers:        number;
    following:        number;
    created_at:       string;
    message?:         string; // hata durumunda
}

function fetchGitHub(username: string): Promise<GitHubUser> {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path:     `/users/${encodeURIComponent(username)}`,
            method:   'GET',
            headers:  { 'User-Agent': 'GeekHub-Bot' },
        };

        const req = https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk: string) => (data += chunk));
            res.on('end', () => {
                try { resolve(JSON.parse(data) as GitHubUser); }
                catch { reject(new Error('Geçersiz yanıt')); }
            });
        });

        req.on('error', reject);
        req.setTimeout(8000, () => { req.destroy(); reject(new Error('Zaman aşımı')); });
    });
}

export const data = new SlashCommandBuilder()
    .setName('github')
    .setDescription('🐙 Bir GitHub kullanıcısının profilini gösterir.')
    .addStringOption(opt =>
        opt.setName('kullanici')
           .setDescription('GitHub kullanıcı adı')
           .setRequired(true),
    );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const username = interaction.options.getString('kullanici', true).trim();

    await interaction.deferReply();

    let user: GitHubUser;
    try {
        user = await fetchGitHub(username);
    } catch {
        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ GitHub API\'sine ulaşılamadı.')] });
        return;
    }

    if (user.message === 'Not Found') {
        await interaction.editReply({ embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription(`❌ **${username}** adlı GitHub kullanıcısı bulunamadı.`)] });
        return;
    }

    const createdAt = Math.floor(new Date(user.created_at).getTime() / 1000);

    const embed = new EmbedBuilder()
        .setColor(0x24292e) // GitHub siyahı
        .setAuthor({ name: `${user.login} — GitHub Profili`, iconURL: user.avatar_url, url: user.html_url })
        .setThumbnail(user.avatar_url)
        .setTitle(user.name ?? user.login)
        .setURL(user.html_url)
        .addFields(
            { name: '📦 Repo',      value: `**${user.public_repos}**`,  inline: true },
            { name: '👥 Takipçi',   value: `**${user.followers}**`,     inline: true },
            { name: '👣 Takip',     value: `**${user.following}**`,     inline: true },
            { name: '📅 Üyelik',    value: `<t:${createdAt}:D>`,        inline: true },
        )
        .setFooter({ text: 'GitHub', iconURL: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' })
        .setTimestamp();

    if (user.bio)      embed.setDescription(user.bio);
    if (user.company)  embed.addFields({ name: '🏢 Şirket',   value: user.company,  inline: true });
    if (user.location) embed.addFields({ name: '📍 Konum',    value: user.location, inline: true });
    if (user.blog)     embed.addFields({ name: '🌐 Website',  value: user.blog,     inline: true });

    await interaction.editReply({ embeds: [embed] });
}
