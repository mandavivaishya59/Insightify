from backend.utils.dashboard_templates import DASHBOARD_TEMPLATES

def apply_dashboard_template(plans, template_id="general"):
    template = DASHBOARD_TEMPLATES.get(
        template_id,
        DASHBOARD_TEMPLATES["general"]
    )

    ordered = []
    layout = template["layout"]

    for chart_type in layout:
        for plan in plans:
            if plan["chart_type"] == chart_type:
                ordered.append(plan)
                break

    return ordered

