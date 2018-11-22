import csv
import json
import pandas as pd

csv_data = "appledata.csv"

csvfile = open(csv_data, "r")

df = pd.read_csv(csv_data)

jsonfile = json.loads(df.to_json(orient="index"))
with open('appletje.json', 'w') as outfile:
    json.dump(jsonfile, outfile)
