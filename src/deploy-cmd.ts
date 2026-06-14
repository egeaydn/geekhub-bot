import * as fs   from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

dotenv.config();

// ── Tüm komutları otomatik yükle ─────────────────────────────────────────────
const commandsPath = path.join(__dirname, 'commands');
const commands: ReturnType<SlashCommandBuilder['toJSON']>[] = [];

for (const folder of fs.readdirSync(commandsPath)) {
    const folderPath = path.join(commandsPath, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
        const raw = require(path.join(folderPath, file));
        if (raw.data?.toJSON) {
            commands.push(raw.data.toJSON());
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
    try {
        console.log(`📡 ${commands.length} slash komutu Discord API'sine kaydediliyor...`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { body: commands },
        );

        console.log(`✅ ${commands.length} komut başarıyla kaydedildi!`);
        commands.forEach(c => console.log(`   /${c.name}`));
    } catch (error) {
        console.error('❌ Komutlar kaydedilirken hata:', error);
    }
})();
