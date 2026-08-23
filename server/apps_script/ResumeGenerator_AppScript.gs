// ============================================================
//  Resume Generator — Google Apps Script
//  Deploy as: Web App → Execute as: Me → Access: Anyone
//  After deploying, copy the /exec URL into the backend env as:
//  GS_RESUME_URL=https://script.google.com/macros/s/.../exec
//
//  Modeled on the Form 3A generator (EPF3A_AppScript.gs): copy a
//  fixed Google Docs template, fill it with replaceText, export PDF.
//  Two things this script does differently from 3A:
//   1. Fixed-slot sections (education/experience/projects) that the
//      user didn't fill are deleted outright, not left blank.
//   2. Contact/link fields render as a fixed label (e.g. "LinkedIn")
//      with the real URL applied as a hyperlink underneath, instead
//      of printing the URL/text itself.
// ============================================================

var TEMPLATE_DOC_ID = '1_6LwgRLNlHqpGNkrxetmRVs7ouM0h_fH2-KpNVkPs84';
var OUTPUT_FOLDER_ID = '1clvDFwkCfwsjbWC8rvPdLRlFmVxL7OKD';

// Guest requests (no account, nothing saved server-side) have no way to ever
// come back and clean up their Doc/PDF, so they land in a separate folder
// that a scheduled trigger (see cleanupExpiredGuestFiles) sweeps on a timer.
// Create this folder in Drive once and paste its id here.
var GUEST_OUTPUT_FOLDER_ID = '';
var GUEST_FILE_EXPIRY_HOURS = 48;

// Fixed-slot counts must match the template exactly (see Resume_Template (1).docx):
var EDU_SLOTS = 3;
var EXP_SLOTS = 3;
var EXP_BULLET_SLOTS = { 1: 4, 2: 2, 3: 4 }; // bullets per experience slot, per template
var PROJ_SLOTS = 2;
var PROJ_BULLET_SLOTS = 2; // bullets per project slot
var ACH_SLOTS = 2;

