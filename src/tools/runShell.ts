import { z } from "zod";
import { adb, formatError, formatOutput } from "../adb.js";
import { textResponse, type RegisterTool } from "./types.js";

export const registerRunShellTool: RegisterTool = (server) => {
  server.registerTool(
    "android_run_shell",
    {
      title: "Run Android shell command",
      description: "Advanced tool: run a simple adb shell command on the connected Android device.",
      inputSchema: {
        command: z.string().min(1),
        deviceId: z.string().min(1).optional()
      }
    },
    async ({ command, deviceId }) => {
      try {
        const result = await adb(["shell", command], { deviceId });
        return textResponse(formatOutput(`Ran shell command: ${command}`, result));
      } catch (error) {
        return textResponse(`Failed to run shell command:\n${formatError(error)}`);
      }
    }
  );
};
