[https://deno.land/x/prohazko](https://deno.land/x/prohazko)

Collection of miscellaneous utility functions used by me in various
[Deno](https://deno.land/) projects.
You can also use them.

```
 ,  , ,   ,    ..    (deno is pretty cool, I guess)
 ,   ,  ,  ,  / _) ../   ,
. ,  _.----._/ /   ,   ,
 ,  /         /  ,   ,   ,
, ,/ (  | (  |  ,  ,   ,
 ./.-'|_|--|_|  ,    ,  ,
```


- [get.ts](./get.ts) -  Very cool function to access object properies in type-safe manner  
stolen from [awesome-template-literal-types](https://github.com/ghoullier/awesome-template-literal-types#dot-notation-string-type-safe)
- [bytes.ts](./bytes.ts) - TS port of great [bytes.js](https://github.com/visionmedia/bytes.js) from @tj
- [hex.ts](./hex.ts) - Old hexdump utility ported directly from C
- [exec.ts](./exec.ts) - There are many like it, but this one is mine
- [time.ts](./time.ts) - [date-fns](https://date-fns.org/) is cool, but 99% of `time` I only need these 7 consts and 2 fns 
- [node_http.ts](./node_http.ts) - Minimal types for serverless runtimes that give access to raw `(req, res)` node.js API
- [kube.ts](./kube.ts) - Wrap around [Kubernetes CLI](https://kubernetes.io/docs/reference/kubectl/)  
:warning: It was only created for local hacks with trusted scripts.  
Please never use this in any production environments, since it can easly damage your clusters.  
There is much better alternative
[cloudydeno/deno-kubernetes_client](https://github.com/cloudydeno/deno-kubernetes_client)






