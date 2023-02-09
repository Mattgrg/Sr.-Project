def get_url(host, port, path):
    return f"http://{host}:{port}/{path}"

class Smart_Hub_API:
    HOST = "localhost"
    PORT = "8000"
    PING = get_url(HOST, PORT, "ping")
    COMMAND = get_url(HOST, PORT, "command")


