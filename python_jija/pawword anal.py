import math

from collections import Counter
from decimal import Decimal, getcontext

import matplotlib.pyplot as plt


def calculate_entropy(counter):
    # Set the precision for Decimal (e.g., 28 decimal places)
    getcontext().prec = 28

    # Total number of occurrences
    total_count = Decimal(sum(counter.values()))

    # Calculate the entropy
    entropy = Decimal(0)
    for count in counter.values():
        p = Decimal(count) / total_count
        entropy -= p * (p.ln() / Decimal('0.69314718055994530941723212145818'))  # Using ln(p)/ln(2) for log2
    return entropy


def compare_entropies(H1, H2):
    ratio = 2 ** H2 / 2 ** H1
    return ratio


def get_entropy_for_passwords(passwords_file, passwords_hash_file, draw_graph=False):
    # Define all possible characters
    characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{}|:,.<>?/'

    # Initialize a dictionary to count character occurrences
    char_counts = {char: 0 for char in characters}

    # Read the file and count character occurrences
    with open(passwords_file, 'r') as file:
        for line in file:
            line = line.replace('\n', '')
            password = line.strip()
            for char in password:
                if char in char_counts:
                    char_counts[char] += 1

    if draw_graph:
        # Create lists for the graph
        chars = list(char_counts.keys())
        counts = list(char_counts.values())

        # Plotting the graph
        plt.figure(figsize=(10, 5))
        plt.bar(chars, counts, color='blue')
        plt.xlabel('Characters')
        plt.ylabel('Occurrences')
        plt.title('Character Occurrences in Passwords')
        plt.xticks()
        plt.show()

    password_entropy = calculate_entropy(Counter(char_counts))
    print('Passwords Entropy:', round(password_entropy, 4))

    all_hashes = {}
    with open(passwords_hash_file, 'r', encoding='UTF-8') as f:
        for line in f:
            line = line.replace('\n', '')
            hashes = line.split(',')
            for hashe in hashes:
                if hashe in all_hashes:
                    all_hashes[hashe] += 1
                else:
                    all_hashes[hashe] = 1

    hash_entropy = calculate_entropy(Counter(all_hashes))
    print('Hashes Entropy:', round(hash_entropy, 4))

    max_entropy = calculate_entropy(Counter({char: 1 for char in characters}))
    print('Max Possible Chars Entropy:',round(max_entropy, 4))

    print('Entropy diff:', round(compare_entropies(max_entropy, password_entropy) * 100, 4), '%')


get_entropy_for_passwords('../static/scripts/passwords_50.txt', '../static/scripts/passwords_hash.txt', True)
get_entropy_for_passwords('../static/scripts/passwords_20.txt', '../static/scripts/passwords_hash.txt', True)
get_entropy_for_passwords('../static/scripts/passwords_10.txt', '../static/scripts/passwords_hash.txt', True)
# get_entropy_for_passwords('../static/scripts/passwords_old.txt', '../static/scripts/passwords_hash_old.txt', False)


# Shuffle 50
# Passwords Entropy: 6.4594
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 99.9987 %

# Shuffle 20
# Passwords Entropy: 6.4594
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 99.9975 %

# Shuffle 10
# Passwords Entropy: 6.4593
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 99.9940 %

# Old With Words Mod
# Passwords Entropy: 5.8404
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 65.1103 %

# No Shuffle 50
# Passwords Entropy: 6.4516
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 99.4564 %

# No Shuffle 20
# Passwords Entropy: 6.4515
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 99.4484 %

# No Shuffle 10
# Passwords Entropy: 6.4515
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 99.4491 %

# Old No Words Mod
# Passwords Entropy: 5.6889
# Hashes Entropy: 8.0000
# Max Possible Chars Entropy: 6.4594
# Entropy diff: 58.6190 %

# Password_Length ^ Entropy / tries_per_second = Avg_time_to_crack

