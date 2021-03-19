import { exec, OutputMode } from "https://deno.land/x/exec@0.0.5/mod.ts";

import type {
  Node,
  NodeList,
  Pod,
  PodList,
  Service,
  ServiceList,
} from "https://deno.land/x/kubernetes_apis@v0.3.0/builtin/core@v1/mod.ts";

class CliOpts {
  context?: string;
  namespace?: string;
}

export function getNodes(opts?: CliOpts): Promise<Node[]> {
  return _exec<NodeList>(`get nodes`, opts).then(({ items }) => items);
}

export function getPods(opts?: CliOpts): Promise<Pod[]> {
  return _exec<PodList>(`get po`, opts).then(({ items }) => items);
}

export function getServices(opts?: CliOpts): Promise<Service[]> {
  return _exec<ServiceList>(`get services`, opts).then(({ items }) => items);
}

export async function _exec<T = unknown>(cmd: string, opts?: CliOpts) {
  const ctx: string[] = [];

  if (opts?.context) {
    ctx.push(`--context ${opts.context}`);
  }
  if (opts?.namespace) {
    ctx.push(`--namespace ${opts.namespace}`);
  }

  const resp = await exec(`kubectl ${ctx.join(" ")} ${cmd} -o json`, {
    output: OutputMode.Capture,
  });
  return JSON.parse(resp.output) as T;
}