function doPost(e) {
  try {
    var raw = e.postData && e.postData.contents ? e.postData.contents : '';
    var data = {};
    try { data = JSON.parse(raw); } catch (_) { data = e.parameter || {}; }

    var fullName = data.full_name || '';
    var safeName = fullName.replace(/[\\/:*?"<>|]/g, '').trim();
    var fileName = (safeName || 'Resume') + '_Resume';

    var isGuest = !!data._is_guest;
    var targetFolderId = (isGuest && GUEST_OUTPUT_FOLDER_ID) ? GUEST_OUTPUT_FOLDER_ID : OUTPUT_FOLDER_ID;
    var folder = targetFolderId ? DriveApp.getFolderById(targetFolderId) : null;

    var templateFile = DriveApp.getFileById(TEMPLATE_DOC_ID);
    var newFile = templateFile.makeCopy(fileName);
    if (folder) {
      folder.addFile(newFile);
      DriveApp.getRootFolder().removeFile(newFile);
    }

    var doc = DocumentApp.openById(newFile.getId());
    var body = doc.getBody();

    // ── Simple text fields ──
    replaceField(body, 'FULL_NAME', fullName);
    replaceField(body, 'SUMMARY', data.summary || '');

    // ── Education (fixed slots — delete any slot the user didn't fill) ──
    for (var ei = 1; ei <= EDU_SLOTS; ei++) {
      var edu = (data.education && data.education[ei - 1]) || null;
      if (edu) {
        replaceField(body, 'EDU' + ei + '_INSTITUTION', edu.institution || '');
        replaceField(body, 'EDU' + ei + '_DATE', edu.date || '');
        replaceField(body, 'EDU' + ei + '_DEGREE', edu.degree || '');
        replaceField(body, 'EDU' + ei + '_SCORE', edu.score || '');
      } else {
        removeParagraphContaining(body, '{{EDU' + ei + '_INSTITUTION}}');
        removeParagraphContaining(body, '{{EDU' + ei + '_DEGREE}}');
      }
    }

    // ── Skills ──
    var skills = data.skills || {};
    replaceField(body, 'SKILL_PROGRAMMING', skills.programming || '');
    replaceField(body, 'SKILL_QUERY', skills.query || '');
    replaceField(body, 'SKILL_WEB', skills.web || '');
    replaceField(body, 'SKILL_TOOLS', skills.tools || '');
    replaceField(body, 'SKILL_FRAMEWORKS', skills.frameworks || '');
    replaceField(body, 'SKILL_PLATFORMS', skills.platforms || '');

    // ── Experience (fixed slots) ──
    for (var xi = 1; xi <= EXP_SLOTS; xi++) {
      var exp = (data.experience && data.experience[xi - 1]) || null;
      var bulletCount = EXP_BULLET_SLOTS[xi] || 0;
      if (exp) {
        replaceField(body, 'EXP' + xi + '_COMPANY', exp.company || '');
        replaceField(body, 'EXP' + xi + '_DATE', exp.date || '');
        replaceField(body, 'EXP' + xi + '_ROLE', exp.role || '');
        replaceField(body, 'EXP' + xi + '_LOCATION', exp.location || '');
        for (var xb = 1; xb <= bulletCount; xb++) {
          var bulletText = (exp.bullets && exp.bullets[xb - 1]) || '';
          if (bulletText) {
            replaceField(body, 'EXP' + xi + '_BULLET' + xb, bulletText);
          } else {
            removeParagraphContaining(body, '{{EXP' + xi + '_BULLET' + xb + '}}');
          }
        }
      } else {
        removeParagraphContaining(body, '{{EXP' + xi + '_COMPANY}}');
        removeParagraphContaining(body, '{{EXP' + xi + '_ROLE}}');
        for (var xb2 = 1; xb2 <= bulletCount; xb2++) {
          removeParagraphContaining(body, '{{EXP' + xi + '_BULLET' + xb2 + '}}');
        }
      }
    }

    // ── Projects (fixed slots) — link applied as hyperlink on "View Project" ──
    for (var pi = 1; pi <= PROJ_SLOTS; pi++) {
      var proj = (data.projects && data.projects[pi - 1]) || null;
      if (proj) {
        replaceField(body, 'PROJ' + pi + '_NAME', proj.name || '');
        replaceField(body, 'PROJ' + pi + '_TECH', proj.tech || '');
        if (proj.link) {
          linkFixedLabelInParagraphContaining(body, '{{PROJ' + pi + '_NAME}}', 'View Project', proj.link);
        } else {
          removeTextInParagraphContaining(body, '{{PROJ' + pi + '_NAME}}', 'View Project');
        }
        for (var pb = 1; pb <= PROJ_BULLET_SLOTS; pb++) {
          var pBulletText = (proj.bullets && proj.bullets[pb - 1]) || '';
          if (pBulletText) {
            replaceField(body, 'PROJ' + pi + '_BULLET' + pb, pBulletText);
          } else {
            removeParagraphContaining(body, '{{PROJ' + pi + '_BULLET' + pb + '}}');
          }
        }
      } else {
        removeParagraphContaining(body, '{{PROJ' + pi + '_NAME}}');
        for (var pb2 = 1; pb2 <= PROJ_BULLET_SLOTS; pb2++) {
          removeParagraphContaining(body, '{{PROJ' + pi + '_BULLET' + pb2 + '}}');
        }
      }
    }

    // ── Achievements (fixed slots) ──
    for (var ai = 1; ai <= ACH_SLOTS; ai++) {
      var achText = (data.achievements && data.achievements[ai - 1]) || '';
      if (achText) {
        replaceField(body, 'ACH' + ai, achText);
      } else {
        removeParagraphContaining(body, '{{ACH' + ai + '}}');
      }
    }

    // ── Contact links ──
    // Phone/Email: show the real value as plain text (no hyperlink).
    // LinkedIn/GitHub: keep the fixed label text, hyperlinked to the real URL.
    var contact = data.contact || {};
    if (contact.phone) {
      replaceTextOccurrence(body, 'Phone', contact.phone);
    } else {
      removeTextOccurrence(body, 'Phone');
    }
    if (contact.email) {
      replaceTextOccurrence(body, 'Email', contact.email);
    } else {
      removeTextOccurrence(body, 'Email');
    }
    if (contact.linkedin_url) {
      linkFixedLabel(body, 'LinkedIn', contact.linkedin_url);
    } else {
      removeTextOccurrence(body, 'LinkedIn');
    }
    if (contact.github_url) {
      linkFixedLabel(body, 'GitHub', contact.github_url);
    } else {
      removeTextOccurrence(body, 'GitHub');
    }

    doc.saveAndClose();

    // ── Export to PDF ──
    var pdfBlob = DriveApp.getFileById(newFile.getId())
      .getAs('application/pdf')
      .setName(fileName + '.pdf');

    var pdfFile = (folder ? folder : DriveApp.getRootFolder()).createFile(pdfBlob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    try {
      DriveApp.getFileById(newFile.getId())
        .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    } catch (_) {}

    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + pdfFile.getId();
    var googleDocUrl = 'https://docs.google.com/document/d/' + newFile.getId() + '/edit';

    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        downloadUrl: downloadUrl,
        googleDocUrl: googleDocUrl,
        fileId: newFile.getId(),
        pdfFileId: pdfFile.getId(),
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Plain {{FIELD}} -> value substitution (same as 3A's replaceText calls).
function replaceField(body, key, value) {
  body.replaceText('\\{\\{' + key + '\\}\\}', escapeForRegexReplacement(value));
}

// Google Docs replaceText treats the replacement string's backslashes/$
// specially (regex replacement semantics) — escape so literal user content
// (e.g. "$5,000" or "C++\\Java") can't be misinterpreted.
function escapeForRegexReplacement(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/\$/g, '\\$');
}

// Removes the whole paragraph (or list item — bullets in this template are
// LIST_ITEM elements, not PARAGRAPH) that contains the given literal
// placeholder text. Used for fixed-slot sections the user left empty, so no
// blank line/gap — or leftover "{{PLACEHOLDER}}" text — remains.
function removeParagraphContaining(body, literalText) {
  var numChildren = body.getNumChildren();
  for (var i = numChildren - 1; i >= 0; i--) {
    var child = body.getChild(i);
    var type = child.getType();
    if (type !== DocumentApp.ElementType.PARAGRAPH && type !== DocumentApp.ElementType.LIST_ITEM) continue;
    var el = type === DocumentApp.ElementType.PARAGRAPH ? child.asParagraph() : child.asListItem();
    if (el.getText().indexOf(literalText) !== -1) {
      // A document/section can never end up with zero paragraphs — removing
      // the last one in its section throws. Fall back to blanking the text.
      try {
        body.removeChild(el);
      } catch (removeErr) {
        // Docs also rejects a fully-empty text run — a single space is the
        // smallest content that satisfies both constraints.
        el.setText(' ');
      }
    }
  }
}

// Removes just a run of text (e.g. the "View Project" label) from whichever
// paragraph contains anchorText, without deleting the whole paragraph —
// used when a project has no link but still has a name/tech line.
function removeTextInParagraphContaining(body, anchorText, textToRemove) {
  var numChildren = body.getNumChildren();
  for (var i = 0; i < numChildren; i++) {
    var child = body.getChild(i);
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    var para = child.asParagraph();
    if (para.getText().indexOf(anchorText) === -1) continue;
    var rangeElement = para.findText(textToRemove);
    if (rangeElement) {
      var el = rangeElement.getElement().asText();
      el.deleteText(rangeElement.getStartOffset(), rangeElement.getEndOffsetInclusive());
    }
  }
}

// Applies a hyperlink to the first occurrence of labelText found anywhere
// in the body (used for the header contact line: Phone/Email/LinkedIn/GitHub,
// each of which appears exactly once).
function linkFixedLabel(body, labelText, url) {
  var found = body.findText(labelText);
  if (!found) return;
  var el = found.getElement().asText();
  el.setLinkUrl(found.getStartOffset(), found.getEndOffsetInclusive(), url);
}

// Applies a hyperlink to labelText, but only within the paragraph that also
// contains anchorText — used to disambiguate Project 1's "View Project" from
// Project 2's, since the same label text appears twice in the document.
function linkFixedLabelInParagraphContaining(body, anchorText, labelText, url) {
  var numChildren = body.getNumChildren();
  for (var i = 0; i < numChildren; i++) {
    var child = body.getChild(i);
    if (child.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    var para = child.asParagraph();
    if (para.getText().indexOf(anchorText) === -1) continue;
    var found = para.findText(labelText);
    if (found) {
      var el = found.getElement().asText();
      el.setLinkUrl(found.getStartOffset(), found.getEndOffsetInclusive(), url);
    }
    return;
  }
}

// Removes the first occurrence of a fixed label (used when a top-level
// contact field, e.g. GitHub, was left empty entirely).
function removeTextOccurrence(body, labelText) {
  var found = body.findText(labelText);
  if (found) {
    var el = found.getElement().asText();
    el.deleteText(found.getStartOffset(), found.getEndOffsetInclusive());
  }
}

// Replaces the first occurrence of a fixed label with the real value, as
// plain text (no hyperlink) — used for Phone/Email, which should display
// the actual number/address rather than staying as a clickable label.
function replaceTextOccurrence(body, labelText, value) {
  var found = body.findText(labelText);
  if (found) {
    var el = found.getElement().asText();
    el.deleteText(found.getStartOffset(), found.getEndOffsetInclusive());
    el.insertText(found.getStartOffset(), value);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Resume Generator Apps Script is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  Guest file cleanup
//  Run installTimeTrigger() ONCE manually from the Apps Script editor
//  (select it in the function dropdown, click Run) to schedule this on
//  a recurring timer. Deletes anything older than GUEST_FILE_EXPIRY_HOURS
//  from GUEST_OUTPUT_FOLDER_ID — guest resumes have no account/DB record,
//  so there is no other way to reclaim that storage.
// ============================================================

function cleanupExpiredGuestFiles() {
  if (!GUEST_OUTPUT_FOLDER_ID) return;

  var folder = DriveApp.getFolderById(GUEST_OUTPUT_FOLDER_ID);
  var cutoff = new Date(Date.now() - GUEST_FILE_EXPIRY_HOURS * 60 * 60 * 1000);
  var files = folder.getFiles();
  var deleted = 0;

  while (files.hasNext()) {
    var file = files.next();
    if (file.getLastUpdated() < cutoff) {
      file.setTrashed(true);
      deleted++;
    }
  }

  console.log('cleanupExpiredGuestFiles: trashed ' + deleted + ' file(s) older than ' + GUEST_FILE_EXPIRY_HOURS + 'h');
}

// One-time setup — creates the daily trigger that calls cleanupExpiredGuestFiles.
// Safe to re-run: it removes any existing trigger for this function first.
function installTimeTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'cleanupExpiredGuestFiles') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('cleanupExpiredGuestFiles')
    .timeBased()
    .everyDays(1)
    .atHour(3)
    .create();
}
