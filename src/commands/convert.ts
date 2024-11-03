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
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const message = interaction.options.get("message");

  if (!message) {
    return await interaction.editReply("Please provide a message to convert.");
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
          savedTimeZone
        );

        console.log({ result });

        await interaction.editReply(result ? result : "");
      }
    }
  } catch (error) {
    await interaction.editReply(
      "Error getting user's timezone, try again, or set your time zone"
    );
  } finally {
    mongoClient?.close();
  }
}
