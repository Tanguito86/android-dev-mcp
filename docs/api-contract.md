# MCP API Contract

`android-dev-mcp` exposes a text-first MCP API. Tools return readable text and may include generated paths for screenshots, dumps, reports, recordings, or workflow outputs.

Common optional input:

- `deviceId?: string`: ADB serial. When omitted, ADB uses its default target. When provided, commands run with `adb -s SERIAL`.

Common error categories:

- validation error: invalid input, missing app profile, invalid coordinates, invalid path, or missing workflow.
- adb error: `adb` unavailable, unauthorized device, missing package, failed shell command, or disconnected device.
- workflow error: unsupported workflow tool, invalid step, or failed step.
- ui parsing error: malformed or empty UI dump.
- file system error: output path cannot be written.

## adb_devices

Lists connected Android devices.

Inputs:
- `deviceId?: string`

Expected output:
- Device serials and states such as `device`, `unauthorized`, or `offline`.

Example:
```json
{}
```

Common errors:
- `adb` unavailable.
- Requested `deviceId` not connected.

## android_list_apps

Lists configured app profiles from `config/apps.json`.

Inputs:
- none

Expected output:
- Profile name, package, activity, log tag count, debug intent count, and workflow names.

Example:
```json
{}
```

Common errors:
- Missing or invalid `config/apps.json`.

## android_list_workflows

Lists workflows configured for one app or all apps.

Inputs:
- `app?: string`

Expected output:
- App names with workflow names.

Example:
```json
{ "app": "sampleApp" }
```

Common errors:
- Unknown app profile.

## android_launch_app

Launches an app profile with `adb shell am start -n package/activity`.

Inputs:
- `app: string`
- `deviceId?: string`

Expected output:
- Package/activity launched and ADB status.

Example:
```json
{ "app": "sampleApp", "deviceId": "SERIAL" }
```

Common errors:
- Unknown app profile.
- Invalid `deviceId`.
- Package or activity not installed.

## android_force_stop_app

Force-stops an app profile package.

Inputs:
- `app: string`
- `deviceId?: string`

Expected output:
- Package stopped and ADB status.

Example:
```json
{ "app": "sampleApp" }
```

Common errors:
- Unknown app profile.
- Invalid `deviceId`.

## android_clear_logcat

Clears device logcat.

Inputs:
- `deviceId?: string`

Expected output:
- Confirmation that logcat was cleared.

Example:
```json
{}
```

Common errors:
- Invalid `deviceId`.
- ADB logcat command failed.

## android_read_logcat

Reads recent logcat output. If `app` is provided and `tags` is omitted, profile `logTags` are used.

Inputs:
- `app?: string`
- `tags?: string[]`
- `lines?: number`
- `deviceId?: string`

Expected output:
- Recent logcat text, optionally filtered by tag.

Example:
```json
{ "app": "sampleApp", "lines": 300 }
```

Common errors:
- Unknown app profile.
- Invalid `deviceId`.

## android_screenshot

Captures a PNG screenshot using `adb exec-out screencap -p`.

Inputs:
- `outputPath?: string`
- `deviceId?: string`

Expected output:
- Relative screenshot path and byte size.

Example:
```json
{ "outputPath": "screenshots/home.png" }
```

Common errors:
- Output path cannot be written.
- Invalid `deviceId`.

## android_tap

Runs `adb shell input tap`.

Inputs:
- `x: number`
- `y: number`
- `deviceId?: string`

Expected output:
- Coordinates tapped and ADB status.

Example:
```json
{ "x": 500, "y": 1200 }
```

Common errors:
- Invalid coordinates.
- Invalid `deviceId`.

## android_swipe

Runs `adb shell input swipe`.

Inputs:
- `x1: number`
- `y1: number`
- `x2: number`
- `y2: number`
- `durationMs?: number`
- `deviceId?: string`

Expected output:
- Swipe coordinates, duration, and ADB status.

Example:
```json
{ "x1": 500, "y1": 1500, "x2": 500, "y2": 500, "durationMs": 400 }
```

