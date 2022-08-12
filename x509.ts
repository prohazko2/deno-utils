import { decode as decodeBase64 } from "https://deno.land/std@0.152.0/encoding/base64.ts";

import { Certificate } from "https://cdn.skypack.dev/pkijs@3.0.7?dts";

export const CERT_BOUNDARY_REGEX =
  /(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g;

export function fromBer(ber: BufferSource) {
  return Certificate.fromBER(ber);
}

export function fromPem(pem: string) {
  const b64 = pem.replace(CERT_BOUNDARY_REGEX, "");
  const ber = decodeBase64(b64);

  return fromBer(ber);
}
