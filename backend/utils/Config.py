# Configuration file for backend settings

# API Keys and Secrets
OPENAI_API_KEY = "your-openai-api-key-here"
GROQ_API_KEY = "your-groq-api-key-here"
MURF_API_KEY = "your-murf-api-key-here"

# Database settings (if needed)
DATABASE_URL = "sqlite:///./insightify.db"

# File upload settings
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = ['csv', 'xlsx', 'xls']

# Other settings
DEBUG = True
SECRET_KEY = "your-secret-key-here"
