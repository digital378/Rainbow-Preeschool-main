// Gmail SMTP integration for sending email notifications using nodemailer
import nodemailer from 'nodemailer';

interface ContactFormData {
  parentName: string;
  childName: string;
  phone: string;
  email: string;
  childAge: string;
  programme: string;
  branch: string;
  message?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

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
    <tr><td>Email_Id</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
    <tr><td>Child_Age</td><td>${data.childAge}</td></tr>
    <tr><td>Programme</td><td>${data.programme}</td></tr>
    <tr><td>Preferred_Centre</td><td>${data.branch}</td></tr>
    <tr><td>LeadSource</td><td>Website</td></tr>
    <tr><td>LeadMedium</td><td>Website Enquiry Form</td></tr>
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
Email_Id                | ${data.email}
Child_Age               | ${data.childAge}
Programme               | ${data.programme}
Preferred_Centre        | ${data.branch}
LeadSource              | Website
LeadMedium              | Website Enquiry Form
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
