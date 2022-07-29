import { format } from "date-fns";
import { convert } from "html-to-text";
import { client } from "src";
import newsLetterKiller, { IFeed } from "src/utils/newsLetterKiller";

export const moduleConfig = {
  channelId: "966732065565442068",
  urlMailBox: "https://kill-the-newsletter.com/feeds/1h7t9db17vnyz8zd.xml",
  cronSchedule: "0 0 13 * * *",
  title: "Daily Challenge",
  source: "https://filipedeschamps.com.br/newsletter",
};

const formatBody = function (body: string) {
  const toConvert = body
    .replaceAll(/(<s|<\/s)(.*?)(>)/g, "**")
    .replaceAll(/(<p|<\/p)(.*?)(>)/g, "#");
  console.log(toConvert);
  const str = convert(toConvert, {
    wordwrap: false,
  })
    .replace(/\n/g, " ")
    .replace(/\s*:*\s*Link\s(patrocinado|afiliado)/gi, ".")
    .replace(/\[.*?\]/g, "")
    .replace(
      /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g,
      ""
    )
    .replace(/\s\s+/g, " ")
    .trim()
    .split("#");

  return str;
};

export const requesNews = async (): Promise<IFeed | undefined> => {
  const mailsArr = await newsLetterKiller.fetch(moduleConfig.urlMailBox);
  return mailsArr.find((news) => news.isToday);
};

export default async () => {
  try {
    const channels = await client.channels.fetch(moduleConfig.channelId);

    if (channels?.isTextBased()) {
      const news = await requesNews();

      if (news?.content) {
        channels.send(
          `*** ${moduleConfig.title} - ${format(
            new Date(news.timestamp),
            "dd 'de' MMMM 'de' yyyy"
          )} ***`
        );

        const str = formatBody(news?.content);

        //NOTE: Limiting Text to Challenge
        const index = str.findIndex((value) => value.includes(" -"));
        str.findIndex((value) => value.includes(" -"));
        const msg = "```" + str.slice(1, index).join("\n") + "```";

        channels.send(`>>> EN \n${msg}`);

        //TODO: Translate Challenge to PT
        channels.send(`>>> PT Em Breve =)`);
        console.warn("[#LOG]", `Sended newsLetter ${moduleConfig.title}}`);
      } else {
        console.warn("[#LOG]", `Not found news!`);
      }
    }
  } catch (error) {
    console.warn("[#ERROR]", error);
  }
};
