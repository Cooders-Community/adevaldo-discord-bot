import { ClientEvents } from "discord.js";
import newsLetters from "src/modules/newsletters";
import welcome_message from "src/modules/welcome_message";

export default async (events: ClientEvents) => {
  console.warn("[#LOG]", `Bot is aready!`);
  newsLetters();
  welcome_message();
};
