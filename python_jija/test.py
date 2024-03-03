import matplotlib.pyplot as plt

import matplotlib.pyplot as plt
from collections import Counter
import math


def func_modulo(i, x):
    return i % x


def func_ceil(i, x):
    return math.ceil(i / (256 / x))


def divide_and_count(x):
    # Dividing each number in the range 0 to 255 by x and storing the results
    division_results = [func_ceil(i, x) for i in range(256)]

    # Counting the occurrences of each number in the results
    occurrences = Counter(division_results)

    return occurrences

# Example usage with x = 10
occurrences = divide_and_count(88)

def plot_occurrences_with_separators(occurrences):
    # Preparing data for plotting
    numbers = list(occurrences.keys())
    counts = list(occurrences.values())

    # Plotting the data with separators (edges) for the bars
    plt.figure(figsize=(10, 6))
    plt.bar(numbers, counts, color='blue', edgecolor='black', linewidth=1)
    plt.xlabel('Result of Division')
    plt.ylabel('Occurrences')
    plt.title('Occurrences of Division Results with Separators')
    plt.show()

# Plotting the occurrences with separators for the same example (x = 10)
plot_occurrences_with_separators(occurrences)
