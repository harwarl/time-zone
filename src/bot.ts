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

  if (!interaction.isChatInputCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  } else {
    console.error(`No command matching ${interaction.commandName} was found`);
    return;
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const dateRegex = /\b(\d{1,2}(?:am|pm))(?: (\d{1,2}\/\d{1,2}\/\d{4}))?\b/gi;

  if (dateRegex.test(message.content)) {
    message.channel.send({
      content:
        "React with 📅 or use `/convert <message>` to get this time in your time zone.",
    });
  }
});

client.login(BOTCONFIG.DISCORD_TOKEN);
