# Troubleshooting

## `adb` not found

Install Android SDK Platform Tools and add `platform-tools` to `PATH`.

Common Windows path:

```powershell
C:\Users\YOUR_USER\AppData\Local\Android\Sdk\platform-tools
```

Verify:

```powershell
adb version
```

## Device is `unauthorized`

Run:

```powershell
adb devices
```

If the device shows `unauthorized`, unlock the phone and accept the USB debugging prompt.

If no prompt appears:

```powershell
adb kill-server
adb start-server
adb devices
```

Then reconnect USB.

## No devices connected

- Confirm USB debugging is enabled.
- Try another USB cable or port.
- Check that the phone is in file transfer or debugging mode.
- Start an emulator if using Android Studio.

## Workflow not found

Use:

```json
{}
```

with `android_list_workflows`, or:

```json
{ "app": "myapp" }
```

to list workflows for one app.

## App profile invalid

Every profile needs:

```json
{
  "package": "com.example.myapp",
  "activity": ".MainActivity"
}
```

Check configured apps with `android_list_apps`.

## Package or activity is incorrect

Find current focus:

```powershell
adb shell dumpsys window | findstr mCurrentFocus
```

Resolve launch activity:

```powershell
adb shell cmd package resolve-activity --brief PACKAGE_NAME
```

## MCP client does not connect

- Run `npm run build`.
- Use an absolute path to `dist/index.js`.
- Confirm the MCP client is configured as a stdio server.
- Run `npm run doctor`.

## Windows PATH issues

In a new PowerShell session:

```powershell
$env:Path
adb version
```

If `adb` works only in one terminal, add Platform Tools to the system or user PATH, then restart the MCP client.

