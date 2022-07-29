import { ICommand, IObjectCommand } from "src/models/commands";

const command: IObjectCommand = {
  name: "nome do comando",
  description: "Descrição do Comando",
};

// Run when bot init
function init(): void {
  console.log({ command });
}

// Run when command writed
async function run(): Promise<void> {
  console.log("running", command.name);
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
