import { Message } from "discord.js";
import { client } from "src";
import { ICommand, IObjectCommand } from "src/models/commands";

const command: IObjectCommand = {
  name: "clearchannel",
  description: "limpa o canal; exemplo: !clearchannel 50",
};

// Run when bot init
function init(): void {}

// Run when command writed
async function run(message: Message, content: string): Promise<void> {
  const limit = (+content > 100 ? 100 : +content) || 100;

  const channel = await client.channels.fetch(message.channel.id);
  if (!channel?.isTextBased()) return;

  const totalMessages = await channel.messages.fetch({ limit });
  if (!totalMessages.size) return;

  totalMessages.forEach(async (message) => {
    await message.delete();
  });
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
