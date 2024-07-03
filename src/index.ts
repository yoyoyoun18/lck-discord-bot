import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import cron from "node-cron";
import { scrapeAndSaveLCKSchedule } from "./scrapeAndSaveLCKSchedule";

dotenv.config();

interface ScheduleItem {
  date: string;
  teams: string[];
  time: string;
}

function getFormattedDate(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[date.getDay()]; // 요일 가져오기
  return `${month}월 ${day}일 (${dayOfWeek})`;
}

function loadLCKSchedule(): ScheduleItem[] {
  const filePath = path.join(__dirname, "lckSchedule.json");
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } else {
    return [];
  }
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

  // 한 달에 한 번 크롤링하여 데이터 저장 (예: 매월 1일 00:00에 실행)
  cron.schedule("0 0 1 * *", async () => {
    await scrapeAndSaveLCKSchedule();
    console.log("LCK 일정이 업데이트되었습니다.");
  });
});

client.on("messageCreate", async (message) => {
  if (message.content === "!ping") {
    message.channel.send("Pong!");
  } else if (message.content === "!lck") {
    // const startTime = Date.now();
    const schedule = loadLCKSchedule();
    const today = getFormattedDate();

    // 일정 필터링
    const filteredSchedule = schedule.filter((game) => game.date === today);

    // 일정 메시지 생성
    const lckMessage =
      filteredSchedule.length > 0
        ? filteredSchedule
            .map(
              (game) =>
                `@here\n${game.date} \n\n${game.teams[0]} vs ${game.teams[1]}\n${game.teams[2]} vs ${game.teams[3]}\n`
            )
            .join("\n")
        : `@here\n${today} 경기가 없습니다.`;

    // const endTime = Date.now();
    // const responseTime = (endTime - startTime).toString();

    // 메시지 길이 확인
    if (lckMessage.length > 2000) {
      await message.channel.send("LCK 일정이 너무 길어 표시할 수 없습니다.");
    } else {
      await message.channel.send(lckMessage);
      //   await message.channel.send(`응답 시간: ${responseTime}ms`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
