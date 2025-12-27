from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd

from backend.utils.ai_chat_engine import generate_logical_summary

router = APIRouter()


class SummaryRequest(BaseModel):
    preview: List[Dict[str, Any]]
    user_id: Optional[str] = None


@router.post("/summary")
def summary(req: SummaryRequest):
    """
    Generate a deterministic, dataset-aware summary.
    No generative AI is used here — logic only.
    """

    # Convert preview data to DataFrame
    df = pd.DataFrame(req.preview)

    # ✅ Guard: empty dataset
    if df.empty:
        return {
            "summary": (
                "Dataset is empty or not received correctly. "
                "Please upload a dataset before requesting a summary."
            )
        }

    try:
        # ✅ Correct variable usage
        summary_text = generate_logical_summary(df)

        return {
            "summary": summary_text
        }

    except Exception as e:
        # Safe fallback
        rows, cols = df.shape
        return {
            "summary": (
                f"Dataset loaded with {rows:,} rows and {cols} columns. "
                f"Summary generation failed due to an internal error: {str(e)}"
            )
        }
