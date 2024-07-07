import os
from openai import OpenAI

# Replace with your actual OpenAI API key
client = OpenAI(
    # This is the default and can be omitted
    api_key="<OpenAI Key>",
)

# Define the messages you want to send to the API
messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "[Apple,Orange,Grape,Peach] from the above list of words which word is closely related to blue berry? answer in one word"}
]

# Make a request to the API
response = client.chat.completions.create(
    messages=messages,
    model="gpt-3.5-turbo"
)

# Print the response message
print(response.choices[0].message.content)

