import { z } from "zod";
import { formatError } from "../adb.js";
import { getAppProfile } from "../appProfiles.js";
import { rememberSessionContext, resolveDeviceId } from "../sessionContext.js";
import { runWorkflow } from "../workflows.js";
import { textResponse, type RegisterTool } from "./types.js";

function formatWorkflowResult(result: Awaited<ReturnType<typeof runWorkflow>>): string {
  const steps = result.steps.map((step) =>
    [
      `[${step.index}] ${step.tool}: ${step.ok ? "OK" : "ERROR"} (${step.durationMs} ms)`,
      step.output,
      step.paths.length > 0 ? `paths: ${step.paths.join(", ")}` : ""
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `Workflow ${result.app}/${result.workflow}: ${result.ok ? "OK" : "ERROR"}`,
    `duration: ${result.durationMs} ms`,
    `report: ${result.reportDir}`,
    "",
    ...steps
  ].join("\n");
}

export const registerRunWorkflowTool: RegisterTool = (server) => {
  server.registerTool(
    "android_run_workflow",
    {
      title: "Run Android workflow",
      description: "Run a declarative app workflow from config/apps.json.",
      inputSchema: {
        app: z.string().min(1),
        workflow: z.string().min(1),
        deviceId: z.string().min(1).optional()
      }
    },
    async ({ app, workflow, deviceId }) => {
      try {
        await getAppProfile(app);
        const resolvedDeviceId = resolveDeviceId(deviceId);
        const result = await runWorkflow(app, workflow, resolvedDeviceId);
        rememberSessionContext({ app, deviceId: resolvedDeviceId });
        return textResponse(formatWorkflowResult(result));
      } catch (error) {
        return textResponse(`Failed to run workflow:\n${formatError(error)}`);
      }
    }
  );
};

