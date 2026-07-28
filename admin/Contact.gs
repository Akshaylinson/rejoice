// Saves a contact enquiry row to the "Contact" sheet
function saveContact(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Contact');
  if (!sheet) {
    sheet = ss.insertSheet('Contact');
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status']);
  }
  sheet.appendRow([
    new Date().toLocaleString(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.subject || '',
    data.message || '',
    'new'
  ]);
}
