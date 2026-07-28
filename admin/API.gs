/**
 * ==========================================================
 * Rejoice Booking — Unified Admin API
 * ?type=contacts  → Contacts sheet
 * (default)       → Bookings (Sheet1 / active sheet)
 * File : API.gs
 * ==========================================================
 */

const API_SECRET_TOKEN = "AjmalR2026";

function doGet(e) {
  try {
    if (e.parameter.token !== API_SECRET_TOKEN) {
      return respond({ status: "error", message: "Unauthorized access token." });
    }

    const sheet = e.parameter.type === "contacts"
      ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Contact")
      : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (!sheet) return respond({ status: "error", message: "Sheet not found." });

    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) return respond({ status: "success", count: 0, data: [] });

    const headers = values[0].map(h => h.toString().trim().toLowerCase().replace(/\s+/g, ''));

    const rows = [];
    for (let i = 1; i < values.length; i++) {
      const obj = {};
      headers.forEach((h, idx) => {
        let val = values[i][idx];
        if (val instanceof Date) val = val.toLocaleDateString();
        obj[h || "col_" + idx] = val;
      });
      obj._rowNumber = i + 1;
      rows.push(obj);
    }

    rows.reverse();
    return respond({ status: "success", count: rows.length, data: rows });

  } catch (err) {
    return respond({ status: "error", message: err.toString() });
  }
}

function doPost(e) {
  try {
    const raw = e.postData.contents || '';

    // --- Try JSON first (contact form — may arrive as text/plain due to no-cors) ---
    let jsonData = null;
    try { jsonData = JSON.parse(raw); } catch (_) {}

    if (jsonData && !jsonData.token) {
      saveContact(jsonData);
      sendContactEmail(jsonData);
      return respond({ status: 'success', message: 'Contact saved.' });
    }

    // --- Admin status update (URL-encoded, requires token) ---
    const params = {};
    raw.split('&').forEach(pair => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) return;
      const k = decodeURIComponent(pair.substring(0, eqIdx));
      const v = decodeURIComponent(pair.substring(eqIdx + 1));
      if (k) params[k] = v;
    });

    if (params.token !== API_SECRET_TOKEN) {
      return respond({ status: 'error', message: 'Unauthorized.' });
    }

    const rowNumber = parseInt(params.sheetRowIndex);
    const newStatus = params.status;
    if (!rowNumber || !newStatus) {
      return respond({ status: 'error', message: 'Missing rowNumber or status.' });
    }

    const sheet = params.type === 'contacts'
      ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Contact')
      : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    if (!sheet) return respond({ status: 'error', message: 'Sheet not found.' });

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(h => h.toString().trim().toLowerCase().replace(/\s+/g, ''));

    let statusCol = headers.indexOf('status');
    if (statusCol === -1) {
      statusCol = headers.length;
      sheet.getRange(1, statusCol + 1).setValue('Status');
    }

    sheet.getRange(rowNumber, statusCol + 1).setValue(newStatus);
    return respond({ status: 'success', message: 'Status updated.' });

  } catch (err) {
    return respond({ status: 'error', message: err.toString() });
  }
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
