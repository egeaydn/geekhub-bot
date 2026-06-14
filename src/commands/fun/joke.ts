import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'fun';

const JOKES = [
    { setup: 'Bir programcı eşine dedi ki: "Market\'e git, bir ekmek al. Eğer yumurta varsa altı tane al."', punchline: 'Eşi altı ekmekle döndü. Çünkü yumurta vardı.' },
    { setup: 'Neden programcılar karanlıktan korkmaz?', punchline: 'Çünkü karanlık modda çalışırlar.' },
    { setup: 'Java ve JavaScript arasındaki fark nedir?', punchline: 'Ham ile hamburger arasındaki fark gibi.' },
    { setup: 'Bir frontend developer ile backend developer barışmak istedi.', punchline: 'CORS engelledi.' },
    { setup: 'Hayatta iki zor şey vardır:', punchline: 'Cache invalidation ve şeyleri isimlendirme.' },
    { setup: 'Git commit -m "son düzeltme"', punchline: 'Tüm programcıların yalan söylediği an.' },
    { setup: 'CSS bir problem mi?', punchline: 'Hayır, CSS zaten sorundur.' },
    { setup: 'Bir yazılımcı neden sürekli pencereden bakar?', punchline: 'Windows sevmez, ama bakmadan duramaz.' },
    { setup: '"Neredeyse bitti" yazılımcı sözlüğünde ne anlama gelir?', punchline: 'Daha yeni başladım.' },
    { setup: 'Python\'da boşluk neden önemlidir?', punchline: 'Tıpkı dişçide olduğu gibi: küçük bir boşluk büyük acıya neden olur.' },
    { setup: 'Yazılımcının en büyük korkusu nedir?', punchline: 'Production\'da test etmek zorunda kalmak.' },
    { setup: '404 nedir?', punchline: 'Bu şakanın geri kalanı bulunamadı.' },
    { setup: 'Recursion nedir?', punchline: 'Recursion\'u anlamak için önce Recursion\'ı anlamak gerekir.' },
    { setup: 'Bir programcı neden iyi bir boksör olur?', punchline: 'Çünkü bug fix yaparken sürekli döngüye giriyor.' },
    { setup: 'NULL ile nikâh kıyılır mı?', punchline: 'Hayır, çünkü NULL hiçbir şeyle birleşemez.' },
];

export const data = new SlashCommandBuilder()
    .setName('joke')
    .setDescription('😂 Rastgele bir programcı şakası söyler.');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];

    const embed = new EmbedBuilder()
        .setColor(COLORS.FUN)
        .setTitle('😂 Programcı Şakası')
        .addFields(
            { name: '🙋 Soru', value: joke.setup,      inline: false },
            { name: '😄 Cevap', value: joke.punchline, inline: false },
        )
        .setFooter({ text: 'GeekHub Bot', iconURL: interaction.client.user?.displayAvatarURL() })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
