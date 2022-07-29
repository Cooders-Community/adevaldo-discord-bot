import { ClientEvents } from "discord.js";
import newsLetters from "src/modules/newsletters";

export default async (events: ClientEvents) => {
  console.warn("[#LOG]", `Bot is aready!`);
  newsLetters();
};
