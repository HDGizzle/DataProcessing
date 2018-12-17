import csv
import json
import pandas as pd

csv_data = "hpi-data-2016.csv"

csvfile = open(csv_data, "r")

df = pd.read_csv(csv_data)




df['InequalityOutcomes'] = df['InequalityOutcomes'].map(lambda x: x.rstrip('%'))



print(df["InequalityOutcomes"])

jsonfile = json.loads(df.to_json(orient="records"))
# print(jsonfile)
with open('JSONlinkedviews.json', 'w') as outfile:
    json.dump(jsonfile, outfile)
