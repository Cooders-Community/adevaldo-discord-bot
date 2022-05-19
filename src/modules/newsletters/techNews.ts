import { format } from "date-fns";
import { convert } from "html-to-text";
import path from "path";
import config from "../../config";
import { client } from "../../index";
import newsLetterKiller, { IFeed } from "../../utils/newsLetterKiller";

var moduleName = path.basename(__filename).split(".")[0];
const moduleConfig = config.newsLetterList[moduleName];

const formatBody = function (body: string) {
  const toConvert = body
    .replaceAll(/(<s|<\/s)(.*?)(>)/g, "**")
    .replaceAll(/(<p|<\/p)(.*?)(>)/g, "#");

  const str = convert(toConvert, {
    wordwrap: false,
  })
    .replace(/\n/g, " ")
    .replace(/^Filipe\sDeschamps\sNewsletter\s?/, "")
    .replace(/\s*:*\s*Link\s(patrocinado|afiliado)/gi, ".")
    .replace(/Cancelar\sinscrição.*$/, "")
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
    if (channels?.isText()) {
      const news = await requesNews();

      if (news?.content) {
        channels.send(
          `*** ${moduleConfig.title} - ${format(
            new Date(news.timestamp),
            "dd 'de' MMMM 'de' yyyy"
          )} ***`
        );

        const body = formatBody(news?.content);

        await Promise.all(
          body.map(async (n) =>
            new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
              if (n.length > 10) channels.send(`>>> :white_small_square:${n}`);
            })
          )
        ).then(() => {
          {
            moduleConfig?.source &&
              channels.send(`>>> Fonte: ${moduleConfig?.source}`);
          }
        });
        console.warn("[#LOG]", `Sended newsLetter ${moduleName}}`);
      } else {
        console.warn("[#LOG]", `Not found news!`);
      }
    }
  } catch (error) {
    console.warn("[#ERROR]", error);
  }
};
