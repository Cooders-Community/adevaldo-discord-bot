import * as dotenv from "dotenv";
import * as masterRolesConfig from "src/constants/masterRoles.json";
import * as skillsRolesConfig from "src/constants/skillsRoles.json";
import { IMasterRolesList, ISkillsRolesList } from "src/models/roles";

dotenv.config();

export const bot = {
  id: process.env.BOT_ID || "",
  token: process.env.BOT_TOKEN || "",
  guidId: process.env.GUILD_ID || "",
};

export let messagesId: string[] = [];

const masterRolesList: IMasterRolesList = masterRolesConfig;
const skillsRoles: ISkillsRolesList = skillsRolesConfig;

export default {
  bot,
  messagesId,
  masterRolesList,
  skillsRoles,
};
