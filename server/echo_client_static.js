const grpc = require('grpc')

const messages = require('./echo_pb')
const services = require('./echo_grpc_pb')

function doEchoService () {
  // connect directly to server
  let client = new services.EchoServiceClient(
    '127.0.0.1:50051', grpc.credentials.createInsecure()
  )
  // // connect through envoy proxy 
  // let client = new services.EchoServiceClient(
  //   '127.0.0.1:9090', grpc.credentials.createInsecure()
  // )

  let req = new messages.EchoRequest()
  let msg = 'Hello World!'

  console.log('doEchoService|send to server:', msg)

  req.setQuery(msg)

  client.echo(
    req, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log('doEchoService|receive from server:', res.getReply())
      }
    }
  )
}

// if (require.main === 'module') {
//   doEchoService()
// }

// module.exports.doEchoService = doEchoService

doEchoService()