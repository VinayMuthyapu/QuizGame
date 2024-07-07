import openai

# Replace with your actual OpenAI API key
api_key = open("API_KEY","r").read()

# Authenticate with the API
openai.api_key = api_key

# Define the messages you want to send to the API
messages = [
    {"role": "user", "content": "What is the capital of France?"}
]

# Make a request to the API
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",  # Updated model
    messages=messages
)

# Print the response message
print(response['choices'][0]['message']['content'].strip())
