import { config } from "dotenv";
import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { config as BOTCONFIG } from "./config/config";
import { deployCommands } from "./deploy-command";
import { commands } from "./commands";
config();

export const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.once("ready", () => {
  console.log("👽 Discord bot is ready!");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;

  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(BOTCONFIG.DISCORD_TOKEN);
