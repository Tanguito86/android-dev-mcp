import { writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { adb, formatError } from "../adb.js";
import { captureScreenshot, captureUiDump, getDeviceMetadata, timestampForPath, writeMetadata } from "../inspection.js";
import { textResponse, type RegisterTool } from "./types.js";

export const registerReportTool: RegisterTool = (server) => {
  server.registerTool(
    "android_generate_report",
    {
      title: "Generate Android debug report",
      description: "Create a basic debug bundle with screenshot, UI dump, logcat, metadata, and device info.",
      inputSchema: {
        app: z.string().min(1).optional(),
        lines: z.number().int().positive().max(5000).optional(),
        outputDir: z.string().min(1).optional(),
        deviceId: z.string().min(1).optional()
      }
    },
    async ({ app, lines, outputDir, deviceId }) => {
      try {
        const timestamp = timestampForPath();
        const reportDir = outputDir ?? path.join("reports", `report_${timestamp}`);
        const screenshotPath = path.join(reportDir, "screenshot.png");
        const uiDumpPath = path.join(reportDir, "window_dump.xml");
        const logcatPath = path.join(reportDir, "logcat.txt");
        const metadataPath = path.join(reportDir, "metadata.json");
        const deviceInfoPath = path.join(reportDir, "device-info.txt");

        const screenshotSize = await captureScreenshot(screenshotPath, { deviceId });
        const uiDumpSize = await captureUiDump(uiDumpPath, { deviceId });
        const logcat = await adb(["logcat", "-d", "-t", lines ?? 500], { deviceId });
        const deviceInfo = await adb(["shell", "getprop"], { deviceId });
        const metadata = await getDeviceMetadata({ deviceId }, app);

        await writeFile(path.resolve(process.cwd(), logcatPath), logcat.stdout, "utf8");
        await writeFile(path.resolve(process.cwd(), deviceInfoPath), deviceInfo.stdout, "utf8");
        await writeMetadata(metadataPath, metadata);

        return textResponse(
          [
            `Report saved to ${reportDir}`,
            `screenshot: ${screenshotPath} (${screenshotSize} bytes)`,
            `ui dump: ${uiDumpPath} (${uiDumpSize} bytes)`,
            `logcat: ${logcatPath}`,
            `metadata: ${metadataPath}`,
            `device info: ${deviceInfoPath}`
          ].join("\n")
        );
      } catch (error) {
        return textResponse(`Failed to generate Android report:\n${formatError(error)}`);
      }
    }
  );
};
