declare var require: any;

/* real world headers values may be `string | string[]`, 
    but we just hope we never encounter them */
export type Headers = Record<string, string>;

export type Stream = {
  on<T = unknown>(event: string, listener: (data: T) => void): void;
  on(event: string, listener: () => void): void;

  once<T = unknown>(event: string, listener: (data: T) => void): void;
  once(event: string, listener: () => void): void;

  pipe(s: Stream): Stream;
};

export type Request = Stream & {
  method: string;
  url: string;
  headers: Headers;
};

export type Response = Stream & {
  setHeader(key: string, value: string): void;
  writeHead(statusCode: number, headers?: Headers): void;
  write(data: string): void;
  end(data?: string): void;
};

export type RequestOptions<T = unknown> = {
  url: URL | string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  headers?: Headers;
  body?: T;
};

export function sendJson<Q = unknown, S = unknown>(
  opts: RequestOptions<Q>
): Promise<S> {
  //const require = (globalThis as any)["require"];

  const { protocol, hostname, port, pathname, search } = new URL(
    opts.url.toString()
  );
  const proto = protocol === "https:" ? require("https") : require("http");

  const options = {
    method: "GET",
    host: hostname,
    port: +port,
    path: `${pathname}${search}`,
    ...opts,
  };

  if (!port) {
    options.port = protocol === "https:" ? 443 : 80;
  }

  return new Promise((resolve, reject) => {
    const req = proto.request(
      options,
      (res: Stream & { statusCode: number }) => {
        let resp = "";
        res.on("data", (chunk: string) => (resp += chunk.toString()));
        res.on("end", () => {
          if (resp.startsWith("<html>")) {
            let [, title = "Unknown html errror"] =
              /<title>(.*?)<\/title>/gi.exec(resp) || [];
            reject(
              new Error(
                `${
                  options.method
                } ${opts.url.toString()} returned html with title: ${title}`
              )
            );
          }
          try {
            const json = JSON.parse(resp);
            if (res.statusCode >= 400) {
              return reject(new Error(resp));
              //return reject(ApiError.fromJson(opts, json, res.statusCode));
            }
            resolve(json);
          } catch (err) {
            console.log(resp);
            reject(err);
          }
        });
      }
    );

    req.on("error", (err: unknown) => reject(err));

    if (opts.body) {
      let send = opts.body as any;
      if (typeof send === "object") {
        send = JSON.stringify(opts.body);
      }
      req.write(send);
    }
    req.end();
  });
}

export function readJson<T = unknown>(req: Request): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (data: string) => (body += data.toString()));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

export function sendError(res: Response, err: Error, statusCode = 500) {
  res.writeHead(statusCode, { "content-type": "application/json" });
  res.end(JSON.stringify({ success: false, message: err.toString() }));
}
