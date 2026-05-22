# Changelog

All notable changes to this project are documented here.

This project follows a simple Keep a Changelog style.

## [0.4.0] - 2026-05-21

### Added

- General-purpose app profile examples for standard apps, debug apps, logcat usage, and workflows.
- Reusable `templates/` for basic app profiles, logcat profiles, debug intents, and workflows.
- Dedicated docs for adding Android apps, MCP client setup, debug intents, and workflows.
- Generic workflow examples such as `appSmoke`, `launchAndCapture`, `uiSnapshot`, `logcatSnapshot`, `installAndLaunch`, and `debugCapture`.

### Changed

- README now presents `android-dev-mcp` as a general Android MCP toolkit first.
- SoundBend is documented only as an example profile and optional workflow example.
- npm package files now include `docs/` and `templates/`.

## [0.3.0] - 2026-05-21

### Added

- npm package readiness metadata, including `main`, `bin`, and package `files`.
- MCP client configuration documentation for Claude Desktop, Cursor, OpenCode, and generic stdio clients.
- Future npm usage documentation without publishing the package.
- Clean install and local package validation flow.

### Changed

- CI now uses Node 22 and runs both build and typecheck.
- Package version bumped to `0.3.0`.

## [0.2.0] - 2026-05-21

### Added

- Optional `deviceId` support across tools.
- UI hierarchy dumps, state captures, video recording, reports, and failure reports.
- Minimal UI XML parsing with node search, tap helpers, and wait helpers.
- Debug intents per app profile.
- Reusable declarative workflows with execution reports.
- GitHub issue templates, pull request template, CI, license, roadmap, and public release metadata.

### Changed

- README was reorganized for public adoption.
- Package metadata now includes repository, license, keywords, and maintenance scripts.

## [0.1.0] - 2026-05-21

### Added

- Initial TypeScript MCP server for Android automation through ADB.
- App profile loader with SoundBend as an example profile.
- Core tools for devices, launch, force stop, logcat, screenshots, taps, swipes, text input, APK install, and shell commands.

### Validated

- Fase 2: real physical Android device validation.
- Fase 3: Android inspection usability layer.
- Fase 4: UI interaction intelligence layer.
- Fase 5: reliability and ergonomics.
- Fase 6: reusable Android workflows.
