
Collection of miscellaneous utility functions used by me in various [Deno](https://deno.land/) projects.  
You can also use them.

## bytes.ts

TS port of great [bytes.js](https://github.com/visionmedia/bytes.js) from @tj

## kube.ts

Wrap around [Kubernetes CLI](https://kubernetes.io/docs/reference/kubectl/)  
:warning: :warning: :warning: It was only created for local hacks with trusted scripts.  
Please never use this in any production environments, since it can easly damage your clusters.  
There is much better alternative [cloudydeno/deno-kubernetes_client](https://github.com/cloudydeno/deno-kubernetes_client)
