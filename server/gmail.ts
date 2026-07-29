// Gmail SMTP integration for sending email notifications using nodemailer
import nodemailer from 'nodemailer';

interface ContactFormData {
  parentName: string;
  childName: string;
  phone: string;
  email?: string;
  childAge: string;
  programme: string;
  branch: string;
  message?: string;
  leadSource?: string;
  leadMedium?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function sendSheetsFailureAlertEmail(
  lead: { parentName: string; phone: string; programme: string; branch: string },
  error: unknown,
): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error('[SheetsAlert] Gmail credentials not configured — cannot send Sheets failure alert');
    return;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .alert-box { background: #fff3cd; border: 2px solid #ffc107; border-radius: 6px; padding: 16px; margin: 16px 0; }
    .alert-title { color: #856404; font-size: 18px; font-weight: bold; margin: 0 0 8px; }
    table { border-collapse: collapse; width: 100%; max-width: 600px; margin: 16px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #f5f5f5; font-weight: bold; width: 180px; }
    .error-box { background: #f8d7da; border: 1px solid #f5c2c7; border-radius: 4px; padding: 12px; font-family: monospace; font-size: 13px; color: #842029; }
  </style>
</head>
<body>
  <div class="alert-box">
    <p class="alert-title">⚠️ ACTION REQUIRED — Lead NOT saved to Google Sheets</p>
    <p>A new enquiry was received and the notification email was sent, but the Google Sheets row could not be appended. Please add the lead manually.</p>
  </div>

  <p><strong>Lead details:</strong></p>
  <table>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>Parent Name</td><td>${lead.parentName}</td></tr>
    <tr><td>Mobile No</td><td>${lead.phone}</td></tr>
    <tr><td>Programme</td><td>${lead.programme}</td></tr>
    <tr><td>Preferred Centre</td><td>${lead.branch}</td></tr>
  </table>

  <p><strong>Error detail:</strong></p>
  <div class="error-box">${errorMessage}</div>

  <p>Please check the Google Sheets integration and the Replit server logs for more details.</p>
  <p>Best regards,<br>Rainbow Preschools Website (automated alert)</p>
</body>
</html>
  `.trim();

  const textBody = `
⚠️ ACTION REQUIRED — Lead NOT saved to Google Sheets

A new enquiry was received and the notification email was sent, but the
Google Sheets row could not be appended. Please add the lead manually.

Lead details:
  Parent Name      : ${lead.parentName}
  Mobile No        : ${lead.phone}
  Programme        : ${lead.programme}
  Preferred Centre : ${lead.branch}

Error:
  ${errorMessage}

Please check the Google Sheets integration and the Replit server logs.
  `.trim();

  try {
    await nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    }).sendMail({
      from: gmailUser,
      to: gmailUser,
      subject: `⚠️ Sheets sync FAILED for ${lead.parentName} — manual entry needed`,
      text: textBody,
      html: htmlBody,
    });
    console.log('[SheetsAlert] Failure alert email sent successfully');
  } catch (mailErr) {
    console.error('[SheetsAlert] Could not send failure alert email:', mailErr);
  }
}

export async function sendLeadNotificationEmail(data: ContactFormData): Promise<boolean> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error('Gmail credentials not configured');
    return false;
  }

  try {
    const emailSubject = `New Enquiry from ${data.parentName} - Rainbow Preschools Website`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    table { border-collapse: collapse; width: 100%; max-width: 600px; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #f5f5f5; font-weight: bold; width: 180px; }
    td { background-color: #fff; }
    a { color: #e91e63; }
  </style>
</head>
<body>
  <p>Dear Team,</p>
  <p>Here are the details of the newly generated lead:</p>
  
  <table>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>Parent_Name</td><td>${data.parentName}</td></tr>
    <tr><td>Student_Name</td><td>${data.childName}</td></tr>
    <tr><td>Mobile_No</td><td>${data.phone}</td></tr>
    <tr><td>Email_Id</td><td>${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : 'Not provided'}</td></tr>
    <tr><td>Child_Age</td><td>${data.childAge}</td></tr>
    <tr><td>Programme</td><td>${data.programme}</td></tr>
    <tr><td>Preferred_Centre</td><td>${data.branch}</td></tr>
    <tr><td>LeadSource</td><td>${data.leadSource || 'Website'}</td></tr>
    <tr><td>LeadMedium</td><td>${data.leadMedium || 'Website Enquiry Form'}</td></tr>
    <tr><td>Message</td><td>${data.message || 'No message provided'}</td></tr>
  </table>
  
  <p>Best regards,<br>Rainbow Preschools Website</p>
</body>
</html>
    `.trim();

    const textBody = `
Dear Team,

Here are the details of the newly generated lead:

Field                   | Value
------------------------|----------------------------------
Parent_Name             | ${data.parentName}
Student_Name            | ${data.childName}
Mobile_No               | ${data.phone}
Email_Id                | ${data.email || 'Not provided'}
Child_Age               | ${data.childAge}
Programme               | ${data.programme}
Preferred_Centre        | ${data.branch}
LeadSource              | ${data.leadSource || 'Website'}
LeadMedium              | ${data.leadMedium || 'Website Enquiry Form'}
Message                 | ${data.message || 'No message provided'}

Best regards,
Rainbow Preschools Website
    `.trim();

    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      subject: emailSubject,
      text: textBody,
      html: htmlBody
    });

    console.log('Lead notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send lead notification email:', error);
    return false;
  }
}
