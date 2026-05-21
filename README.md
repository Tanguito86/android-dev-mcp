# android-dev-mcp

`android-dev-mcp` is a generic Model Context Protocol server for controlling Android development apps through ADB. It is designed to work with any Android app profile.

## What it does

- Lists connected ADB devices.
- Launches and force-stops configured Android apps.
- Clears and reads logcat, optionally filtered by profile tags.
- Captures screenshots with `adb exec-out screencap -p`.
- Sends taps, swipes, and text input.
- Installs debug APKs.
- Runs simple advanced `adb shell` commands.

## Installation

Requirements:

- Node.js 20 or newer.
- Android Platform Tools installed and `adb` available in `PATH`.
- An Android device or emulator with debugging enabled.

Install dependencies:

```powershell
npm install
```

Build:

```powershell
npm run build
```

Run in development mode:

```powershell
npm run dev
```

## Check ADB

Verify that ADB can see your device:

```powershell
adb devices
```

If no device appears, confirm that USB debugging is enabled and that the device authorization prompt was accepted.

## Multi-device usage

Most tools accept an optional `deviceId`. When omitted, ADB uses its default behavior. When provided, commands are run as `adb -s SERIAL ...`.

Find serials:

```powershell
adb devices
```

Example:

```json
{ "deviceId": "3bf1ca15" }
```

If a `deviceId` is not connected or is not in state `device`, the server returns a clear error with the currently available devices.

## Enable USB debugging

1. Open Android Settings.
2. Go to About phone.
3. Tap Build number seven times to enable Developer options.
4. Open Developer options.
5. Enable USB debugging.
6. Connect the device by USB and accept the RSA authorization prompt.

## App profiles

Profiles live in `config/apps.json`. Add one profile per Android app:

```json
{
  "apps": {
    "myapp": {
      "package": "com.example.myapp",
      "activity": ".MainActivity",
      "logTags": ["MyApp", "MyApp-Network"]
    }
  }
}
```

The profile key, such as `myapp`, is the value passed to tools that accept `app`.

## Example profile

This repository includes SoundBend as an example profile in `config/apps.json`. Use it as a template for your own app profiles:

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

No app-specific logic is hardcoded in the server.

## Tools

### `adb_devices`

Lists connected devices:

```json
{}
```

### `android_launch_app`

Launches an app from `config/apps.json`:

```json
{ "app": "myapp" }
```

With a specific device:

```json
{ "app": "myapp", "deviceId": "3bf1ca15" }
```

### `android_force_stop_app`

Stops an app by package using its profile:

```json
{ "app": "myapp" }
```

### `android_clear_logcat`

Clears logcat:

```json
{}
```

### `android_read_logcat`

Reads recent logcat lines. If `tags` is omitted and `app` is provided, profile tags are used.

```json
{ "app": "myapp", "lines": 300 }
```

Manual tags:

```json
{ "tags": ["ActivityManager"], "lines": 100 }
```

### `android_screenshot`

Captures a screenshot. If `outputPath` is omitted, a file is written under `screenshots/`.

```json
{ "outputPath": "screenshots/home.png" }
```

With a specific device:

```json
{ "outputPath": "screenshots/home.png", "deviceId": "3bf1ca15" }
```

### `android_ui_dump`

Captures the current Android UI hierarchy using `uiautomator dump` and saves the XML under `ui-dumps/` by default.

```json
{ "deviceId": "3bf1ca15" }
```

Custom path:

```json
{ "outputPath": "ui-dumps/current.xml" }
```

### `android_capture_state`

Captures a screenshot, UI dump, and metadata together under `captures/YYYY-MM-DD_HH-mm-ss/`.

Generated files:

- `screenshot.png`
- `window_dump.xml`
- `metadata.json`

```json
{ "app": "myapp", "deviceId": "3bf1ca15" }
```

### `android_record_video`

Records a short screen video using `adb shell screenrecord`. The default duration is 10 seconds and the maximum is 180 seconds. Files are saved under `recordings/` by default.

```json
{ "durationSec": 10, "deviceId": "3bf1ca15" }
```

Custom path:

```json
{ "durationSec": 5, "outputPath": "recordings/quick-check.mp4" }
```

### `android_generate_report`

Creates a basic debugging bundle under `reports/report_TIMESTAMP/`.

Generated files:

- `screenshot.png`
- `window_dump.xml`
- `logcat.txt`
- `metadata.json`
- `device-info.txt`

```json
{ "app": "myapp", "lines": 500, "deviceId": "3bf1ca15" }
```

### `android_tap`

Taps screen coordinates:

```json
{ "x": 540, "y": 1200 }
```

### `android_swipe`

Swipes between screen coordinates:

```json
{ "x1": 500, "y1": 1600, "x2": 500, "y2": 400, "durationMs": 300 }
```

### `android_input_text`

Types text into the focused field:

```json
{ "text": "hello world" }
```

### `android_install_apk`

Installs a debug APK:

```json
{ "apkPath": "app/build/outputs/apk/debug/app-debug.apk" }
```

### `android_run_shell`

Advanced tool. Runs a simple command through `adb shell`:

```json
{ "command": "settings get system screen_brightness" }
```

Use this carefully. It executes commands on the connected Android device.

## Real Device Validation

Validation run: 2026-05-21.

Device used:

- Device ID: `3bf1ca15`
- Model: `23129RA5FL`
- Android version: `15`
- Android SDK: `35`

Tools verified:

- `adb_devices`: returned the connected physical device with state `device`.
- `android_force_stop_app`: stopped the configured `soundbend` profile package.
- `android_launch_app`: launched `soundbend` using the package and activity from `config/apps.json`.
- `android_screenshot`: generated `screenshots/phase2-real-device.png`; PNG signature validated successfully.
- `android_clear_logcat`: cleared logcat without error.
- `android_read_logcat`: profile tag filtering executed successfully, but no matching lines were emitted for the configured tags during this run.
- `android_tap`: executed a tap at `500,1200` without error.
- `android_swipe`: executed a visible swipe from `500,1500` to `500,500`.
- `android_input_text`: sent `hello_android_dev_mcp`; this requires a focused editable field in the active app.
- `android_run_shell`: returned the device model using `getprop ro.product.model`.

Results:

- ADB control works with a physical Android device.
- The MCP server starts cleanly and registers all expected tools.
- The SoundBend profile works as an example app profile without server-side SoundBend hardcoding.

Problems found:

- `adb` was installed locally but was not available in the default `PATH`; validation used the local Android SDK `platform-tools` directory.
- The first screenshot validation found a PNG corruption bug caused by modifying binary output. The screenshot tool now writes the raw `adb exec-out screencap -p` buffer.
- Profile log tags are valid, but the app did not emit matching log lines during the validation window.

## Next Improvements

- Project-level profile discovery.
- Multi-device support.
- Optional `deviceId`.
- Video capture.
- UI hierarchy dump.
- `uiautomator` integration.
- Debug intents per app.
- Automation scripts.
- Visual inspection.
- Automatic reports.
- App-specific helper scripts.
