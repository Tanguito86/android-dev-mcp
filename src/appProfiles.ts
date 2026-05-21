import { readFile } from "node:fs/promises";
import path from "node:path";

export type AppProfile = {
  package: string;
  activity: string;
  logTags?: string[];
};

type AppsConfig = {
  apps: Record<string, AppProfile>;
};

const configPath = path.resolve(process.cwd(), "config", "apps.json");

let cachedConfig: AppsConfig | undefined;

async function loadConfig(): Promise<AppsConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const rawConfig = await readFile(configPath, "utf8");
  const parsedConfig = JSON.parse(rawConfig) as AppsConfig;

  if (!parsedConfig.apps || typeof parsedConfig.apps !== "object") {
    throw new Error("config/apps.json must contain an apps object.");
  }

  cachedConfig = parsedConfig;
  return parsedConfig;
}

export async function getAppProfile(app: string): Promise<AppProfile> {
  const config = await loadConfig();
  const profile = config.apps[app];

  if (!profile) {
    const availableApps = Object.keys(config.apps).sort().join(", ") || "none";
    throw new Error(`Unknown app profile "${app}". Available profiles: ${availableApps}.`);
  }

  if (!profile.package || !profile.activity) {
    throw new Error(`App profile "${app}" must define package and activity.`);
  }

  return profile;
}
