import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type AdbResult = {
  stdout: string;
  stderr: string;
};

function stringifyArg(arg: string | number): string {
  return String(arg);
}

export async function adb(args: Array<string | number>): Promise<AdbResult> {
  try {
    const { stdout, stderr } = await execFileAsync("adb", args.map(stringifyArg), {
      encoding: "buffer",
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 20
    });

    return {
      stdout: stdout.toString("utf8"),
      stderr: stderr.toString("utf8")
    };
  } catch (error) {
    if (error instanceof Error && "stdout" in error && "stderr" in error) {
      const execError = error as Error & { stdout?: Buffer | string; stderr?: Buffer | string };
      const stdout = Buffer.isBuffer(execError.stdout)
        ? execError.stdout.toString("utf8")
        : String(execError.stdout ?? "");
      const stderr = Buffer.isBuffer(execError.stderr)
        ? execError.stderr.toString("utf8")
        : String(execError.stderr ?? "");

      throw new Error([error.message, stdout, stderr].filter(Boolean).join("\n").trim());
    }

    throw error;
  }
}

export async function adbBinary(args: Array<string | number>): Promise<Buffer> {
  try {
    const { stdout } = await execFileAsync("adb", args.map(stringifyArg), {
      encoding: "buffer",
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 20
    });

    return stdout;
  } catch (error) {
    if (error instanceof Error && "stderr" in error) {
      const execError = error as Error & { stderr?: Buffer | string };
      const stderr = Buffer.isBuffer(execError.stderr)
        ? execError.stderr.toString("utf8")
        : String(execError.stderr ?? "");
      throw new Error([error.message, stderr].filter(Boolean).join("\n").trim());
    }

    throw error;
  }
}

export function formatOutput(title: string, output: AdbResult): string {
  const stdout = output.stdout.trim();
  const stderr = output.stderr.trim();

  if (!stdout && !stderr) {
    return `${title}\nOK`;
  }

  return [title, stdout, stderr ? `stderr:\n${stderr}` : ""].filter(Boolean).join("\n");
}

export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}
