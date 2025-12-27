@router.post("/generate-dashboard")
async def generate_dashboard(payload: dict):
    data = payload["data"]
    theme = payload.get("theme", "light")
    template = payload.get("template", "general")

    plans = plan_charts_from_preview(data)

    plans = apply_dashboard_template(plans, template)

    charts = []
    for plan in plans:
        chart_config = convert_plan_to_chartjs(plan)
        chart_url = build_quickchart(chart_config, theme)
        charts.append({
            "type": plan["chart_type"],
            "url": chart_url,
            "title": plan["description"]
        })

    return {
        "template": template,
        "theme": theme,
        "charts": charts
    }
