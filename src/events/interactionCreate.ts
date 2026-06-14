import { Interaction, Events, EmbedBuilder } from 'discord.js';
import { ExtendedClient } from '../types/ExtendedClient';
import { COLORS } from '../config';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const client  = interaction.client as ExtendedClient;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        await interaction.reply({
            embeds: [new EmbedBuilder().setColor(COLORS.ERROR).setDescription('❌ Bu komut bulunamadı!')],
            ephemeral: true,
        });
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`[HATA] Komut: /${interaction.commandName}`, error);

        const errorEmbed = new EmbedBuilder()
            .setColor(COLORS.ERROR)
            .setDescription('❌ Komut çalıştırılırken bir hata oluştu. Lütfen tekrar dene!');

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
}
