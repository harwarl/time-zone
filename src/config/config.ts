import dotenv from "dotenv";

dotenv.config();

const { DISCORD_CLIENT_ID, DISCORD_TOKEN } = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_TOKEN) {
  throw new Error("Missing Environment Variables");
}

export const config: Record<string, string> = {
  DISCORD_CLIENT_ID,
  DISCORD_TOKEN,
};
