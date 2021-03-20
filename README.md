Collection of miscellaneous utility functions used by me in various [Deno](https://deno.land/) projects.  
You can also use them.

```
 ,  , ,   ,    ..    (deno is pretty cool, I guess)
 ,   ,  ,  ,  / _) ../   , 
. ,  _.----._/ /   ,   ,  
 ,  /         /  ,   ,   , 
, ,/ (  | (  |  ,  ,   ,  
 ./.-'|_|--|_|  ,    ,  ,  
```


## [get.ts](./get.ts)

Very cool function to access object properies in type-safe manner stolen from [awesome-template-literal-types](https://github.com/ghoullier/awesome-template-literal-types#dot-notation-string-type-safe)

## [bytes.ts](./bytes.ts)

TS port of great [bytes.js](https://github.com/visionmedia/bytes.js) from @tj

## [kube.ts](./kube.ts)

Wrap around [Kubernetes CLI](https://kubernetes.io/docs/reference/kubectl/)  
:warning: :warning: :warning: It was only created for local hacks with trusted scripts.  
Please never use this in any production environments, since it can easly damage your clusters.  
There is much better alternative [cloudydeno/deno-kubernetes_client](https://github.com/cloudydeno/deno-kubernetes_client)
