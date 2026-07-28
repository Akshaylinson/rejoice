/**
 * ==========================================================
 * Rejoice Booking
 * Professional Email Notification Module
 * File : Email.gs
 * ==========================================================
 */

const ADMIN_EMAIL = "tcrcodeless@gmail.com";
const DASHBOARD_URL = "https://admin.rejoicetourpackages.com";
const LOGO_URL = "https://rejoicetourpackages.com/images/logo.png";

// ─── Shared HTML helpers ───────────────────────────────────────────────────

function _baseStyles() {
  return `
    body { margin:0; padding:0; background-color:#f4f6f9; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }
    .wrapper { width:100%; background-color:#f4f6f9; padding:40px 10px; }
    .container { max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05); }
    .header { background-color:#0f172a; text-align:center; padding:35px 20px; }
    .logo { height:48px; width:auto; margin-bottom:12px; }
    .header h1 { margin:0; color:#ffffff; font-size:24px; font-weight:700; letter-spacing:-0.5px; }
    .header p { margin:6px 0 0 0; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
    .content { padding:30px 25px; }
    .section-title { font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#64748b; font-weight:700; margin:0 0 12px 0; padding-bottom:6px; border-bottom:1px solid #e2e8f0; }
    .data-card { background-color:#f8fafc; border:1px solid #f1f5f9; border-radius:12px; padding:8px 16px; margin-bottom:24px; }
    table { width:100%; border-collapse:collapse; }
    td { padding:10px 0; vertical-align:top; font-size:15px; }
    .label { width:38%; color:#64748b; font-weight:500; }
    .value { width:62%; color:#1e293b; font-weight:600; text-align:right; }
    .btn-container { text-align:center; margin:35px 0 10px 0; }
    .button { display:inline-block; background-color:#2563eb; color:#ffffff !important; text-decoration:none; padding:14px 32px; border-radius:10px; font-weight:600; font-size:15px; box-shadow:0 4px 12px rgba(37,99,235,0.2); }
    .footer { background-color:#f8fafc; text-align:center; color:#94a3b8; padding:24px; font-size:12px; border-top:1px solid #f1f5f9; line-height:1.6; }
    .footer strong { color:#64748b; }`;
}

function _wrapHtml(headerSubtitleColor, headerSubtitle, bodyHtml, footerLine, timestamp) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${_baseStyles()}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img src="${LOGO_URL}" class="logo" alt="Rejoice Logo">
        <h1>Rejoice Packages</h1>
        <p style="color:${headerSubtitleColor};">${headerSubtitle}</p>
      </div>
      <div class="content">
        ${bodyHtml}
        <div class="btn-container">
          <a href="${DASHBOARD_URL}" class="button">Open Admin Dashboard</a>
        </div>
      </div>
      <div class="footer">
        <strong>${footerLine}</strong><br>
        This is an automated system notification.<br>
        Received at: ${timestamp}
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ─── Booking Email ─────────────────────────────────────────────────────────

