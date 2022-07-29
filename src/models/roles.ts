export type IRoleType = "bot" | "admin" | "member";

export type IRole = {
  emoji?: string;
  tag?: string;
  id: string;
  type: IRoleType | string;
};

export type IMasterRolesList = {
  [roleName: string]: IRole;
};

export type ISkillsRolesList = {
  [skillsCategory: string]: IRole[];
};
