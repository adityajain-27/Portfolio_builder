/* ==========================================================================
   PortGen — Upload Page Logic
   Handles: mode toggle, drag & drop, file selection, text paste,
   validation, /generate API call, and status/success UI states.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ----- Element references -----

    const btnFileMode = document.getElementById("btn-file-mode");
    const btnTextMode = document.getElementById("btn-text-mode");
    const fileModeSection = document.getElementById("file-mode");
    const textModeSection = document.getElementById("text-mode");

    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const fileInfo = document.getElementById("file-info");
    const fileName = document.getElementById("file-name");
    const fileSize = document.getElementById("file-size");
    const fileRemove = document.getElementById("file-remove");

    const resumeText = document.getElementById("resume-text");
    const charCount = document.getElementById("char-count");

    const statusArea = document.getElementById("status-area");
    const statusIcon = document.getElementById("status-icon");
    const statusText = document.getElementById("status-text");

    const generateBtn = document.getElementById("generate-btn");
    const btnContent = document.getElementById("btn-content");
    const btnLoading = document.getElementById("btn-loading");

    const successActions = document.getElementById("success-actions");

    // ----- State -----

    let currentMode = "file"; // "file" | "text"
    let selectedFile = null;

    // ----- Mode Toggle -----

    function setMode(mode) {
        currentMode = mode;

        if (mode === "file") {
            btnFileMode.classList.add("active");
            btnTextMode.classList.remove("active");
            fileModeSection.style.display = "";
            textModeSection.style.display = "none";
        } else {
            btnTextMode.classList.add("active");
            btnFileMode.classList.remove("active");
            textModeSection.style.display = "";
            fileModeSection.style.display = "none";
        }

        hideStatus();
        hideSuccess();
    }

    btnFileMode.addEventListener("click", () => setMode("file"));
    btnTextMode.addEventListener("click", () => setMode("text"));

    // ----- Drag & Drop / Click to Browse -----

    dropZone.addEventListener("click", (e) => {
        // Don't reopen the file picker if the user clicked the remove button
        if (e.target.closest("#file-remove")) return;
        fileInput.click();
    });

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
    });

    dropZone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelection(files[0]);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    fileRemove.addEventListener("click", (e) => {
        e.stopPropagation();
        clearFileSelection();
    });

    function handleFileSelection(file) {
        if (!file.name.toLowerCase().endsWith(".txt")) {
            showStatus("error", "Only .txt files are accepted.");
            clearFileSelection();
            return;
        }

        selectedFile = file;

        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);

        fileInfo.style.display = "flex";
        document.getElementById("drop-icon").parentElement.querySelector(".drop-text")
            .closest(".drop-zone-content").style.display = "none";

        hideStatus();
        hideSuccess();
    }

    function clearFileSelection() {
        selectedFile = null;
        fileInput.value = "";
        fileInfo.style.display = "none";

        const content = document.querySelector(".drop-zone-content");
        if (content) content.style.display = "";
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    // ----- Text Paste Mode: word count -----

    resumeText.addEventListener("input", () => {
        const words = resumeText.value.trim().split(/\s+/).filter(Boolean);
        const count = resumeText.value.trim() === "" ? 0 : words.length;
        charCount.textContent = `${count} word${count === 1 ? "" : "s"}`;

        hideStatus();
        hideSuccess();
    });

    // ----- Status helpers -----

    function showStatus(type, message) {
        statusArea.style.display = "flex";
        statusArea.className = `status-area ${type}`;

        const icons = {
            error: "⚠",
            success: "✓",
            info: "ℹ"
        };

        statusIcon.textContent = icons[type] || "";
        statusText.textContent = message;
    }

    function hideStatus() {
        statusArea.style.display = "none";
    }

    function showSuccess() {
        successActions.style.display = "grid";
    }

    function hideSuccess() {
        successActions.style.display = "none";
    }

    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        btnContent.style.display = isLoading ? "none" : "inline-flex";
        btnLoading.style.display = isLoading ? "inline-flex" : "none";
    }

    // ----- Generate -----

    generateBtn.addEventListener("click", async () => {
        hideStatus();
        hideSuccess();

        let requestOptions;

        if (currentMode === "file") {
            if (!selectedFile) {
                showStatus("error", "Please select a .txt file to upload.");
                return;
            }

            const formData = new FormData();
            formData.append("file", selectedFile);

            requestOptions = { method: "POST", body: formData };

        } else {
            const text = resumeText.value.trim();

            if (!text) {
                showStatus("error", "Please paste your resume text.");
                return;
            }

            const wordCount = text.split(/\s+/).filter(Boolean).length;
            if (wordCount < 50) {
                showStatus("error", `Resume is too short (${wordCount} words). Please provide at least 50 words.`);
                return;
            }

            requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            };
        }

        setLoading(true);
        showStatus("info", "Parsing your resume with AI, this may take a moment...");

        try {
            const response = await fetch("/generate", requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Request failed with status ${response.status}`);
            }

            showStatus("success", "Portfolio generated successfully!");
            showSuccess();

        } catch (err) {
            console.error("Generate error:", err);
            showStatus("error", err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    });

    // ----- Init -----

    setMode("file");
});
