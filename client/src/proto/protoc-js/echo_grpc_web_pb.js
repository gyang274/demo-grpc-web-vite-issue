/**
 * @fileoverview gRPC-Web generated client stub for echo
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.echo = require('./echo_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.echo.EchoServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?grpc.web.ClientOptions} options
 * @constructor
 * @struct
 * @final
 */
proto.echo.EchoServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options.format = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.echo.EchoRequest,
 *   !proto.echo.EchoResponse>}
 */
const methodDescriptor_EchoService_echo = new grpc.web.MethodDescriptor(
  '/echo.EchoService/echo',
  grpc.web.MethodType.UNARY,
  proto.echo.EchoRequest,
  proto.echo.EchoResponse,
  /**
   * @param {!proto.echo.EchoRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.echo.EchoResponse.deserializeBinary
);


/**
 * @param {!proto.echo.EchoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.RpcError, ?proto.echo.EchoResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.echo.EchoResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.echo.EchoServiceClient.prototype.echo =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/echo.EchoService/echo',
      request,
      metadata || {},
      methodDescriptor_EchoService_echo,
      callback);
};


/**
 * @param {!proto.echo.EchoRequest} request The
 *     request proto
 * @param {?Object<string, string>=} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.echo.EchoResponse>}
 *     Promise that resolves to the response
 */
proto.echo.EchoServicePromiseClient.prototype.echo =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/echo.EchoService/echo',
      request,
      metadata || {},
      methodDescriptor_EchoService_echo);
};


module.exports = proto.echo;

