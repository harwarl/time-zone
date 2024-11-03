import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createDB } from "../database/connectmongo";

export const data = new SlashCommandBuilder()
  .setName("settimezone")
  .setDescription("Sets your preferred time zone for your meetings")
  .addStringOption((option) =>
    option
      .setName("zones")
      .setDescription("The time zone (e.g., GMT-4, America/New_York)")
      .setRequired(true)
      .addChoices(
        { name: "UTC", value: "UTC" },
        { name: "America/New_York", value: "America/New_York" },
        { name: "America/Chicago", value: "America/Chicago" },
        { name: "America/Denver", value: "America/Denver" },
        { name: "America/Los_Angeles", value: "America/Los_Angeles" },
        { name: "Pacific/Honolulu", value: "Pacific/Honolulu" },
        { name: "Europe/London", value: "Europe/London" },
        { name: "Europe/Paris", value: "Europe/Paris" },
        { name: "Europe/Moscow", value: "Europe/Moscow" },
        { name: "Asia/Shanghai", value: "Asia/Shanghai" },
        { name: "Asia/Tokyo", value: "Asia/Tokyo" },
        { name: "Asia/Seoul", value: "Asia/Seoul" },
        { name: "Asia/Hong_Kong", value: "Asia/Hong_Kong" },
        { name: "Australia/Sydney", value: "Australia/Sydney" },
        { name: "Australia/Perth", value: "Australia/Perth" },
        { name: "Pacific/Auckland", value: "Pacific/Auckland" },
        { name: "Pacific/Fiji", value: "Pacific/Fiji" },
        { name: "America/Sao_Paulo", value: "America/Sao_Paulo" },
        { name: "America/Santiago", value: "America/Santiago" },
        { name: "Africa/Lagos", value: "Africa/Lagos" },
        { name: "Africa/Johannesburg", value: "Africa/Johannesburg" },
        { name: "Africa/Nairobi", value: "Africa/Nairobi" },
        { name: "Atlantic/Stanley", value: "Atlantic/Stanley" }
      )
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const { options } = interaction;
  const timeZone = options.get("zones");
  if (!interaction.user || !timeZone) {
    return interaction.reply("Invalid Time Zone");
  }

  if (interaction.user.bot) {
    return interaction.reply("Bots cannot set up time zones");
  }

  const currentUser = interaction.user;
  const timeZoneOption = timeZone.value;

  // Save the user configuration in the database
  const { error, timeZoneDB, mongoClient } = await createDB();

  if (error) {
    console.error(error);
    return interaction.reply("Error setting up db");
  }

  try {
    // Code to check if the user exists and save/update the time zone
    if (timeZoneDB) {
      await timeZoneDB
        .collection("users")
        .updateOne(
          { userId: currentUser.id, username: currentUser.username },
          { $set: { timeZone: timeZoneOption } },
          { upsert: true }
        );
      return interaction.editReply({
        content: `Time Zone ${timeZoneOption} Set for ${currentUser.username}`,
      });
    }
  } catch (dbError) {
    console.error(dbError);
    return interaction.reply("Error saving time zone to the database");
  } finally {
    await mongoClient?.close();
  }
}