Common errors:
- Invalid coordinates.
- Invalid `deviceId`.

## android_input_text

Types text with `adb shell input text`.

Inputs:
- `text: string`
- `deviceId?: string`

Expected output:
- Text input command status.

Example:
```json
{ "text": "hello_android_dev_mcp" }
```

Common errors:
- Focused UI field does not accept input.
- Invalid `deviceId`.

## android_install_apk

Installs an APK with `adb install -r`.

Inputs:
- `apkPath: string`
- `deviceId?: string`

Expected output:
- Installed APK path and ADB install output.

Example:
```json
{ "apkPath": "app/build/outputs/apk/debug/app-debug.apk" }
```

Common errors:
- APK path missing.
- Install failed due to signature, SDK, or permissions.

## android_run_shell

Runs an advanced raw ADB shell command.

Inputs:
- `command: string`
- `deviceId?: string`

Expected output:
- Command title, stdout, and stderr when present.

Example:
```json
{ "command": "getprop ro.product.model" }
```

Common errors:
- Shell command failed.
- Invalid `deviceId`.

## android_ui_dump

Captures UI hierarchy with `uiautomator dump` and pulls XML locally.

Inputs:
- `outputPath?: string`
- `deviceId?: string`

Expected output:
- XML path, byte size, and timestamp.

Example:
```json
{ "outputPath": "ui-dumps/window.xml" }
```

Common errors:
- UIAutomator cannot dump current window.
- Output path cannot be written.

## android_capture_state

Captures a screenshot, UI dump, and metadata together.

Inputs:
- `app?: string`
- `outputDir?: string`
- `deviceId?: string`

Expected output:
- Directory path, screenshot path, UI dump path, metadata path, and sizes.

Example:
```json
{ "app": "sampleApp" }
```

Common errors:
- Unknown app profile.
- Screenshot or UI dump failed.

## android_record_video

Records a short screen video with `adb shell screenrecord`.

Inputs:
- `durationSec?: number`
- `outputPath?: string`
- `deviceId?: string`

Expected output:
- Recording path, duration, and byte size.

Example:
```json
{ "durationSec": 10 }
```

Common errors:
- Duration greater than 180 seconds.
- Device does not support screenrecord.

## android_generate_report

Creates a debugging report bundle.

Inputs:
- `app?: string`
- `lines?: number`
- `outputDir?: string`
- `deviceId?: string`

Expected output:
- Report directory with screenshot, UI dump, logcat, metadata, and device info.

Example:
```json
{ "app": "sampleApp", "lines": 500 }
```

Common errors:
- Unknown app profile.
- File system write failed.

## android_find_ui

Dumps the current UI and searches flat XML nodes.

Inputs:
- `text?: string`
- `resourceId?: string`
- `className?: string`
- `packageName?: string`
- `clickable?: boolean`
- `enabled?: boolean`
- `deviceId?: string`

Expected output:
- Filters applied, total matches, indexed preview, bounds, and centers.

Example:
```json
{ "text": "Play", "clickable": true }
```

Common errors:
- No filters provided.
- UI dump failed.

## android_tap_ui

Finds a UI node and taps its center.

Inputs:
- `text?: string`
- `resourceId?: string`
- `className?: string`
- `packageName?: string`
- `clickable?: boolean`
- `enabled?: boolean`
- `index?: number`
- `deviceId?: string`

Expected output:
- Chosen node, coordinates tapped, and status. Multiple matches are listed unless `index` selects one.

Example:
```json
{ "resourceId": "com.example:id/play", "index": 0 }
```

Common errors:
- No matching node.
- Multiple matches without `index`.
- Match has no bounds.

## android_tap_text

Shortcut for tapping visible text.

Inputs:
- `text: string`
- `index?: number`
- `deviceId?: string`

Expected output:
- Chosen text node and tap coordinates.

Example:
```json
{ "text": "Play" }
```

Common errors:
- Text not found.
- Multiple matches without `index`.

## android_tap_resource

Shortcut for tapping by resource id.

