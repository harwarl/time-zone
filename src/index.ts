import { config } from "dotenv";
import { Client, Events, GatewayIntentBits } from "discord.js";

config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
