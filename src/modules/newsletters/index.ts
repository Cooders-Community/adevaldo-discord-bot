import fs from "fs";
import cron from "node-cron";
import path from "path";

export default async () => {
  const evtFiles = fs.readdirSync(path.resolve(__dirname, "./"));

  await Promise.all(
    evtFiles.map(async (file) => {
      try {
        const moduleName: string = file.split(".")[0];
        if (moduleName === "index") return;

        const { default: moduleInit, moduleConfig } = await import(`./${file}`);

        if (!moduleConfig)
          throw new Error(`[${moduleName}] Module config not found`);

        const valid = cron.validate(moduleConfig.cronSchedule);

        if (!valid)
          throw new Error(
            `Invalid CronExpression ${moduleConfig.cronSchedule} to ${moduleName}`
          );

        cron.schedule(moduleConfig.cronSchedule, moduleInit, {
          scheduled: true,
          timezone: "America/Sao_Paulo",
        });

        console.log(
          "[#LOG]",
          `Cron Connected in ${moduleName} module, at ${moduleConfig.cronSchedule}`
        );
      } catch (error) {
        console.error("[#ERROR]", error);
      }
    })
  )
    .then(() =>
      console.log("[#LOG]", `Carregando o total de ${evtFiles.length} modulos.`)
    )
    .catch((err) => console.error("[#ERRO]", `${err}`));
};
