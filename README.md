# Insightify Project

## Backend Setup and Run

1. Navigate to the `backend` directory:
```
cd backend
```

2. Create a Python virtual environment and activate it:
- On Windows (cmd):
```
python -m venv venv
venv\Scripts\activate
```
- On Unix/Linux/macOS (bash):
```
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```
pip install -r requirements.txt
```

4. Set the OpenAI API key environment variable:
```
set OPENAI_API_KEY=your_openai_api_key_here
```
(On Unix/Linux/macOS use `export` instead of `set`)

5. Run the FastAPI backend server:
```
uvicorn main:app --reload
```
The backend server will start on http://127.0.0.1:8000

## Frontend Setup and Run

1. Navigate to the `frontend` directory:
```
cd frontend
```

2. Install npm dependencies:
```
npm install
```

3. Start the React development server:
```
npm start
```
The frontend app will start and usually open at http://localhost:3000

## Notes

- Ensure you have Python 3.8+ and Node.js installed on your system.
- The backend uses FastAPI, pandas, OpenAI API, ReportLab, and Plotly.
- The frontend uses React, react-router-dom, tailwindcss, react-scripts, and other dependencies.
- Tailwind CSS build is integrated into frontend start and build scripts.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for the backend AI chat engine.

---

This setup will allow you to run and develop the Insightify project with both the backend and frontend servers.
