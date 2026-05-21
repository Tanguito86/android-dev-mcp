#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCaptureStateTool } from "./tools/captureState.js";
import { registerDebugIntentTool } from "./tools/debugIntent.js";
import { registerDevicesTool } from "./tools/devices.js";
import { registerFindUiTool } from "./tools/findUi.js";
import { registerForceStopAppTool } from "./tools/forceStopApp.js";
import { registerInputTextTool } from "./tools/inputText.js";
import { registerInstallApkTool } from "./tools/installApk.js";
import { registerLaunchAppTool } from "./tools/launchApp.js";
import { registerLogcatTools } from "./tools/logcat.js";
import { registerRecordVideoTool } from "./tools/recordVideo.js";
import { registerReportTool } from "./tools/report.js";
import { registerRunShellTool } from "./tools/runShell.js";
import { registerRunWorkflowTool } from "./tools/runWorkflow.js";
import { registerScreenshotTool } from "./tools/screenshot.js";
import { registerSwipeTool } from "./tools/swipe.js";
import { registerTapResourceTool } from "./tools/tapResource.js";
import { registerTapTool } from "./tools/tap.js";
import { registerTapTextTool } from "./tools/tapText.js";
import { registerTapUiTool } from "./tools/tapUi.js";
import { registerUiDumpTool } from "./tools/uiDump.js";
import { registerWaitForUiTool } from "./tools/waitForUi.js";

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
registerFindUiTool(server);
registerTapUiTool(server);
registerWaitForUiTool(server);
registerDebugIntentTool(server);
registerTapTextTool(server);
registerTapResourceTool(server);
registerRunWorkflowTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
