import requests
from backend.utils.Config import MURF_API_KEY


def generate_speech(text: str) -> str:
    """
    Generate speech from text using Murf AI API.
    Returns base64 encoded audio data.
    """
    try:
        # Murf API endpoint for text-to-speech
        url = "https://api.murf.ai/v1/speech/generate"

        headers = {
            "Authorization": f"Bearer {MURF_API_KEY}",
            "Content-Type": "application/json"
        }

        # Murf API payload
        payload = {
            "voice_id": "en-US-natalie",  # You can change this to different voices
            "text": text,
            "speed": 1.0,
            "pitch": 0.0,
            "sample_rate": 44100,
            "format": "MP3"
        }

        # Make the API request
        response = requests.post(url, json=payload, headers=headers)

        if response.status_code == 200:
            result = response.json()
            # Return the audio URL or base64 data
            if "audio_url" in result:
                return result["audio_url"]
            elif "audio_base64" in result:
                return result["audio_base64"]
            else:
                print("Unexpected response format from Murf API")
                return None
        else:
            print(f"Murf API Error: {response.status_code} - {response.text}")
            return None

    except Exception as e:
        print(f"Voice synthesis error: {str(e)}")
        return None


def get_available_voices():
    """
    Get list of available voices from Murf API.
    """
    try:
        url = "https://api.murf.ai/v1/voices"
        headers = {
            "Authorization": f"Bearer {MURF_API_KEY}"
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to get voices: {response.status_code}")
            return []

    except Exception as e:
        print(f"Error getting voices: {str(e)}")
        return []
