const grpc = require('grpc')

const messages = require('./echo_pb')
const services = require('./echo_grpc_pb')


function doEcho (call, callback) {
  let res = new messages.EchoResponse()
  console.log(
    'echo_server|doEcho|receive query from client:', call.request.getQuery()
  )
  res.setReply('echo: ' + call.request.getQuery())
  callback(null, res)
}


function createEchoServer () {
  let server = new grpc.Server()
  server.addService(
    services.EchoServiceService, {
      echo: doEcho
    }
  )
  return server
}


if (require.main === module) {
  let server = createEchoServer()
  server.bind(
    '127.0.0.1:50051', grpc.ServerCredentials.createInsecure()
  )
  server.start()
}


module.exports.createEchoServer = createEchoServer
