import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { createDB } from "../database/connectmongo";

export const data = new SlashCommandBuilder()
  .setName("showtimezone")
  .setDescription("Shows your current set time zone");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  const { error, timeZoneDB, mongoClient } = await createDB();
  try {
    if (error) {
      console.error(error);
      return interaction.editReply("Error getting data");
    }

    if (timeZoneDB) {
      const userRecord = await timeZoneDB.collection("users").findOne({
        userId: interaction.user.id,
      });

      if (userRecord) {
        return interaction.editReply(`Set time zone is ${userRecord.timeZone}`);
      }
      return interaction.editReply("You don't have a set time zone");
    }
  } catch (error) {
    return interaction.editReply("Error getting user details");
  } finally {
    await mongoClient?.close();
  }
}
