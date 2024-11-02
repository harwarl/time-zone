import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("showtimezone")
  .setDescription("Shows your current set time zone");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Current Time zone");
}
