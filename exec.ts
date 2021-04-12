export class ExecError extends Error {
  code = 0;

  stderr = "";
  stdout = "";
  text = "";

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
    const stdoutText = new TextDecoder().decode(stdout);
    const stderrText = new TextDecoder().decode(stderr);
    const text = (stdoutText || stderrText).trim();
    if (text) {
      msg = `${msg}: ${text}`;
    }
    const err = new ExecError(msg);
    err.code = status.code;
    err.signal = status.signal;
    err.text = text;
    err.cmd = cmd;
    err.stdout = stdoutText;
    err.stderr = stderrText;
    throw err;
  }

  return new TextDecoder().decode(stdout).trim();
}

export async function* tail(cmd: string | string[], stdin = "") {
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

  for (;;) {
    const buf = new Uint8Array(1024);
    const n = await p.stdout?.read(buf);

    const text = new TextDecoder().decode(buf);
    yield text;
  }

  // TODO: handle errrors
}
