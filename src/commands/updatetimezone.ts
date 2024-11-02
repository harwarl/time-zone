import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("updatetimezone")
  .setDescription("Updates your current time zone");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Updated your time zone");
}
