import pandas as pd
from io import BytesIO


def export_excel(df: pd.DataFrame) -> BytesIO:
    """
    Export cleaned DataFrame to Excel (.xlsx)
    """
    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
        df.to_excel(writer, index=False, sheet_name="Cleaned_Data")
    buffer.seek(0)
    return buffer
