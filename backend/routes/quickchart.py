from fastapi import APIRouter
from pydantic import BaseModel
from backend.utils.quickchart_builder import build_quickchart_url

router = APIRouter()

class QCRequest(BaseModel):
    description: str
    labels: list = None
    data: list = None
    theme_id: str = None
    width: int = 800
    height: int = 400

@router.post("/quickchart")
def quickchart(req: QCRequest):
    # You can load theme info if theme_id present
    url = build_quickchart_url(req.description, labels=req.labels, data=req.data, width=req.width, height=req.height, theme_id=req.theme_id)
    return {"chart_url": url}
