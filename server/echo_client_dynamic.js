const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = __dirname + '/../proto/echo.proto'

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
)

const echo_proto = grpc.loadPackageDefinition(packageDefinition).echo


function doEchoService () {

  // connect directly to server
  let client = new echo_proto.EchoService(
    '127.0.0.1:50051', grpc.credentials.createInsecure()
  )
  // // connect through envoy proxy 
  // let client = new echo_proto.EchoService(
  //   '127.0.0.1:9090', grpc.credentials.createInsecure()
  // )
  
  console.log(
    'doEchoService|send to server:', {'query': 'Hello World!'}
  )

  // getChromaticProfileFromImage64WithPromise
  client.echo(
    {'query': 'Hello World!'}, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log('doEchoService|receive from server:', res)
      }
    }
  )
    
}

doEchoService()
