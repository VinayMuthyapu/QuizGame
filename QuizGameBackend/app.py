from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Replace with your actual OpenAI API key
client = OpenAI(
    # This is the default and can be omitted
    api_key="<OpenAI access key>",
)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json

    # Define the messages you want to send to the API
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": data['user_input']}
    ]

    try:
        # Make a request to the OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        # Extract the response content
        answer = response.choices[0].message.content

        return jsonify({"response": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)