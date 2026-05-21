#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCaptureStateTool } from "./tools/captureState.js";
import { registerDevicesTool } from "./tools/devices.js";
import { registerForceStopAppTool } from "./tools/forceStopApp.js";
import { registerInputTextTool } from "./tools/inputText.js";
import { registerInstallApkTool } from "./tools/installApk.js";
import { registerLaunchAppTool } from "./tools/launchApp.js";
import { registerLogcatTools } from "./tools/logcat.js";
import { registerRecordVideoTool } from "./tools/recordVideo.js";
import { registerReportTool } from "./tools/report.js";
import { registerRunShellTool } from "./tools/runShell.js";
import { registerScreenshotTool } from "./tools/screenshot.js";
import { registerSwipeTool } from "./tools/swipe.js";
import { registerTapTool } from "./tools/tap.js";
import { registerUiDumpTool } from "./tools/uiDump.js";

const server = new McpServer({
  name: "android-dev-mcp",
  version: "0.1.0"
});

registerDevicesTool(server);
registerLaunchAppTool(server);
registerForceStopAppTool(server);
registerLogcatTools(server);
registerScreenshotTool(server);
registerTapTool(server);
registerSwipeTool(server);
registerInputTextTool(server);
registerInstallApkTool(server);
registerRunShellTool(server);
registerUiDumpTool(server);
registerCaptureStateTool(server);
registerRecordVideoTool(server);
registerReportTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
