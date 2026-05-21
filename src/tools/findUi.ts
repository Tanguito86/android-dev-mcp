import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { formatError } from "../adb.js";
import { captureUiDump, timestampForPath } from "../inspection.js";
import { rememberSessionContext, resolveDeviceId } from "../sessionContext.js";
import { findUiNodes, formatUiMatch, parseUiNodes } from "../uiParser.js";
import { textResponse, type RegisterTool } from "./types.js";

export async function dumpAndFindUiNodes(input: {
  text?: string;
  resourceId?: string;
  deviceId?: string;
}) {
  const deviceId = resolveDeviceId(input.deviceId);
  const dumpPath = path.join("ui-dumps", `find-${timestampForPath()}.xml`);
  await captureUiDump(dumpPath, { deviceId });
  const xml = await readFile(path.resolve(process.cwd(), dumpPath), "utf8");
  const nodes = parseUiNodes(xml);
  const matches = findUiNodes(nodes, { text: input.text, resourceId: input.resourceId });

  if (deviceId) {
    rememberSessionContext({ deviceId });
  }

  return { dumpPath, matches };
}

export const registerFindUiTool: RegisterTool = (server) => {
  server.registerTool(
    "android_find_ui",
    {
      title: "Find Android UI nodes",
      description: "Dump and search Android UI hierarchy nodes by text or resource-id.",
      inputSchema: {
        text: z.string().min(1).optional(),
        resourceId: z.string().min(1).optional(),
        deviceId: z.string().min(1).optional()
      }
    },
    async ({ text, resourceId, deviceId }) => {
      try {
        if (!text && !resourceId) {
          return textResponse("Provide text, resourceId, or both.");
        }

        const result = await dumpAndFindUiNodes({ text, resourceId, deviceId });
        if (result.matches.length === 0) {
          return textResponse(`No UI matches found.\ndump: ${result.dumpPath}`);
        }

        return textResponse(
          [`Found ${result.matches.length} UI match(es).`, `dump: ${result.dumpPath}`]
            .concat(result.matches.map((match, index) => formatUiMatch(match, index)))
            .join("\n\n")
        );
      } catch (error) {
        return textResponse(`Failed to find UI nodes:\n${formatError(error)}`);
      }
    }
  );
};

