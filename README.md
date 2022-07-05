# demo-grpc-web-vite-issue

A simplist demo to show the issue when using vite with grpc-web generated code. 

Btw, don't need the server and proxy to run to see the error in the web service. Need server and proxy when web service is running the test the grpc service itself.

## UPDATE: 2022-07-04 Demo is working!

### Quick Launch

- server

```
cd server

npm install

node echo_server.js
```

- envoy proxy

```
# ubuntu
docker build -t yg-envoy-grpc -f Dockerfile .
docker run --rm -it -p 9090:9090 -p 9901:9901 --network=host yg-envoy-grpc
```

- client

```
cd client

npm install

npm run dev
```

Move to web browser to see the demo.

## Quick Start

### Env

```
$ nvm -v
0.37.0

$ node -v
v16.15.0

$ npm -v
8.5.5

$ vue -V
@vue/cli 5.0.4

$ protoc --version
libprotoc 3.6.1
```

### Launch grpc server in Node

```
cd server

npm install

node echo_server.js
```

Test the server using node, open another terminal, same directory

```
node echo_client_static.js
```

### Launch envoy proxy

This proxy is using envoy v1.10.0, later version requires a different setting. The settings are different in Ubuntu and Mac/Win, see the note in directory @/proxy/envoy.yaml.

- ubuntu
```
docker build -t yg-envoy-grpc -f Dockerfile .
docker run --rm -it -p 9090:9090 -p 9901:9901 --network=host yg-envoy-grpc
```

- mac/win
```
# change file envoy.yaml
...
  # macos/windows 
  # envoy is running within docker
  # grpc service aka node-server or python-server is running in host
  # direct request from web to envoy to server by host.docker.internal
  hosts: [{ socket_address: { address: host.docker.internal, port_value: 50051 }}]
  # ubuntu/linux
  # use --network=host which is depreciated
  # docker run --rm -it -p 9090:9090 -p 9901:9901 --network=host yg-envoy-echo
  # hosts: [{ socket_address: { address: 0.0.0.0, port_value: 50051 }}]
...

docker build -t yg-envoy-grpc -f Dockerfile .

docker run --rm -it -p 9090:9090 -p 9901:9901 yg-envoy-grpc
```

Note: Tested on ubuntu and mac only.

### Using grpc-web with Vite

```
cd client

npm install

npm run dev
```

#### Issue

IMHO, the issue is rooted as Vite not support commonjs by nature, while grpc-web can (only?) compile the proto file to commonjs in some sense.

Here are the details:

- Generate grpcweb code following https://github.com/grpc/grpc-web

```
cd proto

protoc -I=. echo.proto \
  --js_out=import_style=commonjs:../client/src/proto/protoc-js \
  --grpc-web_out=import_style=commonjs,mode=grpcwebtext:../client/src/proto/protoc-js
```

- Use it in App.vue
```
  ...
  messages = require('./proto/protoc-js/echo_pb')
  services = require('./proto/protoc-js/echo_grpc_web_pb')

  const client = new services.EchoServiceClient('http://127.0.0.1:9090')
  const request = new messages.EchoRequest()
  ...
```

- Error (see in browser):

`Uncaught ReferenceError: require is not defined`

#### Solution 1, not working, require, exports not defined

Try to enable Vite to support grpc-web auto-generated commonjs code.

Edit the vite.config.js file to enable Vite to support commonjs?

```
cd client

npm install @originjs/vite-plugin-commonjs --save-dev
```

- in vite.config.js file:
```
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default {
    plugins: [
        viteCommonjs()
    ]
}
```

```
npm run dev
```

Error:

`Uncaught ReferenceError: __require_for_vite_FubgTC is not defined`

If further edit the App.vue with
```
// solution 1, vite.config.js
import * as __require_for_vite_FubgTC from './proto/protoc-js/echo_pb';
import * as __require_for_vite_bhjJLN from './proto/protoc-js/echo_grpc_web_pb';

messages = __require_for_vite_FubgTC.default || __require_for_vite_FubgTC
services = __require_for_vite_bhjJLN.default || __require_for_vite_bhjJLN

const client = new services.EchoServiceClient('http://127.0.0.1:9090')
const request = new messages.EchoRequest()
```

Then, error:

`Uncaught ReferenceError: exports is not defined`

#### Solution 2, not working, circular structure JSON

Several reports said https://github.com/timostamm/protobuf-ts works fine with Vite, like

https://github.com/grpc/grpc-web/issues/535
https://github.com/grpc/grpc-web/issues/1242
https://zenn.dev/emiksk/articles/883d8b333ffb26

Unfortunately, I found trouble.

- Get protobuf-ts and use it to generate ts file

```
cd client

npm install @protobuf-ts/plugin

npx protoc --ts_out ./src/proto/protobuf-ts --proto_path ../proto ../proto/echo.proto
```

- Use it in App.vue
```
import { EchoRequest } from './proto/protobuf-ts/echo'
import { EchoServiceClient } from './proto/protobuf-ts/echo.client'

const client = new EchoServiceClient('http://127.0.0.1:9090')
const request = EchoRequest.fromJson({"query": "Hello Vite!"})
```

Error:

`shared.esm-bundler.js:453 Uncaught TypeError: Converting circular structure to JSON`

#### Solution 3, not working, ..

Tried to use the protoc-gen-grpc-web to generage ts code, the issue is that js_out can only generate with option `import_style=commonjs`

```
cd proto

protoc -I=. echo.proto \
  --js_out=import_style=commonjs:../client/src/proto/protoc-ts \
  --grpc-web_out=import_style=typescript,mode=grpcweb:../client/src/proto/protoc-ts
```

- in App.vue
```
import { EchoRequest } from './proto/protoc-ts/echo_pb.d.ts'
import { EchoServiceClient } from './proto/protoc-ts/EchoServiceClientPb.ts'

const client = new EchoServiceClient('http://127.0.0.1:9090')
const request = EchoRequest
```

Error: `Uncaught ReferenceError: exports is not defined`

This is the same error as in the last step of solution 1.

## Conclusion

Solution 1 seems the most promising and most useful, as it enables the vite to support commonjs, in my view.

Solution 2 seems only applicable to grpc-web itself.

The ideal solution could be grpc-web to enable `js_out=import_style=typescript`, but don't know it is in the roadmap.
