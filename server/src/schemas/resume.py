from pydantic import BaseModel, Field


class ContactInfo(BaseModel):
    phone: str = ""
    email: str = ""
    linkedin_url: str = ""
    github_url: str = ""


class EducationEntry(BaseModel):
    institution: str = Field("", max_length=45)
    date: str = Field("", max_length=25)
    degree: str = Field("", max_length=55)
    score: str = Field("", max_length=20)


class ExperienceEntry(BaseModel):
    company: str = Field("", max_length=45)
    date: str = Field("", max_length=25)
    role: str = Field("", max_length=55)
    location: str = Field("", max_length=20)
    bullets: list[str] = Field(default_factory=list)


class ProjectEntry(BaseModel):
    name: str = Field("", max_length=30)
    tech: str = Field("", max_length=45)
    link: str = ""
    bullets: list[str] = Field(default_factory=list)


class SkillsInfo(BaseModel):
    programming: str = Field("", max_length=110)
    query: str = Field("", max_length=110)
    web: str = Field("", max_length=110)
    tools: str = Field("", max_length=110)
    frameworks: str = Field("", max_length=110)
    platforms: str = Field("", max_length=110)


class ResumeData(BaseModel):
    full_name: str = Field(..., max_length=40)
    summary: str = Field("", max_length=220)
    contact: ContactInfo = Field(default_factory=ContactInfo)
    education: list[EducationEntry] = Field(default_factory=list, max_length=3)
    skills: SkillsInfo = Field(default_factory=SkillsInfo)
    experience: list[ExperienceEntry] = Field(default_factory=list, max_length=3)
    projects: list[ProjectEntry] = Field(default_factory=list, max_length=2)
    achievements: list[str] = Field(default_factory=list, max_length=2)


class GenerateResumeResponse(BaseModel):
    download_url: str
    google_doc_url: str
