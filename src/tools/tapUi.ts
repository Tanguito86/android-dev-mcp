import { z } from "zod";
import { adb, formatError } from "../adb.js";
import { rememberSessionContext, resolveDeviceId } from "../sessionContext.js";
import { formatUiMatch } from "../uiParser.js";
import { dumpAndFindUiNodes } from "./findUi.js";
import { textResponse, type RegisterTool } from "./types.js";

export const registerTapUiTool: RegisterTool = (server) => {
  server.registerTool(
    "android_tap_ui",
    {
      title: "Tap Android UI node",
      description: "Find a UI node by text or resource-id and tap its center.",
      inputSchema: {
        text: z.string().min(1).optional(),
        resourceId: z.string().min(1).optional(),
        index: z.number().int().nonnegative().optional(),
        deviceId: z.string().min(1).optional()
      }
    },
    async ({ text, resourceId, index, deviceId }) => {
      try {
        if (!text && !resourceId) {
          return textResponse("Provide text, resourceId, or both.");
        }

        const resolvedDeviceId = resolveDeviceId(deviceId);
        const result = await dumpAndFindUiNodes({ text, resourceId, deviceId: resolvedDeviceId });

        if (result.matches.length === 0) {
          return textResponse(`No UI matches found.\ndump: ${result.dumpPath}`);
        }

        if (index === undefined && result.matches.length > 1) {
          return textResponse(
            [`Multiple UI matches found. Pass index to choose one.`, `dump: ${result.dumpPath}`]
              .concat(result.matches.map((match, matchIndex) => formatUiMatch(match, matchIndex)))
              .join("\n\n")
          );
        }

        const selectedIndex = index ?? 0;
        const selected = result.matches[selectedIndex];
        if (!selected) {
          return textResponse(`No UI match at index ${selectedIndex}. Found ${result.matches.length} match(es).`);
        }

        if (selected.centerX === undefined || selected.centerY === undefined) {
          return textResponse(`Selected UI match has no usable bounds.\n\n${formatUiMatch(selected, selectedIndex)}`);
        }

        await adb(["shell", "input", "tap", selected.centerX, selected.centerY], { deviceId: resolvedDeviceId });
        if (resolvedDeviceId) {
          rememberSessionContext({ deviceId: resolvedDeviceId });
        }

        return textResponse(
          [
            `Tapped UI match #${selectedIndex}`,
            `coordinates: ${selected.centerX},${selected.centerY}`,
            `dump: ${result.dumpPath}`,
            formatUiMatch(selected, selectedIndex)
          ].join("\n\n")
        );
      } catch (error) {
        return textResponse(`Failed to tap UI node:\n${formatError(error)}`);
      }
    }
  );
};

