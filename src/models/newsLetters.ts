export interface INewsLetter {
  channelId: string;
  urlMailBox: string;
  cronSchedule: string;
  title?: string;
  source?: string;
}

export interface INewsLetterList {
  [moduleName: string]: INewsLetter;
}
