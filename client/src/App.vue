<template>
  <div class="home">
    <!-- check -->
    <!-- 
      <h1>Connect grpc-web with Vite</h1>
      <hr>
      <h2>
        Show EchoRequest message: {{ '' + request }}
      </h2>
      <hr>
      <h2>
        Show EchoClientService: {{ '' + client }}
      </h2> 
    -->
    <h1>Demo grpc-web with Vite</h1>
    <br>
    <div>
      Enter your message: <input v-model="msg">
    </div>
    <div>
      <button
        class="button"
        @click="getReply"
      >
        Send Messages to GRPC Server
      </button>
    </div>
    <div
      class="response"
    >
      Response from Server:
      <li v-for="(m, i) in msgs" :key="i">
        {{ m }}
      </li>
    </div>
  </div>
</template>

<script setup>
// original, using the protoc-gen-grpc-web generated js code
// messages = require('./proto/protoc-js/echo_pb')
// services = require('./proto/protoc-js/echo_grpc_web_pb')

// const client = new services.EchoServiceClient('http://127.0.0.1:9090')
// const request = new messages.EchoRequest()


// // solution 1, vite.config.js
// import * as __require_for_vite_FubgTC from './proto/protoc-js/echo_pb';
// import * as __require_for_vite_bhjJLN from './proto/protoc-js/echo_grpc_web_pb';

// messages = __require_for_vite_FubgTC.default || __require_for_vite_FubgTC
// services = __require_for_vite_bhjJLN.default || __require_for_vite_bhjJLN

// const client = new services.EchoServiceClient('http://127.0.0.1:9090')
// const request = new messages.EchoRequest()


// // solution 2, use protobuf-ts
import { ref } from 'vue'

import { EchoRequest } from './proto/protobuf-ts/echo'
import { EchoServiceClient } from './proto/protobuf-ts/echo.client'
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport"

const client = new EchoServiceClient(
  new GrpcWebFetchTransport({
    baseUrl: 'http://127.0.0.1:9090'
  })
)

const msg = ref('')
const msgs = ref([])

const getReply = () => {

  let request = EchoRequest.fromJson({
    "query": msg.value
  })

  client.echo(
    request
  ).then(
    (res) => {
      let { response } = res
      console.log(response.reply)
      msgs.value.push(response.reply)
    }
  )

}

// // solution 3, use protoc-gen-grpc-web with typescript
// import { EchoRequest } from './proto/protoc-ts/echo_pb.d.ts'
// import { EchoServiceClient } from './proto/protoc-ts/EchoServiceClientPb.ts'

// const client = new EchoServiceClient('http://127.0.0.1:9090')
// const request = EchoRequest

</script>

<style lang="scss" scoped>
.home {

  font-size: 24px;
  font-family: 'Fira Sans';
  text-align: center;

  input {
    height: 36px;
    width: 100%;
    font-size: 24px;
    font-family: 'Fira Sans';
    border-radius: 8px;
    margin: 16px;
  }

  button {
    font-size: 24px;
    font-family: 'Fira Sans';
  }

  .response {
    text-align: left;
    margin: 16px;
  }
}
</style>