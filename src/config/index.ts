import * as dotenv from "dotenv";
import * as masterRolesConfig from "src/constants/masterRoles.json";
import * as newsLetterConfig from "src/constants/newsLetter.json";
import * as skillsRolesConfig from "src/constants/skillsRoles.json";
import { INewsLetterList } from "src/models/newsLetters";
import { IMasterRolesList, ISkillsRolesList } from "src/models/roles";

dotenv.config();

export const bot = {
  id: process.env.BOT_ID || "",
  token: process.env.BOT_TOKEN || "",
  guidId: process.env.GUILD_ID || "",
};

export let messagesId: string[] = [];

const newsLetterList: INewsLetterList = newsLetterConfig;
const masterRolesList: IMasterRolesList = masterRolesConfig;
const skillsRoles: ISkillsRolesList = skillsRolesConfig;

export default {
  bot,
  messagesId,
  newsLetterList,
  masterRolesList,
  skillsRoles,
};
