import { MessageReaction, User } from "discord.js";
import config from "src/config";

import { moduleConfig } from "./send-roles-skils-msg";

export default async (messageReaction: MessageReaction, user: User) => {
  if (
    (!messageReaction && !user) ||
    user.bot ||
    messageReaction.message.channelId !== moduleConfig.channelId
  )
    return;
  const { message } = await messageReaction.fetch();
  const messageData = message.embeds[0].data;
  const emoji = messageReaction.emoji.name;

  if (messageData.title) {
    const role = config.skillsRoles[messageData.title].find(
      (role) => role.emoji === emoji
    );

    const guild = messageReaction?.message?.guild;

    if (!role || !guild) return;
    const asMember = await guild?.members.fetch(user.id);

    const currentRole = await guild?.roles.fetch(role.id, { force: true });

    const hasRole = currentRole?.members.filter((member) =>
      member.user.id.includes(user.id)
    )?.size;

    hasRole
      ? await asMember.roles.remove(role.id)
      : await asMember.roles.add(role.id);
  }
};
