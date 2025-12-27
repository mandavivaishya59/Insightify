from fastapi import APIRouter
from backend.utils.ai_chat_engine import answer_query
from backend.utils.voice_synthesis import generate_speech
from backend.utils.chart_planner import plan_charts_from_preview
from backend.utils.quickchart_builder import build_quickchart_url
import pandas as pd
import numpy as np
import json
import os

router = APIRouter()

# Keywords that indicate user wants charts
CHART_KEYWORDS = [
    "chart", "graph", "plot", "bar chart", "pie chart", "line chart",
    "dashboard", "visualize", "visualization", "show me", "create a",
    "generate", "make a", "build a"
]

@router.post("/suggest")
async def suggest(df_json: dict):
    df = pd.DataFrame(df_json)
    numeric = df.select_dtypes(include=[np.number]).columns.tolist()
    non_numeric = df.select_dtypes(exclude=[np.number]).columns.tolist()

    suggestions = []
    if numeric and non_numeric:
        suggestions.append(f"Which {non_numeric[0]} made the highest {numeric[0]}?")
        suggestions.append(f"Show me the top 5 {non_numeric[0]} by {numeric[0]}.")
        suggestions.append(f"What is the total {numeric[0]}?")
    if len(numeric) >= 2:
        suggestions.append(f"Compare {numeric[0]} and {numeric[1]}.")
    suggestions.append("Give an overview of the dataset.")

    name = "Insightify AI"  # your AI name
    welcome = f"Hello! I am {name}. Ask me anything about your dataset."

    return {"welcome": welcome, "suggestions": suggestions}

@router.post("/ask")
async def ask_ai(data: dict):
    question = data.get("question")
    df_json = data.get("df")

    if not question or not df_json:
        return {"error": "Missing question or dataset"}

    # Check if user is asking for charts/visualizations
    is_chart_request = any(keyword in question.lower() for keyword in CHART_KEYWORDS)

    if is_chart_request:
        try:
            # Load default theme
            themes_file = os.path.join(os.path.dirname(__file__), "../themes/themes.json")
            with open(themes_file, "r") as f:
                themes = json.load(f)
            theme = themes[0]  # Use first theme as default

            # Plan charts from data preview
            plan = plan_charts_from_preview(df_json, max_charts=3)

            chart_urls = []
            for item in plan:
                if item["chart_type"] == "kpi":
                    url = build_quickchart_url(item, theme, width=600, height=200)
                else:
                    url = build_quickchart_url(item, theme, width=800, height=400)
                if url:
                    chart_urls.append(url)

            if chart_urls:
                return {
                    "type": "charts",
                    "charts": chart_urls,
                    "message": f"Generated {len(chart_urls)} charts for your request."
                }
            else:
                return {"error": "Could not generate charts from the data"}

        except Exception as e:
            return {"error": f"Chart generation failed: {str(e)}"}

    # Regular AI response for non-chart requests
    answer = answer_query(question, df_json)

    # Generate speech from the summary text
    summary_text = answer.get("summary", "")
    audio_url = None
    if summary_text:
        audio_url = generate_speech(summary_text)

    # Add audio to the response
    if audio_url:
        answer["audio"] = audio_url

    return {"response": answer}
