def plan_charts_from_preview(preview, max_charts=4):
    plans = []

    columns = preview[0].keys()

    if "Sales" in columns and "Segment" in columns:
        plans.append({
            "chart_type": "bar",
            "x": "Segment",
            "y": "Sales",
            "title": "Sales by Segment"
        })

    if "Sales" in columns and "Year" in columns:
        plans.append({
            "chart_type": "line",
            "x": "Year",
            "y": "Sales",
            "title": "Sales Trend by Year"
        })

    if "Profit" in columns and "Segment" in columns:
        plans.append({
            "chart_type": "bar",
            "x": "Segment",
            "y": "Profit",
            "title": "Profit by Segment"
        })

    return plans[:max_charts]
