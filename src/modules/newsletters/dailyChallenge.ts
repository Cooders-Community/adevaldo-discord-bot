import { EmbedBuilder } from "discord.js";
import { convert } from "html-to-text";
import { client } from "src";
import newsLetterKiller, { IFeed } from "src/utils/newsLetterKiller";

//https://kill-the-newsletter.com/feeds/smm1b9eq2hjp55jg.xml
//smm1b9eq2hjp55jg@kill-the-newsletter.com

export const moduleConfig = {
  channelId: "966732065565442068",
  urlMailBox: "https://kill-the-newsletter.com/feeds/smm1b9eq2hjp55jg.xml",
  cronSchedule: "0 0 13 * * 1-5",
  title: "Daily Challenge",
  source: "https://www.dailycodingproblem.com/",
};

const formatBody = function (body: string) {
  const toConvert = body
    .replaceAll(/(<s|<\/s)(.*?)(>)/g, "")
    .replaceAll(/(<p|<\/p)(.*?)(>)/g, "#");

  const str = convert(toConvert, {
    // wordwrap: false,
  })
    .replace(/\n/g, " ")
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

    if (channels?.isTextBased()) {
      const news = await requesNews();
      
      if (news?.content) {
        const str = formatBody(news?.content);

        //NOTE: Limiting Text to Challenge
        const index = str.findIndex((value) => value.includes(" -"));
        str.findIndex((value) => value.includes(" -"));
        const msg = "```" + str.slice(1, index).join("\n") + "```";

        const embedMessage = new EmbedBuilder()
          .setColor("#2BB280")
          .setTitle(news.title || moduleConfig.title)
          .setDescription(msg);

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

        const message = await channels.send({
          embeds: [embedMessage],
          components,
        })

        if(message)
          await message.startThread({
            name: `Answares of '${
              news.title || moduleConfig.title
            }'`,
            autoArchiveDuration: 1440,
          })

        console.warn("[#LOG]", `Sended newsLetter ${moduleConfig.title}}`);
      } else {
        console.warn("[#LOG]", `Not found news!`);
      }
    }
  } catch (error) {
    console.warn("[#ERROR]", error);
  }
};
