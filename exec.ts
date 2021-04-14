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

async function waitForExit(cmd: string | string[], process: Deno.Process) {
  if (!Array.isArray(cmd)) {
    cmd = cmd.split(" ");
  }

  const [status, stdout, stderr] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);
  process.close();

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

  return { status, stdout, stderr };
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

  const { stdout } = await waitForExit(cmd, p);

  return new TextDecoder().decode(stdout).trim();
}

export type TailOptions = {
  fromStderr: boolean;
};

export async function* tail(cmd: string | string[], _opts?: TailOptions) {
  if (!Array.isArray(cmd)) {
    cmd = cmd.split(" ");
  }

  const opts: Deno.RunOptions = {
    stderr: "piped",
    stdout: "piped",
    cmd,
  };

  const p = Deno.run(opts);
  let s = p.stdout!;

  if (_opts?.fromStderr) {
    s = p.stderr!;
  }

  for (;;) {
    const buf = new Uint8Array(4096);
    const n = await s.read(buf);

    if (n === null || n === undefined) {
      break;
    }

    const text = new TextDecoder().decode(buf.slice(0, n));
    yield text;
  }

  await waitForExit(cmd, p);
}