Inputs:
- `resourceId: string`
- `index?: number`
- `deviceId?: string`

Expected output:
- Chosen resource node and tap coordinates.

Example:
```json
{ "resourceId": "com.example:id/play_button" }
```

Common errors:
- Resource id not found.
- Multiple matches without `index`.

## android_wait_for_ui

Polls UI dumps until a matching node appears.

Inputs:
- `text?: string`
- `resourceId?: string`
- `className?: string`
- `packageName?: string`
- `clickable?: boolean`
- `enabled?: boolean`
- `timeoutSec?: number`
- `intervalMs?: number`
- `deviceId?: string`

Expected output:
- Match count, dump path, and elapsed time.

Example:
```json
{ "text": "DSP", "timeoutSec": 10, "intervalMs": 1000 }
```

Common errors:
- Timeout waiting for UI.
- Failure report could not be written.

## android_send_debug_intent

Sends a broadcast action configured in the app profile.

Inputs:
- `app: string`
- `intent: string`
- `extras?: object`
- `deviceId?: string`

Expected output:
- Intent key, resolved action, and broadcast output.

Example:
```json
{ "app": "demoDebugApp", "intent": "dumpState", "extras": { "verbose": true } }
```

Common errors:
- Unknown app profile.
- Unknown intent key.
- Unsupported extra value type.

## android_run_workflow

Runs a linear workflow declared in `config/apps.json`.

Inputs:
- `app: string`
- `workflow: string`
- `deviceId?: string`

Expected output:
- Workflow report path, per-step status, duration, generated paths, and final result.

Example:
```json
{ "app": "sampleApp", "workflow": "appSmoke", "deviceId": "SERIAL" }
```

Common errors:
- Unknown app profile.
- Unknown workflow.
- Unsupported step tool.
- ADB failure in one step.

## android_device_info

Returns device manufacturer, model, Android version, SDK, ABI, battery level, and charging status.

Inputs:
- `deviceId?: string`

Expected output (one line per field):
```
manufacturer: samsung
model: SM-S908B
device: b0s
androidVersion: 14
sdk: 34
abi: arm64-v8a
batteryLevel: 85%
chargingStatus: discharging
```

Common errors:
- ADB unavailable.
- No device connected.

## android_set_volume

Sets volume level for an audio stream (default: media / stream 3).

Inputs:
- `level: number` (0–15)
- `stream?: number` (default 3)
- `deviceId?: string`

Expected output:
```
stream: 3
level: 7
---
OK
```

Common errors:
- Level out of range (0–15).
- `media volume` command not available (older Android).

## android_clear_app_data

Clears all local data, cache, login, and preferences for an app. **WARNING: destructive — resets app to factory state.**

Inputs:
- `app: string` (resolved from config/apps.json)
- `deviceId?: string`

Expected output:
```
app: soundbend
package: com.tanguitostudio.soundbend
---
WARNING: All local data has been cleared (preferences, cache, login, config).
result: Success
```

Common errors:
- Unknown app profile.
- App not installed on device.
- `pm clear` blocked by device policy.

## android_manage_permissions

Grants or revokes a runtime permission for an app.

Inputs:
- `app: string` (resolved from config/apps.json)
- `permission: string`
- `action: "grant" | "revoke"`
- `deviceId?: string`

Expected output:
```
app: soundbend
package: com.tanguitostudio.soundbend
permission: android.permission.POST_NOTIFICATIONS
action: grant
---
```

Common errors:
- Permission is not a runtime permission (cannot be managed via ADB).
- App not installed.
- Action blocked by Android security policy.

## android_set_bluetooth

Enables or disables Bluetooth. **Best-effort**: may fail depending on Android version, OEM, and security policies.

Inputs:
- `enabled: boolean`
- `deviceId?: string`

Expected output:
```
requested: enabled
---
svc bluetooth enable: OK
settings put global bluetooth_on 1: OK
---
NOTE: Bluetooth enable may fail on some devices due to OEM restrictions or Android security policies.
```

