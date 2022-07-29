import { Message } from "discord.js";
import { ICommand, IObjectCommand } from "src/models/commands";

const command: IObjectCommand = {
  name: "cleanchannel",
  description: "Descrição do Comando",
};

// Run when bot init
function init(): void {
  console.log({ command });
}

// Run when command writed
async function run(message: Message, content: string): Promise<void> {
  debugger;
  message.channel.send("teste");

  console.log("running", command.name);
  console.log("running", content);
}

// Run when this.run be success
function success(): void {
  console.log("success");
}

// Run when this.run be error
function error(): void {
  console.error("error");
}

export default {
  command,
  run,
  init,
  success,
  error,
} as ICommand;
