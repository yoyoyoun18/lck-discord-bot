import { scrapeLCKSchedule } from "./crawler";
import fs from "fs";
import path from "path";

export async function scrapeAndSaveLCKSchedule() {
  const schedule = await scrapeLCKSchedule();
  const filePath = path.join(__dirname, "lckSchedule.json");

  fs.writeFileSync(filePath, JSON.stringify(schedule, null, 2));
}

scrapeAndSaveLCKSchedule().catch(console.error);
