import { setTimeout as sleep } from "node:timers/promises";
import { z } from "zod";
import { formatError } from "../adb.js";
import { rememberSessionContext, resolveDeviceId } from "../sessionContext.js";
import { formatUiMatch } from "../uiParser.js";
import { dumpAndFindUiNodes } from "./findUi.js";
import { textResponse, type RegisterTool } from "./types.js";

export const registerWaitForUiTool: RegisterTool = (server) => {
  server.registerTool(
    "android_wait_for_ui",
    {
      title: "Wait for Android UI node",
      description: "Wait until a UI node appears by text or resource-id.",
      inputSchema: {
        text: z.string().min(1).optional(),
        resourceId: z.string().min(1).optional(),
        timeoutSec: z.number().int().positive().max(300).optional(),
        intervalMs: z.number().int().positive().max(10000).optional(),
        deviceId: z.string().min(1).optional()
      }
    },
    async ({ text, resourceId, timeoutSec, intervalMs, deviceId }) => {
      try {
        if (!text && !resourceId) {
          return textResponse("Provide text, resourceId, or both.");
        }

        const resolvedDeviceId = resolveDeviceId(deviceId);
        const timeout = timeoutSec ?? 10;
        const interval = intervalMs ?? 1000;
        const deadline = Date.now() + timeout * 1000;
        let lastDumpPath = "";

        while (Date.now() <= deadline) {
          const result = await dumpAndFindUiNodes({ text, resourceId, deviceId: resolvedDeviceId });
          lastDumpPath = result.dumpPath;

          if (result.matches.length > 0) {
            if (resolvedDeviceId) {
              rememberSessionContext({ deviceId: resolvedDeviceId });
            }

            return textResponse(
              [
                `UI node appeared after ${timeout * 1000 - Math.max(0, deadline - Date.now())} ms.`,
                `dump: ${result.dumpPath}`,
                formatUiMatch(result.matches[0], 0)
              ].join("\n\n")
            );
          }

          if (Date.now() + interval > deadline) {
            break;
          }

          await sleep(interval);
        }

        return textResponse(`Timed out after ${timeout} seconds waiting for UI node.\nlast dump: ${lastDumpPath}`);
      } catch (error) {
        return textResponse(`Failed while waiting for UI node:\n${formatError(error)}`);
      }
    }
  );
};

