import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateAppProfile } from "./validation.js";

export type WorkflowStep = {
  tool: string;
  args?: Record<string, unknown>;
};

export type AppProfile = {
  package: string;
  activity: string;
  logTags?: string[];
  debugIntents?: Record<string, string>;
  workflows?: Record<string, WorkflowStep[]>;
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

  return validateAppProfile(app, profile);
}

export async function listAppProfiles(): Promise<Record<string, AppProfile>> {
  const config = await loadConfig();
  return config.apps;
}

export async function getAppWorkflow(app: string, workflow: string): Promise<WorkflowStep[]> {
  const profile = await getAppProfile(app);
  const steps = profile.workflows?.[workflow];

  if (!steps) {
    const available = Object.keys(profile.workflows ?? {}).sort().join(", ") || "none";
    throw new Error(`Unknown workflow "${workflow}" for app "${app}". Available workflows: ${available}.`);
  }

  if (!Array.isArray(steps)) {
    throw new Error(`Workflow "${workflow}" for app "${app}" must be an array.`);
  }

  return steps;
}
