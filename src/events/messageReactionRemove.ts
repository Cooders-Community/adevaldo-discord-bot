import { MessageReaction, User } from "discord.js";
import update_roles from "../modules/update_roles";

export default async (messageReaction: MessageReaction, user: User) => {
  if (user.bot) return;
  else {
    update_roles(messageReaction, user)
  }
};
