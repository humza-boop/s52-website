/**
 * Schema 52 contact form backend.
 *
 * Setup:
 * 1. Create a Google Sheet with a tab named "Submissions".
 * 2. In the Sheet, go to Extensions -> Apps Script, delete the default code,
 *    and paste this file's contents in.
 * 3. Deploy -> New deployment -> type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment's "/exec" URL into FORM_ENDPOINT in index.html.
 *
 * No API keys or secrets are required.
 */

var SHEET_NAME = 'Submissions';
var NOTIFY_TO = ['humza@schema52.com', 'kim@schema52.com'];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    var name = (body.name || '').toString().trim();
    var email = (body.email || '').toString().trim();
    var company = (body.company || '').toString().trim();
    var message = (body.message || '').toString().trim();

    if (!name || !email) {
      return jsonResponse({ error: 'Name and email are required' });
    }

    appendRow(name, email, company, message);
    sendNotification(name, email, company, message);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ error: 'Failed to process submission: ' + err.message });
  }
}

function appendRow(name, email, company, message) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Company', 'Message']);
  }
  sheet.appendRow([new Date(), name, email, company, message]);
}

function sendNotification(name, email, company, message) {
  var subject = 'New lead: ' + name + (company ? ' (' + company + ')' : '');
  var body = [
    'Name: ' + name,
    'Email: ' + email,
    'Company: ' + (company || '—'),
    'Message: ' + (message || '—'),
  ].join('\n');

  MailApp.sendEmail({
    to: NOTIFY_TO.join(','),
    replyTo: email,
    subject: subject,
    body: body,
  });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
