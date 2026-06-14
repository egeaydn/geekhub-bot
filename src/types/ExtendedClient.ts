import { Client, Collection, ClientOptions } from 'discord.js';
import { Command } from './Command';

export class ExtendedClient extends Client {
    commands: Collection<string, Command>;

    constructor(options: ClientOptions) {
        super(options);
        this.commands = new Collection();
    }
}
