import grpc

import echo_pb2
import echo_pb2_grpc

from google.protobuf.json_format import MessageToJson


def run():

  channel = grpc.insecure_channel('127.0.0.1:50051')

  stub = echo_pb2_grpc.EchoServiceStub(channel=channel)

  query = 'Hello World!'

  print(f'echo|send to server: { query }')

  response = stub.echo(echo_pb2.EchoRequest(query=query))

  print(f'echo|receive from server: { MessageToJson(response) }')


if __name__ == '__main__':
  run()

