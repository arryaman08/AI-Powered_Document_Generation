# AI-Powered_Document_Generation
A full-stack web application that leverages Generative AI (Google Gemini) to help users generate, refine, and export structured business documents in Microsoft Word (.docx) and PowerPoint (.pptx) formats.

This project was built to demonstrate an end-to-end workflow combining a responsive React frontend, a high-performance Async Python backend, and robust integration with Large Language Models.

🚀 Features
Secure Authentication: User registration and login using JWT (JSON Web Tokens).

Project Dashboard: Manage multiple document projects.

AI-Powered Scaffolding: Automatically generate structured outlines for Word documents or slide titles for Presentations based on a topic.

Context-Aware Generation: Inject specific context, persona, or constraints (e.g., "Act as a strategy consultant focusing on Tesla") to guide the AI's output.

Background Processing: Utilizes FastAPI background tasks to handle long-running AI generation without blocking the UI.

Interactive Refinement: "Human-in-the-loop" editor allowing users to refine specific document sections with natural language instructions (e.g., "Make this concise," "Convert to bullet points").

Native Document Export: Programmatic assembly of real .docx and .pptx files using python-docx and python-pptx.

Robust Error Handling: Implements automatic exponential backoff and retry logic to handle AI API rate limits gracefully.

🛠️ Tech Stack
Backend
Framework: FastAPI (Python 3.9+) - Chosen for native async support.

Database: SQLite with SQLAlchemy ORM.

Authentication: OAuth2 with Password Flow and JWT.

AI Integration: google-generativeai SDK (Gemini 1.5 Flash model).

Document Processing: python-docx, python-pptx.

Frontend
Framework: React (Vite).

Styling: Tailwind CSS.

Routing: React Router DOM.

HTTP Client: Axios with interceptors for token management.

📋 Prerequisites
Before running the project, ensure you have the following installed:

Python 3.9 or higher.

Node.js 18 or higher (and npm).

A Google Gemini API Key (Get one for free at Google AI Studio).

⚙️ Installation & Setup
1. Clone the Repository
Bash

git clone <your-repo-url>
cd <project-folder-name>

2. Backend Setup
Navigate to the backend directory and install dependencies.

Bash

cd backend
pip install -r requirements.txt
Environment Configuration:

Create a new file named .env inside the backend folder.

Add the following variables to it. Crucial: Replace YOUR_GEMINI_API_KEY with your actual key.

Code snippet

# backend/.env

# Database (SQLite file will be created automatically)
DATABASE_URL=sqlite:///./app.db

# Security (Change these for production!)
SECRET_KEY=supersecretdevelopmentkey12345
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# AI API Key (REQUIRED)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.

Bash

cd frontend
npm install
▶️ Running the Application
You need to run the backend and frontend servers simultaneously in separate terminals.

Terminal 1: Start Backend Server
From the backend directory:

Bash

uvicorn main:app --reload
The backend API will start at http://localhost:8000. Note: On the first run, it will automatically create the app.db SQLite database file.

Terminal 2: Start Frontend Server
From the frontend directory:

Bash

npm run dev
The frontend UI will start at http://localhost:5173 (or whatever port Vite assigns).

📖 Usage Workflow
Open Browser: Go to http://localhost:5173.

Register: Click "Register" to create a new account.

Log In: Use your new credentials to access the dashboard.

Create Project:

Click "New Project".

Enter a Topic (e.g., "Future of AI in Healthcare").

Important: Enter Context to guide the AI (e.g., "Write for investors, focus on radiology, keep tone professional").

Select Format (.docx or .pptx).

Click "AI Suggest Outline".

Once satisfied, click "Generate Project".

Wait & Edit: Wait for the background generation to finish (refresh the page if needed). Click into the project editor.

Refine: Select a section that needs improvement. In the instruction box, type something like "Convert this paragraph to bullet points" and click the refine icon.

Export: Click the "Export" button in the top right to download the final document.

💡 Key Engineering Decisions
During development, several specific challenges were addressed:

1. Handling API Rate Limits (The "Retry Loop")
The free tier of Gemini API has strict rate limits. To prevent the application from crashing during heavy generation or rapid refinement, the backend implements an automatic retry mechanism with backoff. If a 429 Too Many Requests error occurs, the server pauses and retries the operation up to 3 times before failing.

2. Asynchronous Background Tasks
Generating content for a 10-section document takes time. Instead of making the user wait on a loading screen, FastAPI BackgroundTasks are used. The API responds immediately confirming the project started, while the heavy lifting happens asynchronously in the background.

3. Context Injection & Prompt Engineering
To avoid generic AI output, a dedicated "Context" field was implemented. This data is injected into the system prompt for every generation call, forcing the AI to adopt a specific persona or adhere to user-defined constraints, significantly improving content quality.

4. Structured Output Parsing
LLMs often include conversational filler in their responses. To ensure the "AI Outline Suggestion" feature works reliably, strict prompting ensures JSON-only output, combined with a Regex cleaning layer in Python to strip markdown formatting before parsing.
