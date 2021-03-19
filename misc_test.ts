import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

import { bit } from "./misc.ts";

Deno.test("bits", () => {
  assertEquals(bit(0b0001, 0), true);
  assertEquals(bit(0b0010, 1), true);
  assertEquals(bit(0b0100, 2), true);
  assertEquals(bit(0b1000, 3), true);

  assertEquals(bit(0b0000, 0), false);
  assertEquals(bit(0b0000, 1), false);
  assertEquals(bit(0b0000, 2), false);
  assertEquals(bit(0b0000, 3), false);
});
