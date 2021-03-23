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
