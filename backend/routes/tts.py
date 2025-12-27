from fastapi import APIRouter
from pydantic import BaseModel
from backend.utils.voice_synthesis import generate_speech

router = APIRouter()

class TTSRequest(BaseModel):
    text: str

@router.post("/tts")
def text_to_speech(req: TTSRequest):
    audio = generate_speech(req.text)
    if not audio:
        return {"success": False}

    return {
        "success": True,
        "audio": audio
    }
