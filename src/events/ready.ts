import { Client, Events, ActivityType } from 'discord.js';

export const name  = Events.ClientReady;
export const once  = true;

export async function execute(client: Client): Promise<void> {
    if (!client.user) return;

    client.user.setActivity('/help | GeekHub', { type: ActivityType.Watching });

    console.log('─'.repeat(40));
    console.log(`✅  Bot başarıyla çalışıyor!`);
    console.log(`🤖  Kullanıcı  : ${client.user.tag}`);
    console.log(`📊  Sunucu     : ${client.guilds.cache.size} adet`);
    console.log('─'.repeat(40));
}
