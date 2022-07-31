import { MessageEmbed } from "discord.js";
import { convert } from "html-to-text";
import { client } from "src/index";
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
    .replaceAll(/(<s|<\/s)(.*?)(>)/g, "")
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

export const requesNews = async (): Promise<IFeed | undefined> =>
  await newsLetterKiller
    .fetch(moduleConfig.urlMailBox)
    .then((res) => res.find((news) => news.isToday));

export default async () => {
  try {
    const channels = await client.channels.fetch(moduleConfig.channelId);

    if (channels?.isText()) {
      const news = await requesNews();

      if (news?.content) {
        const embedMessage = new MessageEmbed()
          .setColor("#edd968")
          .setTitle(news.title || moduleConfig.title);

        const body = formatBody(news?.content).filter((row) => row.length > 10);

        Promise.all(
          body.map((row) => {
            const [title, body] = row.split(":");
            if (!title || !body) return;
            embedMessage.addFields({ name: `${title}:`, value: body });
          })
        );

        const components: any[] = [];

        if (moduleConfig.source) {
          //NOTE: Button Component
          components.push({
            type: 1,
            components: [
              {
                style: 5,
                label: `Fonte`,
                url: `${moduleConfig.source}`,
                disabled: false,
                type: 2,
              },
            ],
          });
        }

        await channels.send({
          embeds: [embedMessage],
          components,
        });
        console.warn("[#LOG]", `Sended newsLetter ${moduleConfig.title}}`);
      } else {
        console.warn("[#LOG]", `Not found news!`);
      }
    }
  } catch (error) {
    console.warn("[#ERROR]", error);
  }
};
