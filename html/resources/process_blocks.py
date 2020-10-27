from pathlib import Path
import csv

files = Path.cwd()
for block_file in files.glob("blocks/block*.csv"):
    with block_file.open("r", encoding="utf-8-sig") as f:
        csvreader = csv.reader(f, delimiter=",")

        rows = []
        for row in csvreader:
            if not row[0]:
                continue

            column = row[0].replace("sounds/", "")
            column = column.split(".")[0]
            rows.append([column])

    with block_file.open("w", encoding="utf-8") as f:
        csvwriter = csv.writer(f, delimiter=",")

        csvwriter.writerows(rows)
