export function isprint(x: number) {
  return x >= 0x20 && x <= 0x7e;
}

export function dump(buf: Uint8Array | string) {
  if (typeof buf === "string") {
    buf = new TextEncoder().encode(buf);
  }

  let out = "";

  let i = 0;
  let j = 0;

  for (i = 0; i < buf.length; i += 16) {
    out += i.toString(16).padStart(6, "0");
    out += ": ";

    for (j = 0; j < 16; j++) {
      if (i + j < buf.length) {
        out += buf[i + j].toString(16).padStart(2, "0");
        out += " ";
      } else {
        out += "   ";
      }
    }
    out += " ";

    for (j = 0; j < 16; j++) {
      if (i + j < buf.length) {
        out += isprint(buf[i + j]) ? String.fromCharCode(buf[i + j]) : ".";
      }
    }
    out += "\n";
  }

  return out;
}
