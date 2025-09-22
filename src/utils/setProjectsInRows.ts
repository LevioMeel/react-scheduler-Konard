import dayjs from "dayjs";
import { SchedulerProjectData, ZoomLevel } from "@/types/global";

export const setProjectsInRows = (
  projects: SchedulerProjectData[],
  zoom: ZoomLevel = 0
): SchedulerProjectData[][] => {
  const rows: SchedulerProjectData[][] = [];

  // Determine the time unit for collision detection based on zoom level
  // zoom 0 = week view - use day precision
  // zoom 1 = day view - use hour precision
  // zoom 2 = hour view - use minute precision
  const timeUnit = zoom === 2 ? "minute" : zoom === 1 ? "hour" : "day";

  for (const project of projects) {
    let isAdded = false;
    if (rows.length) {
      for (const row of rows) {
        let isColliding = false;
        for (let i = 0; i < row.length; i++) {
          // Check if project overlaps with existing tile in the row
          // Using the appropriate time unit based on zoom level
          if (
            dayjs(project.startDate).isBetween(row[i].startDate, row[i].endDate, timeUnit, "[]") ||
            dayjs(project.endDate).isBetween(row[i].startDate, row[i].endDate, timeUnit, "[]")
          ) {
            isColliding = true;
            break;
          }
          // Check if project completely encompasses an existing tile
          if (
            dayjs(project.startDate).isBefore(row[i].startDate, timeUnit) &&
            dayjs(project.endDate).isAfter(row[i].endDate, timeUnit)
          ) {
            isColliding = true;
            break;
          }
        }
        if (!isColliding) {
          row.push(project);
          isAdded = true;
          break;
        }
      }
    }
    if (!isAdded) {
      rows.push([project]);
    }
  }
  return rows;
};
