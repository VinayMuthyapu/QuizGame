import socket
import json

def get_similarity(word1, word2):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('localhost', 65432))
    request = {'word1': word1, 'word2': word2}
    client_socket.send(json.dumps(request).encode())
    response = client_socket.recv(1024)
    client_socket.close()
    return json.loads(response.decode())

if __name__ == "__main__":
    word1 = "pen"
    word2 = "school"
    result = get_similarity(word1, word2)
    if 'similarity' in result:
        print(f"Similarity between '{word1}' and '{word2}': {result['similarity']}")
    else:
        print(f"Error: {result['error']}")