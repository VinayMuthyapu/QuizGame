import gensim.downloader as api
import numpy as np
import socket
import json
import signal
import sys

# Load the pre-trained Word2Vec model once
print("Loading Word2Vec model...")
model = api.load("word2vec-google-news-300")  # This loads the pre-trained Google News Word2Vec model
print("Model loaded.")

def calculate_similarity(word1, word2):
    try:
        vector1 = model[word1]
        vector2 = model[word2]
        similarity = 1 - np.dot(vector1, vector2) / (np.linalg.norm(vector1) * np.linalg.norm(vector2))
        return similarity
    except KeyError as e:
        return f"Word not in vocabulary: {e}"

# Set up a socket server to keep the session alive
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('localhost', 65432))
server_socket.listen(1)
print("Server is ready to receive connections.")

running = True

def signal_handler(sig, frame):
    global running
    print("Shutting down the server...")
    running = False

# Register signal handler
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

while running:
    try:
        client_socket, addr = server_socket.accept()
        data = client_socket.recv(1024)
        if not data:
            break
        try:
            request = json.loads(data.decode())
            if request.get('command') == 'shutdown':
                response = {'status': 'Server shutting down...'}
                running = False
            else:
                word1 = request.get('word1')
                word2 = request.get('word2')
                if word1 and word2:
                    similarity = calculate_similarity(word1, word2)
                    response = {'similarity': similarity}
                else:
                    response = {'error': 'Invalid request'}
        except Exception as e:
            response = {'error': str(e)}
        client_socket.send(json.dumps(response).encode())
        client_socket.close()
    except Exception as e:
        print("Error:", e)
        break

server_socket.close()
print("Server has been shut down.")