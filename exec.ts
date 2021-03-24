export class ExecError extends Error {
  code = 0;
  signal: number | undefined = undefined;
  cmd: string[] | undefined = undefined;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error["captureStackTrace"] === "function") {
      Error["captureStackTrace"](this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export async function exec(cmd: string | string[], stdin = "") {
  if (!Array.isArray(cmd)) {
    cmd = cmd.split(" ");
  }

  const opts: Deno.RunOptions = {
    stderr: "piped",
    stdout: "piped",
    cmd,
  };

  if (stdin) {
    opts.stdin = "piped";
  }

  const p = Deno.run(opts);

  if (stdin) {
    const encoder = new TextEncoder();
    await p.stdin!.write(encoder.encode(stdin));
    p.stdin!.close();
  }

  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);
  p.close();

  if (!status.success) {
    let msg = `process '${cmd.join(" ")}' exited with code ${status.code}`;
    const resp = new TextDecoder().decode((stderr || stdout)).trim();
    if (resp) {
      msg = `${msg}: ${resp}`;
    }
    const err = new ExecError(msg);
    err.code = status.code;
    err.signal = status.signal;
    err.cmd = cmd;
    throw err;
  }

  return new TextDecoder().decode(stdout).trim();
}