function sendBookingEmail(data) {
  if (!data) {
    Logger.log("Warning: No data provided. Injecting sample object for testing.");
    data = {
      name: "John Doe", package: "Premium Luxury Escape", phone: "+1 (555) 019-2834",
      email: "johndoe@example.com", travellingFrom: "New York, USA", travelDate: "2026-09-15",
      numberOfDays: "7", numberOfPeople: "2", tripType: "Leisure / Honeymoon",
      budget: "$5,000", notes: "Prefers window seats and high floor hotel rooms.",
      submittedAt: new Date().toLocaleString()
    };
  }

  try {
    const subject = `[New Booking] ${data.name} - ${data.package}`;

    const plainText = `NEW BOOKING RECEIVED\n\n` +
      `Customer Name : ${data.name}\nPackage : ${data.package}\nPhone : ${data.phone}\n` +
      `Email : ${data.email}\nTravelling From : ${data.travellingFrom}\nTravel Date : ${data.travelDate}\n` +
      `Number of Days : ${data.numberOfDays}\nNumber of People : ${data.numberOfPeople}\n` +
      `Trip Type : ${data.tripType}\nBudget : ${data.budget}\nNotes : ${data.notes || "None"}\n` +
      `Submitted At : ${data.submittedAt}\n\nDashboard:\n${DASHBOARD_URL}`;

    const bodyHtml = `
      <div class="section-title">Customer Information</div>
      <div class="data-card">
        <table>
          <tr><td class="label">Name</td><td class="value">${data.name}</td></tr>
          <tr><td class="label">Phone</td><td class="value">${data.phone}</td></tr>
          <tr><td class="label">Email</td><td class="value" style="color:#2563eb;font-weight:500;">${data.email}</td></tr>
        </table>
      </div>
      <div class="section-title">Trip &amp; Package Details</div>
      <div class="data-card">
        <table>
          <tr><td class="label">Selected Package</td><td class="value" style="color:#0f172a;">${data.package}</td></tr>
          <tr><td class="label">Travelling From</td><td class="value">${data.travellingFrom}</td></tr>
          <tr><td class="label">Departure Date</td><td class="value">${data.travelDate}</td></tr>
          <tr><td class="label">Duration</td><td class="value">${data.numberOfDays} Days</td></tr>
          <tr><td class="label">Guests</td><td class="value">${data.numberOfPeople} Person(s)</td></tr>
          <tr><td class="label">Trip Type</td><td class="value">${data.tripType}</td></tr>
          <tr><td class="label">Estimated Budget</td><td class="value" style="color:#16a34a;">${data.budget}</td></tr>
        </table>
      </div>
      <div class="section-title">Special Notes</div>
      <div style="background-color:#f8fafc;border-left:4px solid #3b82f6;padding:14px 16px;border-radius:0 12px 12px 0;font-size:14.5px;color:#334155;line-height:1.5;">
        ${data.notes || "No additional requirements provided by the customer."}
      </div>`;

    GmailApp.sendEmail(ADMIN_EMAIL, subject, plainText, {
      htmlBody: _wrapHtml("#94a3b8", "New Booking Notification", bodyHtml, "Rejoice Booking Management System", data.submittedAt),
      name: "Rejoice Booking Updates"
    });

    Logger.log("Booking email sent successfully.");
  } catch (error) {
    Logger.log("Error sending booking email: " + error.toString());
  }
}

// ─── Contact Enquiry Email ─────────────────────────────────────────────────
// Called as sendContactEmail(data) from API.gs

function sendContactEmail(data) {
  sendContactEnquiryEmail(data);
}

function sendContactEnquiryEmail(contactData) {
  if (!contactData) {
    Logger.log("Warning: No contact data provided. Injecting sample object for testing.");
    contactData = {
      name: "Alex Mercer", email: "alex.mercer@example.com", phone: "+1 (555) 342-9182",
      subject: "Custom Corporate Tour Pricing Query",
      message: "Hi Rejoice Team, I am looking to organize a corporate team building tour for 45 people next month. Do you offer bulk package discounts or custom curated itineraries?",
      submittedAt: new Date().toLocaleString()
    };
  }

  try {
    const mailSubject = `✉️ [NEW INQUIRY] ${contactData.name} - ${contactData.subject || "General Contact Request"}`;

    const plainText = `NEW CONTACT INQUIRY RECEIVED\n\n` +
      `Name: ${contactData.name}\nEmail: ${contactData.email}\nPhone: ${contactData.phone || "Not Provided"}\n` +
      `Subject: ${contactData.subject || "General Inquiry"}\nMessage:\n${contactData.message}\n\n` +
      `Submitted At: ${contactData.submittedAt || new Date().toLocaleString()}\n\nDashboard:\n${DASHBOARD_URL}`;

    const bodyHtml = `
      <div class="section-title">Sender Information</div>
      <div class="data-card">
        <table>
          <tr><td class="label">Full Name</td><td class="value">${contactData.name}</td></tr>
          <tr><td class="label">Phone Line</td><td class="value">${contactData.phone || "Not Provided"}</td></tr>
          <tr><td class="label">Email Address</td><td class="value" style="color:#2563eb;font-weight:500;">${contactData.email}</td></tr>
          <tr><td class="label">Subject Line</td><td class="value" style="color:#0f172a;">${contactData.subject || "General Contact Request"}</td></tr>
        </table>
      </div>
      <div class="section-title">Submitted Message Text</div>
      <div style="background-color:#f8fafc;border-left:4px solid #f59e0b;padding:16px;border-radius:0 12px 12px 0;font-size:14.5px;color:#334155;line-height:1.6;font-style:italic;">
        "${contactData.message}"
      </div>`;

    GmailApp.sendEmail(ADMIN_EMAIL, mailSubject, plainText, {
      htmlBody: _wrapHtml("#3b82f6", "Customer Support Notification", bodyHtml, "Rejoice Customer Relation Management", contactData.submittedAt || new Date().toLocaleString()),
      name: "Rejoice Support Desks"
    });

    Logger.log("Contact enquiry email sent successfully.");
  } catch (error) {
    Logger.log("Critical failure while sending contact enquiry email: " + error.toString());
  }
}
