import { ClientEvents } from "discord.js";
import newsLetters from "src/modules/newsletters";
import sendRolesSkilsMsg from "src/modules/send-roles-skils-msg";

export default async (events: ClientEvents) => {
  newsLetters();
  sendRolesSkilsMsg();
};
