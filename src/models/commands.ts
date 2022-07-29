import { Message } from "discord.js";

export interface IObjectCommand {
  name: string;
  description: string;
}

export interface ICommand {
  command: IObjectCommand;
  init?: Function;
  run: (message: Message, content: string) => Promise<any>;
  success?: Function;
  error?: Function;
}
