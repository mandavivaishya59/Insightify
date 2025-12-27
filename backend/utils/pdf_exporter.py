from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import io
from .dashboard_composer import fetch_image_bytes

def export_pdf(title:str, summary_text:str, chart_urls:list, dashboard_buf:io.BytesIO):
    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=A4)
    width, height = A4
    c.setFont("Helvetica-Bold", 20)
    c.drawString(40, height-80, title)
    c.setFont("Helvetica", 11)
    y = height - 110
    for line in summary_text.split("\n"):
        c.drawString(40, y, line[:120])
        y -= 14
        if y < 120:
            c.showPage()
            y = height - 60
    # Insert dashboard image
    if dashboard_buf:
        dashboard_buf.seek(0)
        img = ImageReader(dashboard_buf)
        c.showPage()
        # Adjust position and height to ensure full visibility
        c.drawImage(img, 40, 150, width=width-80, height=height-200, preserveAspectRatio=True)
    # Insert each chart on new pages
    for u in chart_urls:
        b = fetch_image_bytes(u)
        img = ImageReader(io.BytesIO(b))
        c.showPage()
        # Adjust position and height for better chart visibility
        c.drawImage(img, 40, 100, width=width-80, height=height-150, preserveAspectRatio=True)
    c.save()
    packet.seek(0)
    return packet
