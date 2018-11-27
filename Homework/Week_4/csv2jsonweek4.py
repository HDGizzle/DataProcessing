import csv
import json
import pandas as pd

csv_data = "data.csv"

csvfile = open(csv_data, "r")

df = pd.read_csv(csv_data)

df = df.groupby('TIME')["Value"].agg("mean")


jsonfile = json.loads(df.to_json(orient="index"))


keys = list(jsonfile.keys())
values = list(jsonfile.values())

length_list = len(keys)

data = []
for i in range(length_list):
    set = []
    set.append(keys[i])
    set.append(values[i])
    data.append(set)

headers = ["Time", "Value"]

df = pd.DataFrame(data, columns=headers)

jsonfile = json.loads(df.to_json(orient="records"))

print(jsonfile)
with open('Week4data.json', 'w') as outfile:
    json.dump(jsonfile, outfile)
