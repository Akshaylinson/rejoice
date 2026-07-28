/**
 * ==========================================================
 * Rejoice Booking
 * Admin Dashboard API Engine Module (CORS Optimized)
 * File : API.gs
 * ==========================================================
 */

const API_SECRET_TOKEN = "AjmalR2026"; 

function doGet(e) {
  try {
    // 1. Authenticate Request
    const incomingToken = e.parameter.token;
    if (incomingToken !== API_SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "Unauthorized access token." 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Open Spreadsheet Data Ledger
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
                          .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Extract Clean Lowercase Header Strings
    const headers = values[0].map(h => h.toString().trim().toLowerCase().replace(/\s+/g, ''));
    
    // 4. Transform Sheet Rows into Structured JSON Objects
    const bookingsList = [];
    for (let i = 1; i < values.length; i++) {
      let row = values[i];
      let booking = {};
      
      headers.forEach((header, index) => {
        let val = row[index];
        if (val instanceof Date) {
          val = val.toLocaleDateString();
        }
        booking[header || "column_" + index] = val;
      });

      booking._rowNumber = i + 1; // 1-based sheet row for doPost updates
      bookingsList.push(booking);
    }

    bookingsList.reverse(); // Newest bookings first

    // 5. Output JSON data structure
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: bookingsList.length,
      data: bookingsList
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const raw = e.postData.contents || '';
    const params = {};
    raw.split('&').forEach(pair => {
      const [k, v] = pair.split('=').map(decodeURIComponent);
      if (k) params[k] = v;
    });

    if (params.token !== API_SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error", message: "Unauthorized."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const rowNumber = parseInt(params.sheetRowIndex);
    const newStatus = params.status;

    if (!rowNumber || !newStatus) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error", message: "Missing rowNumber or status."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .map(h => h.toString().trim().toLowerCase().replace(/\s+/g, ''));

    let statusColIndex = headers.indexOf('status');
    if (statusColIndex === -1) {
      // Append a new Status column if it doesn't exist
      statusColIndex = headers.length;
      sheet.getRange(1, statusColIndex + 1).setValue('Status');
    }

    sheet.getRange(rowNumber, statusColIndex + 1).setValue(newStatus);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success", message: "Status updated."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error", message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
