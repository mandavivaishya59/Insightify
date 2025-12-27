import csv
import json
import io

def export_csv_from_preview(preview_rows):
    # returns bytes CSV
    if not preview_rows:
        return None
    fieldnames = list(preview_rows[0].keys())
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=fieldnames)
    writer.writeheader()
    for r in preview_rows:
        writer.writerow(r)
    return buf.getvalue().encode('utf-8')

def powerbi_theme_json(theme):
    # simple Power BI theme JSON
    dataColors = theme.get("colors", ["#00AEEF","#F45B69","#2ECC71","#FFC300"])
    theme_json = {
        "name": theme.get("name","Insightify Theme"),
        "dataColors": dataColors,
        "background": theme.get("background","#ffffff"),
        "foreground": "#333333",
        "tableAccent": dataColors[0]
    }
    return json.dumps(theme_json)

def tableau_tdsx_stub():
    # Provide instructions or a TDS template file generator later.
    return "<tds>Not implemented - use csv + theme</tds>"
