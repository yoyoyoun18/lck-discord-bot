import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import { scrapeLCKSchedule } from "./crawler";
import cron from "node-cron";

dotenv.config();

function getFormattedDate(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[date.getDay()]; // 요일 가져오기
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Bot is online!");

  // 특정 시간에 메시지 보내기 (예: 매일 오전 9시에 메시지 보내기)
  cron.schedule("0 13 * * *", async () => {
    const schedule = await scrapeLCKSchedule();
    const today = getFormattedDate();

    // 일정 필터링
    const filteredSchedule = schedule.filter((game) => game.date === today);

    // 일정 메시지 생성
    const lckMessage =
      filteredSchedule.length > 0
        ? filteredSchedule
            .map(
              (game) =>
                `@here \n${game.date} \n\n${game.teams[0]} vs ${game.teams[1]}\n${game.teams[2]} vs ${game.teams[3]}\n`
            )
            .join("\n")
        : `@here \n${today} 경기가 없습니다.`;

    // 메시지 보낼 채널 ID
    const channelId = "1257854609850896468"; // 메시지를 보낼 디스코드 채널 ID
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (channel) {
      if (lckMessage.length > 2000) {
        channel.send("LCK 일정이 너무 길어 표시할 수 없습니다.");
      } else {
        channel.send(lckMessage);
      }
    } else {
      console.error("채널을 찾을 수 없습니다!");
    }
  });
});

client.on("messageCreate", async (message) => {
  if (message.content === "!ping") {
    message.channel.send("Pong!");
  } else if (message.content === "!lck") {
    const schedule = await scrapeLCKSchedule();
    const today = getFormattedDate();

    // 일정 필터링
    const filteredSchedule = schedule.filter((game) => game.date === today);

    // 일정 메시지 생성
    const lckMessage =
      filteredSchedule.length > 0
        ? filteredSchedule
            .map(
              (game) =>
                `@here \n${game.date} \n\n${game.teams[0]} vs ${game.teams[1]}\n${game.teams[2]} vs ${game.teams[3]}\n`
            )
            .join("\n")
        : `@here \n${today} 경기가 없습니다.`;

    // 메시지 길이 확인
    if (lckMessage.length > 2000) {
      message.channel.send("LCK 일정이 너무 길어 표시할 수 없습니다.");
    } else {
      message.channel.send(lckMessage);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
