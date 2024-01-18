import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Load the data
file_path = 'password_strength.csv'
password_strength_df = pd.read_csv(file_path, index_col=0)

password_strength_df.drop(columns=['total_strength'], inplace=True)

# Calculate the correlation matrix focusing on the 'days_to_crack' variable
correlation_matrix = password_strength_df.corr()['days_to_crack'].sort_values()


# Create a bar plot for the correlations
plt.figure(figsize=(10, 8))
sns.barplot(x=correlation_matrix.index, y=correlation_matrix.values)
plt.title('Correlation of Variables with Days to Crack')
plt.xlabel('Variables')
plt.ylabel('Correlation Coefficient')
plt.xticks(rotation=45)
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()
