import { config } from "dotenv";
import { Client, Events } from "discord.js";
import { config as BOTCONFIG } from "./config/config";
import { deployCommands } from "./deploy-command";
import { commands } from "./commands";
import { createDB } from "./database/connectmongo";
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

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const dateRegex = /\b(\d{1,2}(?:am|pm))(?: (\d{1,2}\/\d{1,2}\/\d{4}))?\b/gi;

  if (dateRegex.test(message.content)) {
    const { error, timeZoneDB, mongoClient } = await createDB();

    if (error) {
      await message.channel.send(
        "Error getting user's timezone, try again, or set your time zone"
      );
    }

    try {
      if (timeZoneDB) {
        const userTimeZone = await timeZoneDB
          .collection("users")
          .findOne({ userId: message.author.id });

        if (userTimeZone === null) {
          await message.channel.send(
            "Error getting user's timezone, try again, or set your time zone"
          );
        } else {
          const savedTimeZone = userTimeZone?.timeZone;

          message.channel.send({
            content: `React with 📅 or use "/convert <message> FROM Time Zone: ${savedTimeZone}" to get this time in your time zone.`,
          });
        }
      }
    } catch (error) {
      await message.channel.send(
        "Error getting user's timezone, try again, or set your time zone"
      );
    } finally {
      await mongoClient?.close();
    }
  }
});

client.login(BOTCONFIG.DISCORD_TOKEN);
