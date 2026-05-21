import { adb, type AdbOptions } from "./adb.js";

export type CurrentActivity = {
  packageName?: string;
  activityName?: string;
  rawSource: string;
};

function parseComponent(text: string): Pick<CurrentActivity, "packageName" | "activityName"> | undefined {
  const component = text.match(/([a-zA-Z0-9_.]+)\/([a-zA-Z0-9_.$]+)/);
  if (!component) {
    return undefined;
  }

  return {
    packageName: component[1],
    activityName: component[2]
  };
}

export async function getCurrentActivity(options: AdbOptions = {}): Promise<CurrentActivity> {
  const windowDump = await adb(["shell", "dumpsys", "window"], options);
  const windowLines = windowDump.stdout.split(/\r?\n/);
  const focusLine = windowLines.find((line) => line.includes("mCurrentFocus"));
  const focusedAppLine = windowLines.find((line) => line.includes("mFocusedApp"));

  for (const line of [focusLine, focusedAppLine]) {
    const parsed = parseComponent(line ?? "");
    if (parsed) {
      return { ...parsed, rawSource: line?.trim() ?? "" };
    }
  }

  const activityDump = await adb(["shell", "dumpsys", "activity", "activities"], options);
  const activityLines = activityDump.stdout.split(/\r?\n/);
  const topResumedLine = activityLines.find((line) => line.includes("topResumedActivity"));
  const resumedLine = activityLines.find((line) => line.includes("ResumedActivity"));

  for (const line of [topResumedLine, resumedLine]) {
    const parsed = parseComponent(line ?? "");
    if (parsed) {
      return { ...parsed, rawSource: line?.trim() ?? "" };
    }
  }

  return { rawSource: "No current activity found in dumpsys window or dumpsys activity activities." };
}

