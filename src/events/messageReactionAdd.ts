import { MessageReaction, User } from "discord.js";
import update_roles from "src/modules/update-roles";

export default async (messageReaction: MessageReaction, user: User) => {
  if (user.bot) return;
  await update_roles(messageReaction, user);
};
