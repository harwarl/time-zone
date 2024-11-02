import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createDB } from "../database/connectmongo";

export const data = new SlashCommandBuilder()
  .setName("settimezone")
  .setDescription("Sets your preferred time zone for your meetings")
  .addStringOption((option) =>
    option
      .setName("zones")
      .setDescription("the time Zones")
      .setRequired(true)
      .addChoices(
        { name: "GMT-12", value: "GMT-12" },
        { name: "GMT-11", value: "GMT-11" },
        { name: "GMT-10", value: "GMT-10" },
        { name: "GMT-9", value: "GMT-9" },
        { name: "GMT-8", value: "GMT-8" },
        { name: "GMT-7", value: "GMT-7" },
        { name: "GMT-6", value: "GMT-6" },
        { name: "GMT-5", value: "GMT-5" },
        { name: "GMT-4", value: "GMT-4" },
        { name: "GMT-3", value: "GMT-3" },
        { name: "GMT-2", value: "GMT-2" },
        { name: "GMT-1", value: "GMT-1" },
        { name: "GMT+0", value: "GMT+0" },
        { name: "GMT+1", value: "GMT+1" },
        { name: "GMT+2", value: "GMT+2" },
        { name: "GMT+3", value: "GMT+3" },
        { name: "GMT+4", value: "GMT+4" },
        { name: "GMT+5", value: "GMT+5" },
        { name: "GMT+6", value: "GMT+6" },
        { name: "GMT+7", value: "GMT+7" },
        { name: "GMT+8", value: "GMT+8" },
        { name: "GMT+9", value: "GMT+9" },
        { name: "GMT+10", value: "GMT+10" },
        { name: "America/New_York", value: "America/New_York" },
        { name: "Europe/London", value: "Europe/London" }
      )
  );

export async function execute(interaction: CommandInteraction) {
  if (!interaction.user || interaction.options.data.length < 0) {
    return interaction.reply("could not save time zone");
  }

  if (interaction.user.bot) {
    return interaction.reply("Bots can set up time zones");
  }

  //save the user configuration in the database
  //Check if user is in the database
  const { error, timeZoneDB, mongoClient } = await createDB();
  if (error) {
    console.log(error);
    return interaction.reply("Error setting up db");
  }

  return interaction.reply("Time Zone Set");
}
