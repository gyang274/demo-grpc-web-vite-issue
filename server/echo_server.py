import grpc
import time

from concurrent import futures

import echo_pb2
import echo_pb2_grpc

SERVER_KEEP_ALIVE = 60 * 60 *24


class EchoService(echo_pb2_grpc.EchoServiceServicer):

  def echo(self, request, context):
    print('request:\n', request)
    response = echo_pb2.EchoResponse(reply=request.query)
    return response


def serve():
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
  echo_pb2_grpc.add_EchoServiceServicer_to_server(EchoService(), server)
  server.add_insecure_port('[::]:50051')
  server.start()
  # try:
  #   while True:
  #     time.sleep(SERVER_KEEP_ALIVE)
  # except KeyboardInterrupt:
  #   server.stop(0)
  server.wait_for_termination()


if __name__ == '__main__':
  serve()
