"""
====================================================
INSIGHTIFY – DASHBOARD TEMPLATES
====================================================

Purpose:
✔ Define dashboard layouts by use-case
✔ Control chart order and priority
✔ Keep dashboard logic clean & reusable

Used by:
- dashboard_builder.py
- chart_planner.py
====================================================
"""

DASHBOARD_TEMPLATES = {

    # -------------------------------
    # GENERAL / DEFAULT DASHBOARD
    # -------------------------------
    "general": {
        "title": "Insightify Dashboard",
        "description": "Automatic dashboard generated from dataset",
        "layout": [
            "kpi",
            "bar",
            "line",
            "pie",
            "table"
        ]
    },

    # -------------------------------
    # SALES DASHBOARD
    # -------------------------------
    "sales": {
        "title": "Sales Performance Dashboard",
        "description": "Revenue, category, and trend analysis",
        "layout": [
            "kpi",
            "bar",      # Sales by Category
            "line",     # Sales Trend
            "pie",      # Category Share
            "table"
        ]
    },

    # -------------------------------
    # FINANCE DASHBOARD
    # -------------------------------
    "finance": {
        "title": "Financial Overview Dashboard",
        "description": "Expenses, budget, and financial trends",
        "layout": [
            "kpi",
            "line",     # Expense / Revenue Trend
            "bar",      # Category-wise expenses
            "pie",
            "table"
        ]
    },

    # -------------------------------
    # SCHOOL / EDUCATION DASHBOARD
    # -------------------------------
    "school": {
        "title": "Student Performance Dashboard",
        "description": "Academic scores and distribution analysis",
        "layout": [
            "kpi",
            "bar",      # Marks by Student / Subject
            "pie",      # Grade Distribution
            "line",     # Performance Trend
            "table"
        ]
    },

    # -------------------------------
    # MARKETING DASHBOARD
    # -------------------------------
    "marketing": {
        "title": "Marketing Analytics Dashboard",
        "description": "Campaign performance and engagement",
        "layout": [
            "kpi",
            "bar",
            "line",
            "pie",
            "table"
        ]
    }
}
