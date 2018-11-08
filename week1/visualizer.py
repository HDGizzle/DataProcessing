#!/usr/bin/env python
# Gijs Beerens
# 10804463
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt



# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}


data = open(INPUT_CSV, "r")
data = csv.reader(data)
for lines in data:
    year = lines[2]
    rating = (lines[1])
    if year.isdigit():
        data_dict[year].append(float(rating))

for year in data_dict:
    data_dict[year] = sum(data_dict[year]) / len(data_dict[year])

# Global dictionary for the data


if __name__ == "__main__":
    print(data_dict)
    #plt.bar(*zip(*sorted(data_dict.items())))
    plt.bar(*zip(*sorted(data_dict.items())))
    plt.show()
    plt.plot(*zip(*sorted(data_dict.items())))
    plt.show()
