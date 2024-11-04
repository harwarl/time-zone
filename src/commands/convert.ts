import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createDB } from "../database/connectmongo";
import { convertDateText } from "../functions/convertDateText";

export const data = new SlashCommandBuilder()
  .setName("convert")
  .setDescription(
    "Convert the time in a specified message to your time zone (e.g /convert meeting starts at 2pm UTC)"
  )
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The message containing the time to be converted")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("timezone")
      .setDescription("Time Zone of the author to yours")
      .setRequired(true)
      .setChoices(
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
  const message = interaction.options.get("message");
  const timeZone = interaction.options.get("timezone");

  if (!message) {
    return await interaction.editReply("Please provide a message to convert.");
  }

  if (!timeZone) {
    return await interaction.editReply("Please provide a time zone");
  }

  //get the user and his time zone
  const userId = interaction.user.id;
  const { error, timeZoneDB, mongoClient } = await createDB();

  if (error) {
    await interaction.editReply(
      "Error getting user's timezone, try again, or set your time zone"
    );
  }
  try {
    if (timeZoneDB) {
      const userTimeZone = await timeZoneDB
        .collection("users")
        .findOne({ userId: userId });

      if (userTimeZone === null) {
        await interaction.editReply(
          "Error getting user's timezone, try again, or set your time zone"
        );
      } else {
        const savedTimeZone = userTimeZone?.timeZone;

        const result = await convertDateText(
          message.value as string,
          timeZone?.value as string,
          savedTimeZone
        );

        await interaction.editReply(result ? result : "");
      }
    }
  } catch (error) {
    await interaction.editReply(
      "Error getting user's timezone, try again, or set your time zone"
    );
  } finally {
    await mongoClient?.close();
  }
}
