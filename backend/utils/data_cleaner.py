import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any


def is_probable_date(series: pd.Series, threshold: float = 0.8) -> bool:
    """
    Detect if a column is a real date column.
    """
    if series.dtype != object:
        return False

    parsed = pd.to_datetime(series, errors="coerce", infer_datetime_format=True)
    return parsed.notna().mean() >= threshold


def clean_dataset(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Clean dataset WITHOUT corrupting categorical columns.
    """

    df = df.copy()

    report = {
        "original_rows": len(df),
        "original_columns": len(df.columns),
        "missing_filled": 0,
        "duplicates_removed": 0,
        "date_columns": [],
    }

    # -------------------------
    # 1️⃣ Clean column names
    # -------------------------
    df.columns = [c.strip() for c in df.columns]

    # -------------------------
    # 2️⃣ Handle missing values (SAFE)
    # -------------------------
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            missing = df[col].isna().sum()
            if missing:
                df[col] = df[col].fillna(df[col].median())
                report["missing_filled"] += missing
        else:
            missing = df[col].isna().sum()
            if missing:
                df[col] = df[col].fillna("Unknown")
                report["missing_filled"] += missing

    # -------------------------
    # 3️⃣ Remove duplicates
    # -------------------------
    before = len(df)
    df = df.drop_duplicates()
    report["duplicates_removed"] = before - len(df)

    # -------------------------
    # 4️⃣ Convert ONLY real date columns
    # -------------------------
    for col in df.columns:
        if is_probable_date(df[col]):
            df[col] = pd.to_datetime(df[col], errors="coerce")
            report["date_columns"].append(col)

            # Derive time features
            df["Year"] = df[col].dt.year.astype("Int64")
            df["Month Number"] = df[col].dt.month.astype("Int64")
            df["Month Name"] = df[col].dt.month_name()

    report["final_rows"] = len(df)
    report["final_columns"] = len(df.columns)

    return df, report
