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

## Next steps

- Project-level profile discovery.
- Device ID selection.
- Debug intents per app.
- Automatic reports.
- App-specific helper scripts.
