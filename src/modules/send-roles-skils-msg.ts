import { EmbedBuilder } from "discord.js";
import { client } from "src";
import config from "src/config";

export const moduleConfig = {
  channelId: "963989486096764969",
  // channelId: "968179127121248366",
};

export default async () => {
  const channel = await client.channels.fetch(moduleConfig.channelId);

  if (channel?.isTextBased()) {
    const totalMessages = await channel.messages.fetch({ limit: 100 });
    if (totalMessages.size) return;
    // totalMessages.size > 0 &&
    //   totalMessages.forEach((message) => {
    //     message.delete();
    //   });

    const messages = Object.keys(config.skillsRoles).map(
      async (skillsRole: string) => {
        const category = config.skillsRoles[skillsRole];

        if (!category.length) return;

        const embedMessage = new EmbedBuilder()
          .setColor("#0090F7")
          .setTitle(skillsRole);

        const description = category
          .map((role) => `\n${role.emoji} ${role.tag}`)
          .join();

        embedMessage.setDescription(description.toString());

        return await channel
          .send({ embeds: [embedMessage] })
          .then((msg) =>
            category.map((role) => role?.emoji && msg.react(role?.emoji))
          )
          .catch(console.error);
      }
    );
    await Promise.all(messages);
  }
};