Common errors:
- `svc bluetooth` blocked on the device.
- Settings write permission denied.
- Bluetooth toggles on but immediately off (OEM override).

## android_list_packages

Lists installed packages on the device via `pm list packages`. Optionally filter by case-insensitive substring.

Inputs:
- `filter?: string` — case-insensitive substring match
- `deviceId?: string`

Expected output:
```
total packages: 312
matching "google": 14
---
com.google.android.gms
com.google.android.youtube
...
```

Common errors:
- ADB unavailable or device disconnected.

## android_current_app

Returns the currently focused package and activity. Uses `dumpsys window` with `dumpsys activity` fallback.

Inputs:
- `deviceId?: string`

Expected output:
```
package: com.tanguito.soundbend
activity: com.tanguito.soundbend.ui.MainActivity
---
raw currentFocus: Window{abc123 ...}
```

Common errors:
- No activity in focus (lock screen, launcher without focus).
- ADB unavailable.

## android_app_info

Detailed package info from `dumpsys package`. Extracts versionName, versionCode, install/update times, and requested permissions.

Inputs:
- `app?: string` — config profile name
- `package?: string` — raw package name
- `deviceId?: string`

At least one of `app` or `package` must be provided.

Expected output:
```
package: com.tanguito.soundbend
profile: soundbend
versionName: 1.2.3
versionCode: 42
firstInstallTime: 2026-01-15 10:30:00
lastUpdateTime: 2026-05-20 14:22:00
status: enabled
---
requested permissions (3):
  android.permission.BLUETOOTH
  android.permission.POST_NOTIFICATIONS
  android.permission.RECORD_AUDIO
```

Common errors:
- Package not installed on the device.
- Unknown app profile.

## android_open_app_settings

Opens the system Settings > App Info screen for a package via `APPLICATION_DETAILS_SETTINGS` intent.

Inputs:
- `app?: string` — config profile name
- `package?: string` — raw package name
- `deviceId?: string`

Expected output:
```
package: com.tanguito.soundbend
intent: android.settings.APPLICATION_DETAILS_SETTINGS
---
OK — settings screen opened
```

Common errors:
- Package not installed.
- Settings app blocked or disabled on the device.

## android_uninstall_app

Uninstalls an app from the device. **WARNING**: permanent removal. Use `keepData=true` to preserve app data and cache.

Inputs:
- `app?: string`
- `package?: string`
- `keepData?: boolean` — preserve app data directories (default: false)
- `deviceId?: string`

Expected output:
```
package: com.tanguito.soundbend
keepData: true
---
WARNING: App has been uninstalled from the device.
App data and cache directories were preserved (-k flag).
---
OK
```

Common errors:
- Package not installed.
- App is a system app or protected by device policy (`DELETE_FAILED_DEVICE_POLICY_MANAGER`).
- App is not user-installable (`DELETE_FAILED_INTERNAL_ERROR`).

## android_start_activity

Launches an arbitrary Android component via `am start -n`. No config profile required.

Inputs:
- `package: string`
- `activity: string`
- `action?: string` — optional intent action (e.g. `android.intent.action.VIEW`)
- `deviceId?: string`

Expected output:
```
component: com.android.settings/.Settings
---
OK
```

Common errors:
- Component does not exist or is not exported.
- Permission denial (activity is private).
- Package not installed.

## android_send_intent

Sends a generic Android broadcast intent via `am broadcast` with optional extras. Supports `--es` (string), `--ei` (integer), `--ez` (boolean), `--ef` (float).

Inputs:
- `action: string` — intent action
- `package?: string` — limit broadcast to a specific package
- `component?: string` — target component (`pkg/class`)
- `extras?: Record<string, string|number|boolean>`
- `deviceId?: string`

Expected output:
```
action: com.example.MY_ACTION
package: com.test.app
extras (2): enabled, count
---
Broadcast completed
```

Common errors:
- No broadcast receivers registered for this intent action.
- Permission denial (intent requires a permission not granted).
- Invalid extras types (only string, number, boolean supported).
