import Discord, { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import config from "./config";
import { ICommand } from "./models/commands";

export const client = new Discord.Client({ intents: 32767 });
export const commands = new Collection<string, ICommand>();

const loadCommands = async () => {
  const cmdFiles = fs.readdirSync(path.resolve(__dirname, "commands"));
  await Promise.all(
    cmdFiles.map(async (file) => {
      if (file?.includes("_") || file.includes("index")) return;

      const { default: module } = await import(`./commands/${file}`);

      if (module.init) {
        module.init(client);
      }
      module.command.name && commands.set(module.command.name, module);
    })
  ).then(() =>
    console.log("[#LOG]", `Carregando o total de ${cmdFiles.length} eventos.`)
  );
};

const loadEvents = async () => {
  const evtFiles = fs.readdirSync(path.resolve(__dirname, "events"));

  await Promise.all(
    evtFiles.map(async (file) => {
      const eventName = file.split(".")[0];
      const { default: event } = await import(`./events/${file}`);
      client.on(eventName, event);
    })
  ).then(() =>
    console.log("[#LOG]", `Carregando o total de ${evtFiles.length} eventos.`)
  );
};

(() => {
  loadCommands();
  loadEvents();
  client.on("error", (err) => console.error("[#ERROR]", err));
  client.login(config.bot.token);
})();
