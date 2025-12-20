// Gmail integration for sending email notifications
import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

interface ContactFormData {
  parentName: string;
  childName: string;
  phone: string;
  email: string;
  childAge: string;
  branch: string;
  message?: string;
}

export async function sendLeadNotificationEmail(data: ContactFormData): Promise<boolean> {
  try {
    const gmail = await getUncachableGmailClient();
    
    // Get user's email address
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const userEmail = profile.data.emailAddress;
    
    // Create email content with table layout similar to reference
    const emailSubject = `New Enquiry from ${data.parentName} - Rainbow Preschools Website`;
    const emailBody = `
Dear Team,

Here are the details of the newly generated lead:

Field                   | Value
------------------------|----------------------------------
Parent_Name             | ${data.parentName}
Student_Name            | ${data.childName}
Mobile_No               | ${data.phone}
Email_Id                | ${data.email}
Child_Age               | ${data.childAge}
Preferred_Centre        | ${data.branch}
LeadSource              | Website
LeadMedium              | Website Enquiry Form
Message                 | ${data.message || 'No message provided'}

Best regards,
Rainbow Preschools Website
    `.trim();

    // Create HTML version
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
    <tr><td>Email_Id</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><td>Child_Age</td><td>${data.childAge}</td></tr>
    <tr><td>Preferred_Centre</td><td>${data.branch}</td></tr>
    <tr><td>LeadSource</td><td>Website</td></tr>
    <tr><td>LeadMedium</td><td>Website Enquiry Form</td></tr>
    <tr><td>Message</td><td>${data.message || 'No message provided'}</td></tr>
  </table>
  
  <p>Best regards,<br>Rainbow Preschools Website</p>
</body>
</html>
    `.trim();

    // Create the email message
    const messageParts = [
      `From: ${userEmail}`,
      `To: ${userEmail}`,
      `Subject: ${emailSubject}`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="boundary"',
      '',
      '--boundary',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      emailBody,
      '',
      '--boundary',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlBody,
      '',
      '--boundary--'
    ];
    
    const rawMessage = messageParts.join('\r\n');
    const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send the email
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log('Lead notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send lead notification email:', error);
    return false;
  }
}
