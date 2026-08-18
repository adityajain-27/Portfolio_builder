PROMPT_TEMPLATE = """
Act as an expert resume parser. Convert the provided resume text into a single, valid JSON object.

Strict Rules:

1. Rely ONLY on the clear facts directly mentioned in the resume text.
2. Do NOT assume, extrapolate, or invent any skills, work experience, projects, achievements, company names, dates, links, or certifications.
3. If any piece of information or requested field is missing from the resume, leave the value as an empty string ("") or an empty array ([]).
4. Maintain exact dates, organization names, job titles, and spelling as written in the resume.
5. Output strictly valid JSON.
6. Do NOT include markdown formatting.
7. Do NOT include explanations or additional text.
8. Make a short summary from the professional summary and add it in "hero_title".
JSON Schema:

{{
    "personal_information": {{
        "full_name": "",
        "email": "",
        "phone_number": "",
        "location": "",
        "linkedin_url": "",
        "github_url": "",
        "portfolio_url": ""
    }},

    "hero_title": "",

    "professional_summary": "",

    "work_experience": [
        {{
            "job_title": "",
            "company_name": "",
            "location": "",
            "start_date": "",
            "end_date": "",
            "responsibilities_and_achievements": []
        }}
    ],

    "education": [
        {{
            "degree": "",
            "field_of_study": "",
            "institution_name": "",
            "location": "",
            "start_date": "",
            "end_date": "",
            "grade_or_gpa": ""
        }}
    ],

    "skills": {{
        "technical_skills": [],
        "soft_skills": [],
        "tools_and_technologies": [],
        "languages": []
    }},

    "projects": [
        {{
            "project_title": "",
            "description": "",
            "technologies_used": [],
            "link": ""
        }}
    ],

    "certifications": [
        {{
            "certification_name": "",
            "issuing_organization": "",
            "issue_date": "",
            "expiration_date": "",
            "credential_id_or_link": ""
        }}
    ]
}}

Resume Text:

{resume}
"""