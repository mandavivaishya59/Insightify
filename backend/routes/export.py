from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from backend.utils.dashboard_composer import compose_dashboard_from_urls
from backend.utils.pdf_exporter import export_pdf
from backend.utils.excel_exporter import export_excel
import pandas as pd
import base64

router = APIRouter()

@router.post("/export/excel")
def export_excel_api(payload: dict):
    df = pd.DataFrame(payload.get("data", []))

    buffer = export_excel(df)

    return Response(
        content=buffer.read(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=insightify_data.xlsx"
        }
    )

@router.post("/export/pdf")
def export_pdf_api(payload: dict):
    title = payload.get("title", "Insightify Report")
    summary = payload.get("summary", "")
    charts = payload.get("charts", [])

    buffer = export_pdf(title, summary, charts, None)

    return Response(
        content=buffer.read(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=insightify_report.pdf"
        }
    )


class ExportDashboardRequest(BaseModel):
    title: str
    charts: List[str]
    summary: Optional[str] = ""


@router.post("/export-dashboard")
def export_dashboard(req: ExportDashboardRequest):
    try:
        # compose dashboard PNG
        dashboard_buf = compose_dashboard_from_urls(req.charts, title=req.title)

        # create PDF containing dashboard + charts
        pdf_buf = export_pdf(req.title, req.summary or "", req.charts, dashboard_buf)

        dash_b64 = base64.b64encode(dashboard_buf.getvalue()).decode("utf-8") if dashboard_buf else None
        pdf_b64 = base64.b64encode(pdf_buf.getvalue()).decode("utf-8") if pdf_buf else None

        return {"dashboard_png_b64": dash_b64, "pdf_b64": pdf_b64}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

