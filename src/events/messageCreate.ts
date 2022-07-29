import { Message } from "discord.js";
import { commands } from "src";
import config from "src/config";

export default async (message: Message) => {
  try {
    debugger;
    if (message.author.bot) {
      if (message.content.startsWith(`${config.prefix}`)) {
        throw new Error("A bot attembled to run a command.");
      }
      return;
    }

    console.log(config.prefix);
    console.log(
      message.content.toLocaleLowerCase().startsWith(`${config.prefix}`)
    );
    if (!message.content.toLocaleLowerCase().startsWith(`${config.prefix}`))
      return;

    const args = message.content
      .slice(1)
      .trim()
      .split(" ")
      .shift()
      ?.toLocaleLowerCase();

    const content = message.content.slice(1).trim().split(" ");

    const command = commands.get(`${args}`);

    if (!command) {
      await message.reply("Command not found.").then((msg) =>
        setTimeout(() => {
          message.delete();
          msg.delete();
        }, 5000)
      );
      throw new Error("Command not found.");
    }
    debugger;
    command
      ?.run(message, content[1])
      .then(command?.success?.(message))
      .catch(command?.error?.(message));
  } catch (error) {
    console.error({
      Locale: `MessageCreate[1]`,
      Level: "error",
      Logger: `${error}`,
      Content: `${message.content}`,
      User: message.author.tag,
      Bot: message.author.bot,
    });
  }
};
