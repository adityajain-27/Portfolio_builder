function setText(id, value) {
    const element = document.getElementById(id);

    if (!element) return;

    if (value) {
        element.textContent = value;
    } else {
        element.style.display = "none";
    }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

function displaySkills(skills, elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    skills.forEach(skill => {
        const span = document.createElement("span");
        span.textContent = skill;
        container.appendChild(span);
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

function displayWorkExperience(workExperience) {
    const container = document.getElementById("work-experience");

    if (!container) return;

    if (workExperience.length === 0) {
        document.getElementById("work-experience-section").style.display = "none";
        return;
    }

    workExperience.forEach(job => {

        const article = document.createElement("article");
        article.classList.add("experience-card");

        // Header: title + company on the left, date on the right
        const header = document.createElement("div");
        header.classList.add("experience-header");

        const headerLeft = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = job.job_title;

        const company = document.createElement("div");
        company.classList.add("company");
        company.textContent = job.company_name + (job.location ? " • " + job.location : "");

        headerLeft.appendChild(title);
        headerLeft.appendChild(company);

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("date");
        dateSpan.textContent = `${job.start_date} - ${job.end_date || "Present"}`;

        header.appendChild(headerLeft);
        header.appendChild(dateSpan);

        // Responsibilities list
        const responsibilities = document.createElement("ul");

        job.responsibilities_and_achievements.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            responsibilities.appendChild(li);
        });

        article.appendChild(header);
        article.appendChild(responsibilities);

        container.appendChild(article);
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

function displayProjects(projects) {

    const container = document.getElementById("projects");

    if (!container) return;

    if (projects.length === 0) {
        document.getElementById("projects-section").style.display = "none";
        return;
    }

    projects.forEach(project => {

        const article = document.createElement("article");
        article.classList.add("project-card");

        // Top row: title + link icon
        const top = document.createElement("div");
        top.classList.add("project-top");

        const title = document.createElement("h3");
        title.textContent = project.project_title;

        top.appendChild(title);

        if (project.link) {
            const linkIcon = document.createElement("a");
            linkIcon.href = project.link;
            linkIcon.classList.add("external-icon");
            linkIcon.target = "_blank";
            linkIcon.textContent = "\u2197";
            top.appendChild(linkIcon);
        }

        // Description
        const description = document.createElement("p");
        description.textContent = project.description;

        // Technology tags
        const tags = document.createElement("div");
        tags.classList.add("tags");

        project.technologies_used.forEach(technology => {
            const span = document.createElement("span");
            span.textContent = technology;
            tags.appendChild(span);
        });

        article.appendChild(top);
        article.appendChild(description);
        article.appendChild(tags);

        container.appendChild(article);
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------


function displayEducation(education) {

    const container = document.getElementById("education");

    if (!container) return;

    if (education.length === 0) {
        document.getElementById("education-section").style.display = "none";
        return;
    }

    education.forEach(edu => {

        const card = document.createElement("div");
        card.classList.add("education-card");

        // Title: "Degree in Field"
        const title = document.createElement("h3");
        title.textContent = edu.field_of_study
            ? `${edu.degree} in ${edu.field_of_study}`
            : edu.degree;

        // Meta: "Institution • Start - End"
        const meta = document.createElement("div");
        meta.classList.add("education-meta");
        const dateRange = edu.start_date ? `${edu.start_date} - ${edu.end_date}` : edu.end_date || "";
        const metaParts = [edu.institution_name, dateRange].filter(Boolean);
        meta.textContent = metaParts.join(" \u2022 ");

        card.appendChild(title);
        card.appendChild(meta);

        // GPA if available
        if (edu.grade_or_gpa) {
            const gpa = document.createElement("p");
            gpa.textContent = `GPA: ${edu.grade_or_gpa}`;
            card.appendChild(gpa);
        }

        container.appendChild(card);
    });
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------


function displayCertifications(certifications) {

    const container = document.getElementById("certifications");

    if (!container) return;

    if (certifications.length === 0) {
        document.getElementById("certifications-section").style.display = "none";
        return;
    }

    certifications.forEach(certification => {

        const card = document.createElement("div");
        card.classList.add("cert-card");

        // Circle icon
        const icon = document.createElement("div");
        icon.classList.add("cert-icon");

        // Text content
        const textDiv = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = certification.certification_name;

        const meta = document.createElement("p");
        const metaParts = [
            certification.issuing_organization,
            certification.issue_date
        ].filter(Boolean);
        meta.textContent = metaParts.join(" \u2022 ");

        textDiv.appendChild(name);
        textDiv.appendChild(meta);

        card.appendChild(icon);
        card.appendChild(textDiv);

        container.appendChild(card);
    });
}



//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

// EMBEDDED_DATA is only present in the standalone file produced by /download —
// use it directly there instead of fetching (there's no server to fetch from).
(typeof EMBEDDED_DATA !== "undefined"
    ? Promise.resolve(EMBEDDED_DATA)
    : fetch("/api/resume").then(response => {
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
    })
)
    .then(data => {
        console.log(data);

        //--- Helper to hide a section by ID ---
        function hideSection(id) {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------

        // Set name in all places (navbar, hero, footer)
        setText("full-name", data.personal_information.full_name);
        setText("full-namee", data.personal_information.full_name);
        setText("full-nameee", data.personal_information.full_name);

        // Hero title
        if (data.hero_title) {
            setText("hero-title", data.hero_title);
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------

        // Set page title
        document.title = `${data.personal_information.full_name} | Portfolio`;

        //------------------------------------------------------------------------------------------------------------------------------------------------

        // Footer copyright
        setText("footer-copyright", `© 2026 ${data.personal_information.full_name}. All rights reserved.`);

        //------------------------------------------------------------------------------------------------------------------------------------------------

        // Summary (hero + about section)
        if (data.professional_summary) {
            setText("summary", data.professional_summary);
            setText("about-summary", data.professional_summary);
        } else {
            hideSection("about");
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------

        const linkedin = document.getElementById("linkedin");

        if (linkedin) {
            if (data.personal_information.linkedin_url) {
                linkedin.href = data.personal_information.linkedin_url;
            } else {
                linkedin.style.display = "none";
            }
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------

        const github = document.getElementById("github");

        if (github) {
            if (data.personal_information.github_url) {
                github.href = data.personal_information.github_url;
            } else {
                github.style.display = "none";
            }
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------

        const emailLink = document.getElementById("email-link");

        if (emailLink) {
            if (data.personal_information.email) {
                emailLink.href = `mailto:${data.personal_information.email}`;
            } else {
                emailLink.style.display = "none";
            }
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------
        // SKILLS — hide individual cards if empty, hide entire section if all empty

        const skillSections = [
            { data: data.skills.technical_skills, id: "technical-skills" },
            { data: data.skills.soft_skills, id: "soft-skills" },
            { data: data.skills.tools_and_technologies, id: "tools-technologies" },
            { data: data.skills.languages, id: "languages" },
        ];

        let hasAnySkills = false;

        skillSections.forEach(section => {
            if (section.data && section.data.length > 0) {
                displaySkills(section.data, section.id);
                hasAnySkills = true;
            } else {
                // Hide the parent .skill-card
                const container = document.getElementById(section.id);
                if (container && container.closest(".skill-card")) {
                    container.closest(".skill-card").style.display = "none";
                }
            }
        });

        if (!hasAnySkills) {
            hideSection("skills");
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------
        // EXPERIENCE — hide if empty

        if (data.work_experience && data.work_experience.length > 0) {
            displayWorkExperience(data.work_experience);
        } else {
            hideSection("experience");
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------
        // PROJECTS — hide if empty

        if (data.projects && data.projects.length > 0) {
            displayProjects(data.projects);
        } else {
            hideSection("projects-wrapper");
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------
        // EDUCATION & CERTIFICATIONS — hide individually + hide wrapper if both empty

        const hasEducation = data.education && data.education.length > 0;
        const hasCerts = data.certifications && data.certifications.length > 0;

        if (hasEducation) {
            displayEducation(data.education);
        } else {
            hideSection("education-section");
        }

        if (hasCerts) {
            displayCertifications(data.certifications);
        } else {
            hideSection("certifications-section");
        }

        if (!hasEducation && !hasCerts) {
            hideSection("education-wrapper");
        }

        //------------------------------------------------------------------------------------------------------------------------------------------------
    })
    .catch(error => {
        console.error("Error fetching resume:", error);

        const errorMessage = document.getElementById("error-message");

        if (errorMessage) {
            errorMessage.textContent =
                "Unable to load resume data. Please try again later.";
            errorMessage.style.display = "block";
        }
    });