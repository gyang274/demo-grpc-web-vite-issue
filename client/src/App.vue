<template>
  <div class="home">
    <h1>Connect grpc-web with Vite</h1>
    <hr>
    <h2>
      Show EchoRequest message: {{ request }}
    </h2>
    <hr>
    <h2>
      Show EchoClientService: {{ client }}
    </h2>
  </div>
</template>

<script setup>
// original, using the protoc-gen-grpc-web generated js code
messages = require('./proto/protoc-js/echo_pb')
services = require('./proto/protoc-js/echo_grpc_web_pb')

const client = new services.EchoServiceClient('http://127.0.0.1:9090')
const request = new messages.EchoRequest()


// // solution 1, vite.config.js
// import * as __require_for_vite_FubgTC from './proto/protoc-js/echo_pb';
// import * as __require_for_vite_bhjJLN from './proto/protoc-js/echo_grpc_web_pb';

// messages = __require_for_vite_FubgTC.default || __require_for_vite_FubgTC
// services = __require_for_vite_bhjJLN.default || __require_for_vite_bhjJLN

// const client = new services.EchoServiceClient('http://127.0.0.1:9090')
// const request = new messages.EchoRequest()


// // solution 2, use protobuf-ts
// import { EchoRequest } from './proto/protobuf-ts/echo'
// import { EchoServiceClient } from './proto/protobuf-ts/echo.client'

// const client = new EchoServiceClient('http://127.0.0.1:9090')
// const request = EchoRequest


// // solution 3, use protoc-gen-grpc-web with typescript
// import { EchoRequest } from './proto/protoc-ts/echo_pb.d.ts'
// import { EchoServiceClient } from './proto/protoc-ts/EchoServiceClientPb.ts'

// const client = new EchoServiceClient('http://127.0.0.1:9090')
// const request = EchoRequest

</script>