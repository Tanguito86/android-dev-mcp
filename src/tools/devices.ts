import { adb, formatError } from "../adb.js";
import { textResponse, type RegisterTool } from "./types.js";

export const registerDevicesTool: RegisterTool = (server) => {
  server.registerTool(
    "adb_devices",
    {
      title: "List ADB devices",
      description: "List Android devices currently visible to adb.",
      inputSchema: {}
    },
    async () => {
      try {
        const result = await adb(["devices"]);
        const output = result.stdout.trim() || result.stderr.trim() || "No adb output.";
        return textResponse(output);
      } catch (error) {
        return textResponse(`Failed to list adb devices:\n${formatError(error)}`);
      }
    }
  );
};
