import pandas as pd

guesses_per_second = 100_000_000_000

symbol_guesses = [10, 42]
num_words_options = [2, 4]  # Either 3 or 4 words
words_list_sizes = [1000, 10000]  # Size of the word list
chars_between = [1, 3]  # Maximum of 2 characters between words
mod_probabilities = [5, 8]  # 50% probability of word modification


def estimate_crack_time(total_combinations):

    time_to_crack = total_combinations / guesses_per_second

    seconds_in_day = 60 * 60 * 24

    days_to_crack = time_to_crack / seconds_in_day

    return days_to_crack


def calculate_password_strength(num_words, word_list_size, character_pool_size, max_chars_between, mod_probability):
    """
    Calculate the password strength based on the given formula.

    Parameters:
    - num_words: Number of words in the password (3 or 4).
    - word_list_size: The size of the word list.
    - character_pool_size: The size of the characters pool which includes numbers and may include symbols.
    - max_chars_between: The maximum number of characters that can be inserted between words (0 to 2).
    - mod_probability: The probability that a word will be modified (50% represented as 0.5).

    Returns:
    The total strength in terms of possible combinations.
    """
    # The number of possible combinations for word selection
    word_combinations = word_list_size ** num_words

    # The number of possible combinations for characters inserted between words
    # (+1 to account for the possibility of no characters being inserted)
    char_insert_combinations = (character_pool_size * max_chars_between + 1) ** (num_words - 1)

    # The number of possible combinations for word modification
    # (assuming each word can be modified once with any character from the pool)
    word_mod_combinations = (1 + mod_probability * (character_pool_size - 1)) ** num_words

    # Total strength is the product of the three factors
    total_strength = word_combinations * char_insert_combinations * word_mod_combinations

    return total_strength

rows = []
for symbol_guess in symbol_guesses:
    for num_words_option in range(num_words_options[0], num_words_options[1]+1):
        for words_list_size in range(words_list_sizes[0], words_list_sizes[1]+1, 100):
            for char_between in range(num_words_options[0], num_words_options[1]+1):
                for mod_probability in range(mod_probabilities[0], mod_probabilities[1]+1):
                    total_strength = calculate_password_strength(num_words_option,
                                                                 words_list_size,
                                                                 symbol_guess,
                                                                 char_between,
                                                                 mod_probability/10)
                    days_to_crack = estimate_crack_time(total_strength)
                    new_row = {'num_words': num_words_option, 'word_list_size': words_list_size,
                               'chars_between': char_between, 'mod_probability': mod_probability/10,
                               'symbol_guesses': symbol_guess, 'total_strength': total_strength,
                               'days_to_crack': days_to_crack}
                    rows.append(new_row)

df = pd.DataFrame(columns=['num_words',
                           'word_list_size',
                           'chars_between',
                           'mod_probability',
                           'symbol_guesses',
                           'total_strength',
                           'days_to_crack'], data=rows)

pass
df.to_csv('password_strength.csv')












