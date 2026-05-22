# Android Dev MCP

[![CI](https://github.com/Tanguito86/android-dev-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/Tanguito86/android-dev-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v0.4.0-blue.svg)](https://github.com/Tanguito86/android-dev-mcp/releases/tag/v0.4.0)

Generic Android MCP server for automation, inspection and debugging over ADB.

`android-dev-mcp` is a reusable MCP stdio server for Android development. It is designed for any Android app profile: internal apps, sample apps, games, QA builds, debug builds, and local experiments. It uses standard ADB only.

## Features

- Device management with optional `deviceId`.
- App profiles in `config/apps.json`.
- Launch, force stop, APK install, shell commands, tap, swipe, and text input.
- Screenshots, UI dumps, video recording, logcat, state captures, and report bundles.
- UI search by text, resource id, class, package, clickable, and enabled state.
- Tap automation by UI node, visible text, or resource id.
- Wait-for-UI polling with failure reports.
- Debug broadcast intents configured per app.
- Declarative per-app workflows with execution reports.
- Copyable templates for common profile styles.

## Installation

Requirements:

- Node.js 20 or newer.
- Android SDK Platform Tools installed with `adb` in `PATH`.
- USB debugging enabled and authorized on the device/emulator.

```powershell
npm install
npm run build
```

Run locally:

```powershell
npm run dev
```

Useful scripts:

```powershell
npm run typecheck
npm run clean
```

## Quick Start

Confirm ADB:

```powershell
adb devices
```

Add your app to `config/apps.json`:

```json
{
  "apps": {
    "myapp": {
      "package": "com.example.myapp",
      "activity": ".MainActivity",
      "logTags": ["MyApp"]
    }
  }
}
```

Example MCP calls:

```json
{ "app": "myapp", "deviceId": "SERIAL" }
```

```json
{ "resourceId": "com.example.myapp:id/play_button", "deviceId": "SERIAL" }
```

```json
{ "app": "myapp", "workflow": "appSmoke", "deviceId": "SERIAL" }
```

## Configuration

Profiles live in `config/apps.json`. The default config includes generic examples:

- `sampleApp`: standard app profile with reusable workflows.
- `demoDebugApp`: debug intents and logcat tags.
- `system`: Android Settings smoke workflow.
- `soundbend`: example profile only.

For a clean starting point, copy one of:

- `templates/apps.basic.json`
- `templates/apps.with-logcat.json`
- `templates/apps.with-debug-intents.json`
- `templates/apps.with-workflows.json`

More detail: [Add Your Android App](docs/add-your-app.md).

## Tools

Core ADB:

- `adb_devices`
- `android_launch_app`
- `android_force_stop_app`
- `android_install_apk`
- `android_run_shell`
- `android_tap`
- `android_swipe`
- `android_input_text`

Inspection:

- `android_clear_logcat`
- `android_read_logcat`
- `android_screenshot`
- `android_ui_dump`
- `android_capture_state`
- `android_record_video`
- `android_generate_report`

UI automation:

- `android_find_ui`
- `android_tap_ui`
- `android_tap_text`
- `android_tap_resource`
- `android_wait_for_ui`

Project automation:

- `android_send_debug_intent`
- `android_run_workflow`

## Workflows

Workflows are linear JSON sequences. They do not support loops, conditions, dynamic code, or eval.

Generic examples included in profiles/templates:

- `appSmoke`
- `launchAndCapture`
- `uiSnapshot`
- `logcatSnapshot`
- `installAndLaunch`
- `debugCapture`

Run:

```json
{ "app": "sampleApp", "workflow": "appSmoke", "deviceId": "SERIAL" }
```

Workflow runs write `workflow-reports/TIMESTAMP-app-workflow/`.

More detail: [Workflows](docs/workflows.md).

## MCP Client Configuration

See [MCP Client Setup](docs/mcp-client-setup.md) for Claude Desktop, Cursor, OpenCode, and generic MCP stdio clients.

Local stdio shape:

```json
{
  "mcpServers": {
    "android-dev-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/android-dev-mcp/dist/index.js"]
    }
  }
}
```

Future installed binary shape:

```json
{
  "mcpServers": {
    "android-dev-mcp": {
      "command": "android-dev-mcp",
      "args": []
    }
  }
}
```

## Debug Intents

Debug intents are optional broadcast actions implemented by your app and configured in the profile.

```json
{
  "debugIntents": {
    "dumpState": "com.example.myapp.DEBUG_DUMP_STATE"
  }
}
```

More detail and Kotlin/Java examples: [Debug Intents](docs/debug-intents.md).

## Future npm Usage

The package is npm-ready but not published yet.

```powershell
npx android-dev-mcp
```

or:

```powershell
npm install -g android-dev-mcp
android-dev-mcp
```

## Real Device Validation

Validated on a physical Android device:

- Model: `23129RA5FL`
- Android version: `15`
- Android SDK: `35`

Validated capabilities include device listing, app launch, screenshots, logcat, UI dumps, UI search, tap automation, debug intents, reports, video recording, package installation checks, and workflows.

## Example Profiles

SoundBend remains in `config/apps.json` as an example profile only. It demonstrates log tags, debug intents, and workflows, but the MCP server contains no SoundBend-specific logic.

## Project Structure

```text
config/apps.json          Active app profiles
config/apps.example.json  Profile examples
templates/                Copyable app profile templates
docs/                     Setup and usage guides
src/adb.ts                Central ADB wrapper
src/appProfiles.ts        Profile loader
src/uiParser.ts           Minimal uiautomator XML parser
src/workflows.ts          Simple workflow runner
src/tools/                MCP tool registrations
```

Generated artifacts are ignored by Git:

- `screenshots/`
- `ui-dumps/`
- `captures/`
- `recordings/`
- `reports/`
- `failure-reports/`
- `workflow-reports/`

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## Limitations

- Not Appium.
- No OCR, OpenCV, or visual AI.
- No accessibility service.
- No HTTP server, WebSocket server, or daemon.
- Workflow runner is intentionally linear and simple.
- UI parsing is flat and based on `uiautomator` XML nodes.

## License

MIT. See [LICENSE](LICENSE).
