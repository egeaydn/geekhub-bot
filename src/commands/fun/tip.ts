import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { COLORS } from '../../config';

export const category = 'fun';

const TIPS = [
    { title: '🔀 Git',          tip: '`git commit --amend` ile son commit mesajını değiştirebilirsin — push etmemişsen!' },
    { title: '🔀 Git',          tip: '`git stash` ile yarım kalan işi kaydedip başka branch\'e geçebilirsin. `git stash pop` ile geri alırsın.' },
    { title: '⌨️ VS Code',      tip: '`Ctrl + P` ile dosya adı yazarak anında açabilirsin. Mouse\'a gerek yok.' },
    { title: '⌨️ VS Code',      tip: '`Alt + ↑/↓` ile seçili satırı yukarı/aşağı taşıyabilirsin.' },
    { title: '⌨️ VS Code',      tip: '`Ctrl + D` ile aynı kelimeyi tek tek seçip hepsini aynı anda düzenleyebilirsin.' },
    { title: '🔒 Güvenlik',     tip: 'Token ve API key\'lerini asla kod içine yazma. `.env` kullan, `.gitignore`\'a ekle.' },
    { title: '🔒 Güvenlik',     tip: 'Kullanıcıdan gelen veriyi asla doğrudan SQL sorgusuna koyma — parameterized query kullan.' },
    { title: '⚡ Performans',   tip: 'Büyük dizilerde `forEach` yerine `for...of` kullan — çok daha hızlı.' },
    { title: '⚡ Performans',   tip: 'N+1 sorgu problemi: döngü içinde veritabanı sorgusu yapma, hepsini tek seferde çek.' },
    { title: '🧹 Temiz Kod',    tip: '`if (condition) return;` erken çıkış tekniği ile iç içe if blokları azaltılır — "Guard Clause".' },
    { title: '🧹 Temiz Kod',    tip: 'Fonksiyon isimleri ne yaptığını söylemeli: `getData` değil, `fetchUserById` yaz.' },
    { title: '🧹 Temiz Kod',    tip: '300+ satır fonksiyon görürsen dur. Küçük, tek işlevli parçalara böl.' },
    { title: '🐛 Debugging',    tip: '`console.log` yerine `debugger` koymayı dene — tüm değişkenleri canlı izlersin.' },
    { title: '🐛 Debugging',    tip: 'Bir bug\'ı çözemiyorsan biri yokken sesli anlat. Genelde ortada çözümü görürsün. "Rubber duck debugging".' },
    { title: '📦 npm',          tip: '`npm audit` ile bağımlılıklarındaki güvenlik açıklarını görebilirsin.' },
    { title: '📦 npm',          tip: '`npx` ile global kurmadan paket çalıştırabilirsin: `npx create-react-app`.' },
    { title: '🌐 Web',          tip: 'API tasarımında HTTP metodlarını doğru kullan: GET okur, POST ekler, PUT günceller, DELETE siler.' },
    { title: '🌐 Web',          tip: 'Cache-Control header\'ı ile tarayıcı cache\'ini kontrol ederek sayfa hızını dramatik artırırsın.' },
    { title: '🤖 Algoritma',    tip: 'Veri aramadan önce sırala — binary search, linear search\'ten kat kat hızlıdır.' },
    { title: '💾 Veritabanı',   tip: 'Sık sorgulanan sütunlara index ekle. `EXPLAIN` komutuyla sorgu planını görebilirsin.' },
    { title: '🧠 Kariyer',      tip: 'Her gün 1 saat kod yaz. Büyük projeler değil, küçük tutarlı pratik seni geliştirir.' },
    { title: '🧠 Kariyer',      tip: 'Stack Overflow\'a soru sormadan önce hatayı Google\'la. %90 cevap zaten orada.' },
];

export const data = new SlashCommandBuilder()
    .setName('ipucu')
    .setDescription('💡 Rastgele bir programlama ipucu veya trick gösterir.');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)];

    const embed = new EmbedBuilder()
        .setColor(COLORS.INFO)
        .setTitle(`💡 Günün İpucu — ${tip.title}`)
        .setDescription(tip.tip)
        .setFooter({ text: `GeekHub Bot • ${TIPS.indexOf(tip) + 1}/${TIPS.length}` })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
