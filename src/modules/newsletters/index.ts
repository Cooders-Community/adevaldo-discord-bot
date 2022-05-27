import fs from "fs";
import cron from "node-cron";
import path from "path";
import config from "../../config/index";

export default async () => {
  const evtFiles = fs.readdirSync(path.resolve(__dirname, "./"));

  await Promise.all(
    evtFiles.map(async (file) => {
      const moduleName: string = file.split(".")[0];
      const configModule = config.newsLetterList[moduleName];

      if (configModule) {
        const valid = cron.validate(configModule.cronSchedule);
        if (!valid)
          throw new Error(
            `Invalid CronExpression ${configModule.cronSchedule} to ${moduleName}`
          );

        try {
          const { default: moduleInit } = await import(`./${file}`);
          cron
            .schedule(configModule.cronSchedule, moduleInit, {
              recoverMissedExecutions: true,
              scheduled: true,
              timezone: "America/Sao_Paulo"
            })
            .on("connection", () =>
            console.warn("[#WARN]", `seddings ${moduleName} module`)
          );
          console.log("[#LOG]", `Cron Connected in ${moduleName} module, at ${configModule.cronSchedule}`)
        } catch (error) {
          console.error("[#ERROR]", error);
        }
      }
    })
  ).then(() =>
    console.log("[#LOG]", `Carregando o total de ${evtFiles.length} modulos.`)
  ).catch((err)=> console.error("[#ERRO]", `${err}`))
};
