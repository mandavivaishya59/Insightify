

"""
====================================================
INSIGHTIFY – DATASET UPLOAD & PREPROCESSING ROUTE
====================================================

Responsibilities of this file:
✔ Accept dataset uploads (CSV, Excel, JSON, XML)
✔ Enforce size & row limits
✔ Convert dataset → pandas DataFrame
✔ Apply SAFE data cleaning (no NaT corruption)
✔ Send CLEAN preview data to frontend
✔ NEVER alter datatypes incorrectly

This file is the ONLY gateway for raw data.
====================================================
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import numpy as np
from ..utils.data_cleaner import clean_dataset
import tempfile
import os
import json
import xml.etree.ElementTree as ET


def to_json_safe(obj):
    """
    Recursively convert numpy / pandas objects
    into JSON-serializable Python types.
    """
    if isinstance(obj, dict):
        return {k: to_json_safe(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [to_json_safe(v) for v in obj]

    if isinstance(obj, (np.integer,)):
        return int(obj)

    if isinstance(obj, (np.floating,)):
        return float(obj)

    if isinstance(obj, (pd.Timestamp,)):
        return obj.isoformat()

    if pd.isna(obj):
        return None

    return obj

router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and preprocess dataset safely.
    Supported formats: CSV, XLSX, XLS, JSON, XML
    Max file size: 20MB
    Max rows processed: 10,000
    """

    # -------------------------------
    # 1️⃣ Save uploaded file temporarily
    # -------------------------------
    suffix = os.path.splitext(file.filename)[1].lower()
    file_size = 0
    chunk_size = 1024 * 1024  # 1MB
    tmp_path = None

    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp_path = tmp.name

            while True:
                chunk = await file.read(chunk_size)
                if not chunk:
                    break

                tmp.write(chunk)
                file_size += len(chunk)

                # Enforce 20MB limit
                if file_size > 20 * 1024 * 1024:
                    raise HTTPException(
                        status_code=400,
                        detail="File too large. Maximum size allowed is 20MB."
                    )

        # -------------------------------
        # 2️⃣ Load file into DataFrame
        # -------------------------------
        if suffix == ".csv":
            df = pd.read_csv(tmp_path, nrows=10000)

        elif suffix in [".xlsx", ".xls"]:
            df = pd.read_excel(tmp_path, nrows=10000)

        elif suffix == ".json":
            with open(tmp_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # JSON can be list-of-dicts or dict-of-lists
            if isinstance(data, list):
                df = pd.DataFrame(data[:10000])
            elif isinstance(data, dict):
                df = pd.DataFrame.from_dict(data, orient="index").reset_index().head(10000)
            else:
                raise HTTPException(status_code=400, detail="Unsupported JSON structure")

        elif suffix == ".xml":
            tree = ET.parse(tmp_path)
            root = tree.getroot()

            rows = []
            for i, record in enumerate(root):
                if i >= 10000:
                    break
                row = {child.tag: child.text for child in record}
                rows.append(row)

            df = pd.DataFrame(rows)

        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")

        # -------------------------------
        # 3️⃣ Apply SAFE data cleaning
        # -------------------------------
        cleaned_df, cleaning_report = clean_dataset(df)

        # -------------------------------
        # 4️⃣ Prepare preview data
        # -------------------------------
        # Full preview for small datasets, otherwise top 20 rows
        preview_df = (
            cleaned_df if len(cleaned_df) <= 100 else cleaned_df.head(20)
        )

        def serialize_df(df: pd.DataFrame):
            df = df.copy()

            # Convert datetime columns
            for col in df.columns:
                if pd.api.types.is_datetime64_any_dtype(df[col]):
                    df[col] = df[col].dt.strftime("%Y-%m-%d")

            # Convert numpy types → python types
            return json.loads(
                df.to_json(orient="records", date_format="iso")
            )

        # -------------------------------
        # 5️⃣ Send response to frontend
        # -------------------------------
        return {
            "filename": file.filename,
            "rows": int(len(cleaned_df)),
            "columns": cleaned_df.columns.tolist(),
            "preview": serialize_df(preview_df),
            "cleaning_report": {
                k: int(v) if isinstance(v, (np.integer,)) else v
                for k, v in cleaning_report.items()
            },
            "status": "File cleaned and processed"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to process file: {str(e)}"
        )

    finally:
        # -------------------------------
        # 6️⃣ Always clean up temp file
        # -------------------------------
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
