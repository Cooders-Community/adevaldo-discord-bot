import { isToday } from "date-fns";
import removeAccents from "remove-accents";
import RSSParser from "rss-parser";

export interface IFeed {
  title: string;
  timestamp: number;
  isToday: boolean;
  content: string | undefined;
}

export const fetch = async (baseUrl: string): Promise<IFeed[]> => {
  if (!baseUrl) throw new Error("Url Not Found");

  const parser = new RSSParser();
  const feed = await parser.parseURL(baseUrl);

  const feedArr: IFeed[] = await Promise.all(
    feed.items.map((item) => ({
      title: removeAccents(item?.title || "").replace(/['"“”‘’„”«»]/g, ""),
      timestamp: (item?.isoDate && +new Date(item?.isoDate)) || 0,
      isToday: (item?.isoDate && isToday(new Date(item?.isoDate))) || false,
      content: item?.content,
    }))
  );

  return feedArr;
};

export default {
  fetch,
};
