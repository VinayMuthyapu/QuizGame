from collections import Counter
from math import sqrt

def word_vectorizer(text, smoothing=1):
    """
    Creates a word vector based on word frequency in the text with smoothing.

    Args:
        text: A list of words (document).
        smoothing: A small value to add to all word counts (default: 1).

    Returns:
        A dictionary representing the word vector (word: frequency).
    """
    word_counts = Counter(text)
    total_words = sum(word_counts.values()) + smoothing * len(word_counts)  # Add smoothing factor
    return {word: (count + smoothing) / total_words for word, count in word_counts.items()}

def cosine_similarity(vec1, vec2):
    """
    Calculates cosine similarity between two word vectors.

    Args:
        vec1: First word vector (dictionary).
        vec2: Second word vector (dictionary).

    Returns:
        Cosine similarity score (float between -1 and 1).
    """
    print(f" list1: {vec1} list2: {vec2}")
    dot_product = sum(vec1.get(word, 0) * vec2.get(word, 0) for word in set(vec1.keys() | vec2.keys()))
    magnitude1 = sqrt(sum(val**2 for val in vec1.values()))
    magnitude2 = sqrt(sum(val**2 for val in vec2.values()))
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0
    else:
        return dot_product / (magnitude1 * magnitude2)

def find_similar_words(word, word_list, top_n=10):
    """
    Finds the most similar words to a given word in a word list using cosine similarity.

    Args:
        word: The word to compare with (string).
        word_list: List of words (documents).
        top_n: Number of most similar words to return (default: 10).

    Returns:
        A list of tuples containing (word, similarity score) for the top N similar words.
    """
    word_vector = word_vectorizer(word_list)
    word_similarities = [(doc, cosine_similarity(word_vector, word_vectorizer([doc]))) for doc in word_list]
    word_similarities.sort(key=lambda x: x[1], reverse=True)  # Sort by descending similarity
    return word_similarities[:top_n]  # Return top N similar words

# Example usage
word_list = ["apple", "banana", "orange", "juice", "mango", "pineapple", "sweet", "tropical", "tart", "healthy", "breakfast", "snack"]
input_word = "fruit"
top_similar_words = find_similar_words(input_word, word_list, top_n=10)

print(f"Top {len(top_similar_words)} similar words to '{input_word}':")
for word, similarity in top_similar_words:
    print(f"- '{word}': {similarity:.4f}")