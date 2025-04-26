import http.server
import ssl

PORT = 8888
CERT_FILE = 'server.pem'

server_address = ('127.0.0.1', PORT)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Modern SSL context
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile=CERT_FILE)

httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Serving HTTPS on https://127.0.0.1:{PORT}")
httpd.serve_forever()
