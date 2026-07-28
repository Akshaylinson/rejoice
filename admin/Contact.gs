function getRejoiceSpreadsheet_() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSpreadsheet) return activeSpreadsheet;

  const scriptProps = PropertiesService.getScriptProperties();
  const spreadsheetId = scriptProps.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Spreadsheet not available. Set SPREADSHEET_ID in Script Properties or bind the script to the workbook.');
  }

  return SpreadsheetApp.openById(spreadsheetId);
}

function ensureSheetWithHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

function getOrCreateSheet_(sheetName, headers) {
  const ss = getRejoiceSpreadsheet_();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return ensureSheetWithHeaders_(sheet, headers);
}

// Saves a contact enquiry row to the "Contact" sheet
function saveContact(data) {
  data = data || {};
  const sheet = getOrCreateSheet_('Contact', ['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status']);
  sheet.appendRow([
    new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || '',
    'new'
  ]);
}

// Saves a booking enquiry row to the "Sheet1" sheet
function saveBooking(data) {
  data = data || {};
  const sheet = getOrCreateSheet_('Sheet1', [
    'Timestamp',
    'Package',
    'Name',
    'Phone',
    'Email',
    'Travelling From',
    'Travel Date',
    'Days',
    'People',
    'Trip Type',
    'Budget',
    'Notes',
    'Status'
  ]);

  sheet.appendRow([
    new Date().toISOString(),
    data.package || '',
    data.name || '',
    data.phone || '',
    data.email || '',
    data.travellingFrom || '',
    data.travelDate || '',
    data.numberOfDays || '',
    data.numberOfPeople || '',
    data.tripType || '',
    data.budget || '',
    data.notes || '',
    'new'
  ]);
}
