import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("echo")
  .setDescription("Replies with your input")
  .addSubcommand((subCommand) =>
    subCommand
      .setName("louder")
      .setDescription("gets A louder")
      .addUserOption((option) =>
        option.setName("target").setDescription("The user")
      )
  )
  .addSubcommand((subCommand) =>
    subCommand
      .setName("quiet")
      .setDescription("makes the echo quiet")
      .addUserOption((option) =>
        option.setName("target").setDescription("The user")
      )
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.reply({ content: "Echo!!!", ephemeral: true });
  //   setTimeout(async () => {
  //     await interaction.editReply({ content: "Echo Again !!!" });
  //   }, 2000);
  //   await interaction.followUp({ content: "Echo Again!!!", ephemeral: true });
  //   await interaction.deleteReply();
  await interaction.followUp({ content: interaction.locale });
}
