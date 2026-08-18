import os
import sys
import re # Regex (regural Expressions)
from google import genai
from google.genai.errors import APIError
from promp import PROMPT_TEMPLATE
from dotenv import load_dotenv
import json
from flask import Flask, jsonify, send_from_directory, send_file
from flask_cors import CORS 

app = Flask(__name__, static_folder="static")
CORS(app)

#apikey calling
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")


if not API_KEY:
    print("Error: GEMINI API Key not found!")
    sys.exit()



#Cleaning Resume
def clean_resume(text):
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

    prompt = PROMPT_TEMPLATE.format(resume=cleaned_resume)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return json.loads(response.text)

    except APIError as e:
        print(f"Gemini API Error: {e}")
        return None

    except json.JSONDecodeError:
        print("Error: Gemini returned invalid JSON!")
        return None

resume_file = "resume.txt"

# if not os.path.exists(resume_file):
#     print("Error: Resume file not found!")
#     sys.exit()
    
try:
    with open(resume_file, "r", encoding="utf-8") as file:
        resume_text = file.read()
except FileNotFoundError:
    print("Error: File not found!")
    sys.exit()
except PermissionError:
    print("Error: Permission denied to read the file!")
    sys.exit()
except UnicodeDecodeError:
    print("Error: File contains invalid characters!")
    sys.exit()
except:
    print("Error: Something went wrong!")
    sys.exit()

cleaned_resume = clean_resume(resume_text)

if cleaned_resume == "" :
    print("Error: Resume file is empty!")
    sys.exit()
    
if len(cleaned_resume.split()) < 50 :
    print("Error: Resume file is too short! It should have more than 100 words.")
    sys.exit()



#creating gemini client

client = genai.Client(api_key=API_KEY)

data = parse_resume_with_gemini(cleaned_resume)


#================================================================================
# Flask Routes
#================================================================================

@app.route("/")
def portfolio():
    """Serve templates.html as the main page."""
    template_path = os.path.join(os.path.dirname(__file__), "templates.html")
    return send_file(template_path)


@app.route("/api/resume", methods=["GET"])
def get_resume():
    if data is None:
        return jsonify({"error": "Failed to parse resume"}), 500
    return jsonify(data)


# Serve static files (style.css, script.js, etc.)
@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory("static", filename)


if __name__ == "__main__":
    app.run(debug=False)