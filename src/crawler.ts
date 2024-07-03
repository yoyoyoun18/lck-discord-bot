import puppeteer from "puppeteer";

// 스케줄 아이템 타입 정의
interface ScheduleItem {
  date: string;
  teams: string[];
  time: string;
}

export async function scrapeLCKSchedule(): Promise<ScheduleItem[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://game.naver.com/esports/League_of_Legends/schedule/lck"
  );

  const schedule: ScheduleItem[] = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".card_item__3Covz")); // 실제 클래스명을 확인 후 수정하세요
    return rows.map((row): ScheduleItem => {
      const date =
        row.querySelector(".card_date__1kdC3")?.textContent?.trim() || "";
      const teams = Array.from(row.querySelectorAll(".row_name__IDFHz")).map(
        (team) => team.textContent?.trim() || ""
      );
      const time =
        row.querySelector(".row_time__28bwr")?.textContent?.trim() || "";
      return { date, teams, time };
    });
  });

  await browser.close();
  return schedule;
}
