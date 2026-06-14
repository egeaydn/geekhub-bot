import * as fs   from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { GatewayIntentBits } from 'discord.js';
import { ExtendedClient } from './types/ExtendedClient';
import { Command } from './types/Command';

dotenv.config();

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.GuildMembers, ← Aç: Discord Developer Portal > Bot > Privileged Gateway Intents > SERVER MEMBERS INTENT ✅
    ],
});

// ── Komutları yükle ──────────────────────────────────────────────────────────
const commandsPath = path.join(__dirname, 'commands');
for (const folder of fs.readdirSync(commandsPath)) {
    const folderPath = path.join(commandsPath, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
        const raw = require(path.join(folderPath, file));
        if (!raw.data || !raw.execute) continue;

        const command: Command = {
            data:     raw.data,
            execute:  raw.execute,
            category: raw.category ?? folder,
        };
        client.commands.set(command.data.name, command);
    }
}

// ── Event'leri yükle ─────────────────────────────────────────────────────────
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'))) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args: unknown[]) => event.execute(...args));
    } else {
        client.on(event.name,   (...args: unknown[]) => event.execute(...args));
    }
}

client.login(process.env.DISCORD_TOKEN);
