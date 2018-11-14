# Gijs Beerens
# 10804463

import csv
import pandas
import matplotlib.pyplot as plt
import json

# define csv used for processing
INPUT_CSV = "input.csv"

# convert csv to empty list
list = []
with open(INPUT_CSV) as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    for row in csvReader:
        list.append(row)

# skip emty lists in list
countries = []
for row in list[0::2]:
        countries.append(row)

# parse data, fill empty/error fields
dataset = []
for country in countries:
    name = country[0]
    region = country[1]
    pop_density = country[4].replace(",", ".")
    try:
        float(pop_density)
    except ValueError:
        pop_density = None
    infant_mort = country[7].replace(",", ".")
    try:
        float(infant_mort)
    except ValueError:
        infant_mort = None
    GDP_cap = country[8].split(" ")
    GDP_cap = GDP_cap[0]
    if not GDP_cap.isdigit():
        GDP_cap = None

    data = []
    data.append(name)
    data.append(region)
    data.append(pop_density)
    data.append(infant_mort)
    data.append(GDP_cap)
    dataset.append(data)
dataset[0][-1] = "GDP($ per capita)"
dataset[0][3] = "Infant mortality (per 1000 births)"
dataset[0][2] = "Pop. Density (per sq. mi.)"

# convert dataset to dataframe
headers = dataset.pop(0)
df = pandas.DataFrame(dataset, columns=headers)

# convert infant mortality and gdp to numbers
df["Infant mortality (per 1000 births)"] = pandas.to_numeric(df["Infant mortality (per 1000 births)"])
df["GDP($ per capita)"] = pandas.to_numeric(df["GDP($ per capita)"])
df_IMR = df["Infant mortality (per 1000 births)"]
df_GDP = df["GDP($ per capita)"]

# compute gdp data
mean = df_GDP.mean()
medianGDP = df_GDP.median()
mode = df_GDP.mode()
std_dev = df_GDP.std()

# compute infant mortality rate data
firstq = df_IMR.quantile(.25)
thirdq = df_IMR.quantile(.75)
medianIMR = df_IMR.median()
minimum = df_IMR.quantile(0)
maximum = df_IMR.quantile(1)

# print gdp data
print("***DATA GDP/Capita***")
print("Average gdp per capita(mean): ", mean)
print("Mode gdp capita:              ", mode)
print("Standard deviation gdp capita:", std_dev)
print("Median gdp capita:            ", medianGDP, "\n\n")

# print infant mortality rate data
print("***FIVE No. SUMMARY INFANT MORTALITY RATE***")
print("Minimum:       ", minimum)
print("First Quartile:", firstq)
print("Median:        ", medianIMR)
print("Third Quartile:", thirdq)
print("Maximum:       ", maximum)

# create and plot gdp histogram
df_GDP.hist(bins="auto")
plt.title("data GDP/capita world countries")
plt.show()

# create infant mortality boxplot file
with open("boxplot.pdf", "w") as outfile:
    boxplot = df.boxplot(column="Infant mortality (per 1000 births)", return_type="axes")
    plt.savefig("boxplot.pdf")

# modify index to countries
df = df.set_index("Country")

# create jsonfile
jsonfile = json.loads(df.to_json(orient="index"))
with open('data.json', 'w') as outfile:
    json.dump(jsonfile, outfile)
