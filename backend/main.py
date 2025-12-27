from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.upload import router as upload_router
from backend.routes.export import router as export_router
from backend.routes.chat import router as chat_router
from backend.routes.auto_dashboard import router as auto_router
from backend.routes.quickchart import router as qc_router
from backend.routes.summary import router as summary_router
from backend.routes.tts import router as tts_router

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api")
app.include_router(export_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(auto_router, prefix="/api")
app.include_router(qc_router, prefix="/api")
app.include_router(summary_router, prefix="/api")
app.include_router(tts_router, prefix="/api")

@app.get("/")
def home():
    return {"message": "Insightify Backend Running 🚀"}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
