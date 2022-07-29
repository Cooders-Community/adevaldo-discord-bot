import { GuildMember } from "discord.js";
import config from "src/config";

export default async (member: GuildMember) => {
  if (member.user.bot && config?.masterRolesList?.["bot"]?.id)
    member.roles.add(config?.masterRolesList?.["bot"]?.id);
  else if (config?.masterRolesList?.["membro"]?.id)
    member.roles.add(config?.masterRolesList?.["membro"]?.id);
};
