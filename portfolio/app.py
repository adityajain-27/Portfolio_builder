"""
app.py — Flask backend for the AI-Assisted Resume Portfolio Generator.

Endpoints:
    GET  /           → Upload interface (templates/index.html)
    POST /generate   → Accept .txt file or pasted text, parse via Gemini, return JSON
    GET  /portfolio   → Serve the portfolio viewer (templates.html)
    GET  /api/resume  → Return the most recently generated resume JSON
    GET  /download    → Download a self-contained portfolio.html
    GET  /static/<path> → Serve static assets
"""

import os
import re
import json

from flask import (
    Flask, jsonify, request, render_template,
    send_from_directory, send_file, Response
)
from flask_cors import CORS
from google import genai
from google.genai.errors import APIError
from dotenv import load_dotenv

from promp import PROMPT_TEMPLATE

# =============================================================================
# App Initialization
# =============================================================================

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Load API key from .env
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("Warning: GEMINI_API_KEY not found in .env — /generate will fail until it's set.")

# Hidden link to the separate resume-studio app (React + FastAPI), if configured.
STUDIO_URL = os.getenv("STUDIO_URL", "")
# FastAPI base URL, used by the lock icon to call /studio/gate directly.
STUDIO_API_URL = os.getenv("STUDIO_API_URL", "http://localhost:8000/api/v1")

# Create Gemini client lazily — only needed once /generate is actually called.
client = genai.Client(api_key=API_KEY) if API_KEY else None

# In-memory store for the most recently generated resume data
resume_data = None


# =============================================================================
# Resume Utilities
# =============================================================================

def clean_resume(text):
    """Clean raw resume text by removing noise, extra whitespace, and bullets."""

    # 1. Remove leading and trailing whitespace
    text = text.strip()

    # 2. Remove separator lines made of =, -, _, etc.
    text = re.sub(r"^[=\-_*]{3,}\s*$", "", text, flags=re.MULTILINE)

    # 3. Remove bullets (* or •) only at the beginning of lines
    text = re.sub(r"^\s*[•*]\s*", "", text, flags=re.MULTILINE)

    # 4. Replace multiple spaces with a single space
    text = re.sub(r"[ ]{2,}", " ", text)

    # 5. Replace three or more blank lines with a single blank line
    text = re.sub(r"\n{3,}", "\n\n", text)

    # 6. Remove trailing spaces before a newline
    text = re.sub(r"[ \t]+\n", "\n", text)

    return text


def parse_resume_with_gemini(cleaned_resume):
    """Send cleaned resume text to Gemini and return parsed JSON."""

    prompt = PROMPT_TEMPLATE.format(resume=cleaned_resume)

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt
        )

        # Strip markdown code fences if Gemini wraps the JSON
        raw = response.text.strip()
        if raw.startswith("```"):
            # Remove ```json ... ``` wrapper
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)

        return json.loads(raw)

    except APIError as e:
        print(f"Gemini API Error: {e}")
        return None

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print(f"Raw response: {response.text[:500] if response else 'None'}")
        return None


# =============================================================================
# Routes
# =============================================================================

@app.route("/")
def index():
    """Serve the upload interface."""
    return render_template("index.html", studio_url=STUDIO_URL, api_url=STUDIO_API_URL)


@app.route("/generate", methods=["POST"])
def generate():
    """
    Accept a resume via file upload or pasted text.
    Clean it, parse with Gemini, store result, and return JSON.
    """
    global resume_data

    if client is None:
        return jsonify({"error": "Server is missing GEMINI_API_KEY. Set it in .env and restart."}), 503

    resume_text = None

    # --- Option 1: File upload ---
    if "file" in request.files:
        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected."}), 400

        if not file.filename.lower().endswith(".txt"):
            return jsonify({"error": "Only .txt files are accepted."}), 400

        try:
            resume_text = file.read().decode("utf-8")
        except UnicodeDecodeError:
            return jsonify({"error": "File contains invalid characters. Please use UTF-8."}), 400

    # --- Option 2: Pasted text ---
    elif request.is_json and request.json.get("text"):
        resume_text = request.json["text"]

    elif request.form.get("text"):
        resume_text = request.form["text"]

    else:
        return jsonify({"error": "No resume provided. Upload a .txt file or paste your resume text."}), 400

    # --- Validate ---
    cleaned = clean_resume(resume_text)

    if not cleaned:
        return jsonify({"error": "Resume text is empty after cleaning."}), 400

    word_count = len(cleaned.split())
    if word_count < 50:
        return jsonify({
            "error": f"Resume is too short ({word_count} words). Please provide at least 50 words."
        }), 400

    # --- Parse with Gemini ---
    data = parse_resume_with_gemini(cleaned)

    if data is None:
        return jsonify({
            "error": "Failed to parse resume. The AI service may be temporarily unavailable. Please try again."
        }), 500

    # Store for the portfolio viewer
    resume_data = data

    return jsonify({"success": True, "data": data})


@app.route("/portfolio")
def portfolio():
    """Serve the portfolio viewer page."""
    template_path = os.path.join(os.path.dirname(__file__), "templates.html")
    return send_file(template_path)


@app.route("/api/resume", methods=["GET"])
def get_resume():
    """Return the most recently generated resume JSON."""
    if resume_data is None:
        return jsonify({"error": "No portfolio generated yet. Please upload a resume first."}), 404
    return jsonify(resume_data)


@app.route("/download")
def download():
    """
    Generate and return a self-contained portfolio.html file.
    Inlines the CSS, JS, and embeds the resume data directly.
    """
    if resume_data is None:
        return jsonify({"error": "No portfolio generated yet."}), 404

    # Read the template HTML
    template_path = os.path.join(os.path.dirname(__file__), "templates.html")
    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Read the CSS
    css_path = os.path.join(os.path.dirname(__file__), "static", "style.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()

    # Read the JS
    js_path = os.path.join(os.path.dirname(__file__), "static", "script.js")
    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    # Replace the external CSS link with inline styles
    html = html.replace(
        '<link rel="stylesheet" href="/static/style.css">',
        f"<style>\n{css}\n</style>"
    )

    # Replace the external JS script with inline script that embeds the data
    inline_js = f"""<script>
// Embedded resume data — no API call needed
const EMBEDDED_DATA = {json.dumps(resume_data, ensure_ascii=False)};
</script>
<script>
{js_content}
</script>"""

    html = html.replace(
        '<script src="/static/script.js"></script>',
        inline_js
    )

    # Return as downloadable file
    name = resume_data.get("personal_information", {}).get("full_name", "portfolio")
    safe_name = re.sub(r"[^a-zA-Z0-9_\- ]", "", name).strip().replace(" ", "_")
    filename = f"{safe_name}_portfolio.html" if safe_name else "portfolio.html"

    return Response(
        html,
        mimetype="text/html",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


# Serve static files (style.css, script.js, upload.css, upload.js, etc.)
@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)


# =============================================================================
# Entry Point
# =============================================================================

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"\n  PortGen — AI-Assisted Resume Portfolio Generator")
    print(f"  Open http://localhost:{port} in your browser\n")
    app.run(debug=False, host="0.0.0.0", port=port)
