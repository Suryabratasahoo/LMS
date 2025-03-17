import numpy as np

def histogram_equalization(matrix):
    # Calculate histogram
    histogram, bins = np.histogram(matrix.flatten(), bins=np.arange(0, 16))

    # Calculate CDF
    cdf = histogram.cumsum()

    # Normalize CDF
    normalized_cdf = cdf / cdf[-1]

    # Map intensities
    new_intensities = np.round(normalized_cdf * 15).astype(int)  # Assuming output range is 0-15

    # Replace original intensities with new intensities
    equalized_matrix = new_intensities[matrix.flatten()].reshape(matrix.shape)

    return equalized_matrix

# Given matrix
matrix = np.array([[10, 12, 8, 9],
                   [10, 12, 12, 14],
                   [12, 13, 10, 9],
                   [14, 12, 10, 12]])

# Apply histogram equalization
equalized_matrix = histogram_equalization(matrix)

print("Original Matrix:")
print(matrix)
print("\nEqualized Matrix:")
print(equalized_matrix)